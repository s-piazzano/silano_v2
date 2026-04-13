import { NextResponse } from 'next/server';
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";
import { sendOrderEmail, sendAdminNotification } from "@/lib/email";

export const runtime = 'edge';

const CHECK_EXISTING_ORDER_QUERY = gql`
  query ($paymentId: String) {
    orders(filters: { payment_id: { eq: $paymentId } }) {
      data {
        id
      }
    }
  }
`;

const UPDATE_STOCK_MUTATION = gql`
  mutation ($id: ID!, $quantity: Int!) {
    updateProduct(id: $id, data: { quantity: $quantity }) {
      data {
        id
      }
    }
  }
`;

const GET_PRODUCT_STOCK_QUERY = gql`
  query ($id: ID!) {
    product(id: $id) {
      data {
        attributes {
          quantity
        }
      }
    }
  }
`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get('id') as string;

    if (!paymentId) {
      return new Response('Missing ID', { status: 400 });
    }

    // --- NATIVE MOLLIE API CALL (Cloudflare Edge compatible) ---
    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}`,
      },
    });

    const payment = await mollieResponse.json();

    if (!mollieResponse.ok) {
      console.error('[Mollie Webhook Error]', payment);
      return new Response('Mollie API Error', { status: 500 });
    }

    const metadata = payment.metadata as any;

    // Logica di integrazione Strapi
    if (payment.status === 'paid' || payment.status === 'authorized') {
      
      const apolloClient = createApolloClient();
      const { data: existingData } = await apolloClient.query({
        query: CHECK_EXISTING_ORDER_QUERY,
        variables: { paymentId: payment.id }
      });

      if (existingData.orders.data.length > 0) {
        return new Response('OK', { status: 200 });
      }

      const strapiData = {
        data: {
          order_id: metadata.order_id,
          payment_id: payment.id,
          status: payment.status,
          total_amount: parseFloat(payment.amount.value),
          customer_type: metadata.customer?.type || 'privato',
          email: metadata.customer?.email,
          phone: metadata.customer?.phone,
          denominazione: metadata.customer?.type === 'azienda' ? metadata.customer.name : null,
          first_name: metadata.customer?.type === 'privato' ? metadata.customer.name.split(' ')[0] : null,
          last_name: metadata.customer?.type === 'privato' ? metadata.customer.name.split(' ').slice(1).join(' ') : null,
          
          billing_address: metadata.billing_address?.streetAndNumber,
          billing_city: metadata.billing_address?.city,
          billing_zip: metadata.billing_address?.postalCode,
          billing_province: metadata.billing_address?.province,
          
          vat_number: metadata.invoice?.vat,
          sdi_code: metadata.invoice?.sdi,
          pec: metadata.invoice?.pec,
          
          shipping_address: metadata.shipping_address?.streetAndNumber,
          shipping_city: metadata.shipping_address?.city,
          shipping_zip: metadata.shipping_address?.postalCode,
          shipping_province: metadata.shipping_address?.province,
          
          items: metadata.items
        }
      };

      try {
        const orderResponse = await fetch(`${process.env.BASE_URL_FETCH}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
          },
          body: JSON.stringify(strapiData)
        });

        if (!orderResponse.ok) {
          const errorText = await orderResponse.text();
          console.error('[Webhook Strapi Order Error]', errorText);
        } else {
          // --- INVIO EMAIL ---
          try {
            const emailData = {
              order_id: metadata.order_id,
              customer_name: metadata.customer?.name,
              customer_email: metadata.customer?.email,
              customer_type: metadata.customer?.type,
              shipping_address: metadata.shipping_address,
              total_amount: parseFloat(payment.amount.value),
              items: metadata.items
            };

            // Email al Cliente
            await sendOrderEmail({
              to: metadata.customer?.email,
              subject: `📦 Conferma Ordine #${metadata.order_id} - Silano SRL`,
              orderData: emailData
            });

            // Notifica Admin
            await sendAdminNotification(emailData);
          } catch (emailErr) {
            console.error('[Webhook Email Trigger Error]', emailErr);
          }

          // --- AGGIORNAMENTO STOCK ---
          if (metadata.items && Array.isArray(metadata.items)) {
            for (const item of metadata.items) {
              try {
                const { data: prodData } = await apolloClient.query({
                  query: GET_PRODUCT_STOCK_QUERY,
                  variables: { id: item.id },
                  fetchPolicy: 'no-cache'
                });

                const currentQty = prodData.product.data.attributes.quantity;
                const newQty = Math.max(0, currentQty - item.qty);

                await apolloClient.mutate({
                  mutation: UPDATE_STOCK_MUTATION,
                  variables: { id: item.id, quantity: newQty }
                });
              } catch (stockErr) {
                console.error(`[Webhook Stock Error] ${item.id}:`, stockErr);
              }
            }
          }
        }
      } catch (strapiError) {
        console.error('[Connection Error]', strapiError);
      }

    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return new Response('Internal Error', { status: 500 });
  }
}
