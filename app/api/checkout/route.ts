import { createMollieClient } from '@mollie/api-client';
import { NextResponse } from 'next/server';
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";
import { sanitize } from "@/lib/common";

export const runtime = 'edge';

const VERIFY_PRICES_QUERY = gql`
  query ($ids: [ID]) {
    products(filters: { id: { in: $ids } }) {
      data {
        id
        attributes {
          price
          quantity
          title
        }
      }
    }
  }
`;

export async function POST(request: Request) {
  try {
    const { items, customerData } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Il carrello è vuoto' }, { status: 400 });
    }

    if (!customerData) {
      return NextResponse.json({ error: 'Dati cliente mancanti' }, { status: 400 });
    }

    // --- SECURITY: Sanitization ---
    const s = (val: any) => typeof val === 'string' ? sanitize(val) : val;
    const sanitizedCustomer = {
      ...customerData,
      firstName: s(customerData.firstName),
      lastName: s(customerData.lastName),
      email: s(customerData.email),
      phone: s(customerData.phone),
      address: s(customerData.address),
      houseNumber: s(customerData.houseNumber),
      city: s(customerData.city),
      province: s(customerData.province),
      zipCode: s(customerData.zipCode),
      country: s(customerData.country),
      denominazione: s(customerData.denominazione),
      vatNumber: s(customerData.vatNumber),
      sdiCode: s(customerData.sdiCode),
      pec: s(customerData.pec),
      billingAddress: s(customerData.billingAddress),
      billingHouseNumber: s(customerData.billingHouseNumber),
      billingCity: s(customerData.billingCity),
      billingZipCode: s(customerData.billingZipCode),
      billingProvince: s(customerData.billingProvince),
      billingCountry: s(customerData.billingCountry),
    };

    // --- SECURITY & ROBUSTNESS: Server-Side Price & Stock Verification ---
    const itemIds = items.map((item: any) => item.id);
    
    const { data: queryData } = await createApolloClient().query({
      query: VERIFY_PRICES_QUERY,
      variables: { ids: itemIds },
      fetchPolicy: 'no-cache'
    });

    const realProducts = queryData.products.data;
    let verifiedSubtotal = 0;
    
    for (const cartItem of items) {
      const dbProduct = realProducts.find((p: any) => p.id === cartItem.id);
      
      if (!dbProduct) {
        return NextResponse.json({ error: `Prodotto non trovato: ${cartItem.id}` }, { status: 400 });
      }

      if (cartItem.quantity > dbProduct.attributes.quantity) {
        return NextResponse.json({ 
          error: `Quantità insufficiente per "${dbProduct.attributes.title}". Disponibili: ${dbProduct.attributes.quantity}` 
        }, { status: 400 });
      }

      const realPrice = dbProduct.attributes.price;
      verifiedSubtotal += realPrice * cartItem.quantity;
    }

    const total = verifiedSubtotal;

    const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY as string });

    const orderId = `order_${Date.now()}`;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: total.toFixed(2),
      },
      description: `Ordine Silano SRL - ${items.length} articoli`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      ...(process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') 
        ? {} 
        : { webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mollie` }),
      billingEmail: sanitizedCustomer.email,
      metadata: {
        order_id: orderId,
        customer: {
          name: sanitizedCustomer.customerType === 'azienda' 
            ? sanitizedCustomer.denominazione 
            : `${sanitizedCustomer.firstName} ${sanitizedCustomer.lastName}`,
          phone: sanitizedCustomer.phone,
          email: sanitizedCustomer.email,
          type: sanitizedCustomer.customerType,
        },
        shipping_address: {
          streetAndNumber: `${sanitizedCustomer.address} ${sanitizedCustomer.houseNumber}`,
          postalCode: sanitizedCustomer.zipCode,
          city: sanitizedCustomer.city,
          province: sanitizedCustomer.province,
          country: sanitizedCustomer.country,
        },
        billing_address: {
          streetAndNumber: `${sanitizedCustomer.billingAddress} ${sanitizedCustomer.billingHouseNumber}`,
          postalCode: sanitizedCustomer.billingZipCode,
          city: sanitizedCustomer.billingCity,
          province: sanitizedCustomer.billingProvince,
          country: sanitizedCustomer.billingCountry,
        },
        invoice: sanitizedCustomer.customerType === 'azienda' ? {
          denominazione: sanitizedCustomer.denominazione,
          vat: sanitizedCustomer.vatNumber,
          sdi: sanitizedCustomer.sdiCode,
          pec: sanitizedCustomer.pec
        } : null,
        items: items.map((i: any) => ({ 
          id: i.id, 
          qty: i.quantity, 
          title: i.title,
          verified_unit_price: realProducts.find((p: any) => p.id === i.id)?.attributes.price
        })),
      },
    });

    return NextResponse.json({ url: payment.getCheckoutUrl() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
