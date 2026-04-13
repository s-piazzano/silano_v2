import { cache } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { 
  ShoppingBagIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  ListBulletIcon,
  ArrowPathIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import Gallery from "@/app/components/ui/gallery";
import Tabs from "@/app/components/ui/tabs";
import CardProduct from "@/app/components/ui/cardProduct";
import { toInteger, extractDecimal } from "@/lib/common";
import { generateTitle } from "@/utils/common";
import CartActions from "@/app/components/custom/cartActions";

export const revalidate = 3600;
export const runtime = 'edge';

const PRODUCT_QUERY = gql`
  query ($slug: String) {
    products(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          updatedAt
          OE
          motorType
          description
          price
          title
          quantity
          slug
          sub_category(sort: "name:asc") {
            data {
              attributes {
                name
                slug
                defaultShippingCost
              }
            }
          }
          compatibilities {
            make { data { attributes { name slug } } }
            model { data { attributes { name slug } } }
            engine_capacity { data { attributes { capacity } } }
            fuel_system { data { attributes { name } } }
          }
          images {
            data {
              id
              attributes {
                url
                formats
              }
            }
          }
        }
      }
    }
  }
`;

const RELATED_PRODUCTS_QUERY = gql`
  query ($subCategorySlug: String, $currentSlug: String) {
    products(
      filters: { 
        sub_category: { slug: { eq: $subCategorySlug } },
        slug: { ne: $currentSlug }
      },
      pagination: { limit: 4 }
    ) {
      data {
        id
        attributes {
          title
          slug
          price
          quantity
          OE
          motorType
          sub_category {
            data {
              attributes {
                name
              }
            }
          }
          compatibilities {
            make { data { attributes { name } } }
            model { data { attributes { name } } }
            engine_capacity { data { attributes { capacity } } }
            fuel_system { data { attributes { name } } }
          }
          images {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Memoized fetch for product data
 */
const getProductData = cache(async (slug: string) => {
  const { data } = await createApolloClient().query({
    query: PRODUCT_QUERY,
    variables: { slug },
  });
  return data.products.data[0];
});

/**
 * Fetch related products
 */
const getRelatedProducts = async (subCategorySlug: string, currentSlug: string) => {
  const { data } = await createApolloClient().query({
    query: RELATED_PRODUCTS_QUERY,
    variables: { subCategorySlug, currentSlug },
  });
  return data.products.data;
};

const generateDescription = (sub: any, comps: any[], customDescription: string) => {
  if (customDescription) return customDescription;
  
  const subName = sub?.[0]?.attributes?.name || "Ricambio";
  const compatibilityText = comps
    ?.slice(0, 3)
    ?.map((comp) => `${comp.make.data?.attributes?.name} ${comp.model.data?.attributes?.name}`)
    ?.join(", ");

  return `Acquista ${subName} usato e garantito per ${compatibilityText}. Qualità certificata Silano, spedizione veloce e supporto tecnico specializzato.`;
};

// Genero i metadata per il SEO
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductData(slug);

  if (!product) return { title: "Ricambio non trovato | Silano" };

  const attributes = product.attributes;
  const title = generateTitle(
    attributes.sub_category.data,
    attributes.compatibilities,
    attributes.OE,
    attributes.motorType
  );
  
  const description = generateDescription(
    attributes.sub_category.data,
    attributes.compatibilities,
    attributes.description
  );

  return {
    title: `${title} | Ricambi Auto Usati Silano`,
    description,
    openGraph: {
      title,
      description,
      images: [attributes.images?.data?.[0]?.attributes?.url],
    },
  };
}

export default async function RicambiPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductData(slug);

  if (!product) notFound();

  const attrs = product.attributes;
  const isAvailable = attrs.quantity > 0;
  const hasPrice = attrs.price && attrs.price > 0;
  const shippingCost = attrs.sub_category.data[0]?.attributes?.defaultShippingCost ?? 15;
  const totalPrice = hasPrice ? (attrs.price + shippingCost) : 0;
  const subCategorySlug = attrs.sub_category.data[0]?.attributes?.slug;

  const relatedProducts = subCategorySlug ? await getRelatedProducts(subCategorySlug, slug) : [];

  const productTitle = generateTitle(
    attrs.sub_category.data,
    attrs.compatibilities,
    attrs.OE,
    attrs.motorType
  );

  // Link WhatsApp per quotazione o info
  const waNumber = "393929898074";
  const waBaseUrl = `https://wa.me/${waNumber}?text=`;
  const quoteMessage = encodeURIComponent(`Buongiorno Silano, vorrei una quotazione per: ${productTitle} (Rif: ${product.id})`);

  const crumbs = [
    { label: "Inizio", link: "/ricambi" },
    { 
      label: attrs.compatibilities[0]?.make?.data?.attributes?.name || "Marca", 
      link: `/ricambi/catalogo/${attrs.compatibilities[0]?.make?.data?.attributes?.slug}` 
    },
    { 
      label: attrs.compatibilities[0]?.model?.data?.attributes?.name || "Modello", 
      link: `/ricambi/catalogo/${attrs.compatibilities[0]?.make?.data?.attributes?.slug}/${attrs.compatibilities[0]?.model?.data?.attributes?.slug}` 
    },
    { 
      label: attrs.sub_category.data[0]?.attributes?.name || "Categoria", 
      link: `/ricambi/catalogo/${attrs.compatibilities[0]?.make?.data?.attributes?.slug}/${attrs.compatibilities[0]?.model?.data?.attributes?.slug}/${attrs.sub_category.data[0]?.attributes?.slug}` 
    },
  ];

  // Tab Definitions
  const tabs = [
    {
      id: "description",
      label: "Descrizione",
      iconName: "description",
      content: (
        <div className="prose prose-forest max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap py-4">
          {generateDescription(attrs.sub_category.data, attrs.compatibilities, attrs.description)}
        </div>
      )
    },
    {
      id: "compatibility",
      label: "Compatibilità Auto",
      iconName: "compatibility",
      content: (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm my-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Marca & Modello</th>
                <th className="px-6 py-4">Cilindrata</th>
                <th className="px-6 py-4">Alimentazione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attrs.compatibilities.map((comp: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {comp.make.data?.attributes?.name} {comp.model.data?.attributes?.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {comp.engine_capacity.data?.attributes?.capacity || "N/D"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium capitalize">
                    {comp.fuel_system.data?.attributes?.name || "N/D"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: "shipping",
      label: "Spedizione e Garanzia",
      iconName: "shipping",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-gray-900">
              <TruckIcon className="w-5 h-5 text-forest" />
              Spedizioni Veloci
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed text-stone-900">
              Il prodotto viene imballato con cura e spedito tramite corriere espresso. 
              La consegna avviene solitamente in **24/48 ore** lavorative dall&apos;ordine. 
              Garantiamo la tracciabilità completa del pacco.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-gray-900">
              <ArrowPathIcon className="w-5 h-5 text-forest" />
              Politica di Reso
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed text-stone-900">
              Ogni ricambio è testato e garantito. Se il pezzo non dovesse essere conforme, 
              hai **14 giorni** per richiedere il reso. Il nostro team tecnico è a disposizione 
              per assisterti nel processo.
            </p>
          </div>
        </div>
      )
    }
  ];

  // JSON-LD per Google
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productTitle,
    "image": attrs.images?.data?.map((img: any) => img.attributes.url),
    "description": generateDescription(attrs.sub_category.data, attrs.compatibilities, attrs.description),
    "sku": attrs.OE || product.id,
    "brand": {
      "@type": "Brand",
      "name": attrs.compatibilities[0]?.make?.data?.attributes?.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/ricambi/${slug}`,
      "priceCurrency": "EUR",
      "price": totalPrice,
      "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/UsedCondition"
    }
  };

  return (
    <div className="bg-white min-h-screen text-stone-900">
      {/* Script per i dati strutturati */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e") 
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-16 py-8">
        <div className="mb-8 border-stone-900">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery - Left (lg:7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gray-50 rounded-3xl overflow-hidden p-4 md:p-8">
              <Gallery images={attrs.images} />
            </div>
            
            {/* Desktop Technical Specs */}
            <div className="hidden lg:block bg-gray-50 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <InformationCircleIcon className="w-6 h-6 text-forest" />
                Dettagli Tecnici
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 text-stone-900">
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-1">Codice OE</p>
                    <p className="text-lg font-mono text-gray-700">{attrs.OE || "N/D"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-1">Tipo Motore</p>
                    <p className="text-lg font-semibold text-gray-700 uppercase">{attrs.motorType || "N/D"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-1">Condizione</p>
                    <p className="text-lg font-semibold text-gray-700">Usato</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-1">Giacenza</p>
                    <p className="text-lg font-semibold text-gray-700">{attrs.quantity} unità disponibili</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info - Right (lg:5 columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-forest font-bold text-sm tracking-widest uppercase text-stone-900">
                <span className="w-8 h-[2px] bg-forest"></span>
                Ricambio Verificato
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {productTitle}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isAvailable ? <><CheckCircleIcon className="w-4 h-4" /> Disponibile</> : <><XCircleIcon className="w-4 h-4" /> Non disponibile</>}
                </div>
                {isAvailable && attrs.quantity <= 3 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                    <FireIcon className="w-4 h-4" /> 
                    Solo {attrs.quantity} {attrs.quantity === 1 ? 'disponibile' : 'disponibili'}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <SparklesIcon className="w-4 h-4" /> 
                  Testato
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              {hasPrice ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-forest">
                      € {toInteger(totalPrice)}
                    </span>
                    <span className="text-lg font-bold text-forest -ml-1">
                      {extractDecimal(totalPrice)}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Spedizione inclusa nel prezzo
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-black text-gray-400 uppercase">Prezzo da definire</p>
                  <p className="text-sm text-gray-500">Contatta il nostro magazzino per ricevere una quotazione aggiornata e le spese di spedizione.</p>
                </div>
              )}

              <CartActions 
                product={{
                  id: product.id,
                  slug: slug,
                  title: productTitle,
                  price: attrs.price,
                  totalPrice: totalPrice,
                  quantity: attrs.quantity,
                  image: attrs.images?.data?.[0]?.attributes?.formats?.thumbnail?.url || attrs.images?.data?.[0]?.attributes?.url
                }}
                isAvailable={isAvailable}
                hasPrice={hasPrice}
                waBaseUrl={waBaseUrl}
                quoteMessage={quoteMessage}
              />

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <ClockIcon className="w-5 h-5 text-forest" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Spedizione in 24/48h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-forest" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Testato dai tecnici</span>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <CreditCardIcon className="w-4 h-4" /> Pagamenti Sicuri
              </p>
              <div className="flex justify-center opacity-70 grayscale hover:grayscale-0 transition-all">
                <Image src="/carte.webp" width={220} height={40} alt="metodi di pagamento" unoptimized />
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section */}
        <div className="mt-20 lg:max-w-4xl">
          <Tabs tabs={tabs} />
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-forest rounded-full"></span>
              Prodotti Recenti in {attrs.sub_category.data[0]?.attributes?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p: any) => (
                <CardProduct
                  key={p.id}
                  id={p.id}
                  slug={p.attributes.slug}
                  imageUrl={p.attributes.images?.data?.[0]?.attributes?.url}
                  price={p.attributes.price}
                  quantity={p.attributes.quantity}
                  OE={p.attributes.OE}
                  motorType={p.attributes.motorType}
                  sub_category={p.attributes.sub_category}
                  compatibilities={p.attributes.compatibilities}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY CALL TO ACTION */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transform transition-transform duration-300">
        <CartActions 
          product={{
            id: product.id,
            slug: slug,
            title: productTitle,
            price: attrs.price,
            totalPrice: totalPrice,
            quantity: attrs.quantity,
            image: attrs.images?.data?.[0]?.attributes?.formats?.thumbnail?.url || attrs.images?.data?.[0]?.attributes?.url
          }}
          isAvailable={isAvailable}
          hasPrice={hasPrice}
          waBaseUrl={waBaseUrl}
          quoteMessage={quoteMessage}
          variant="mobile"
        />
      </div>
    </div>
  );
}
