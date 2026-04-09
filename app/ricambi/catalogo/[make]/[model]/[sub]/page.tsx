import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import RicambiHero from "@/app/components/custom/ricambiHero";
import CardProduct from "@/app/components/ui/cardProduct";

//Ogni giorno effettua il revalidate
export const revalidate = 3600;
export const runtime = 'edge';

const LISTING_QUERY = gql`
  query ($sub: String, $make: String, $model: String) {
    models(filters: { slug: { eqi: $model }, make: { slug: { eqi: $make } } }) {
      data {
        attributes {
          name
          slug
          make {
            data {
              attributes {
                name
                slug
              }
            }
          }
        }
      }
    }
    subCategories(filters: { slug: { eqi: $sub } }) {
      data {
        attributes {
          name
          slug
          defaultShippingCost
          category {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
    products(
      filters: {
        and: [
          { compatibilities: { make: { slug: { eqi: $make } } } }
          { compatibilities: { model: { slug: { eqi: $model } } } }
          { sub_category: { slug: { eqi: $sub } } }
          { quantity: { gt: 0 } }
        ]
      }
      pagination: { pageSize: 100 }
    ) {
      data {
        id
        attributes {
          quantity
          price
          OE
          motorType
          slug
          compatibilities {
            id
            make { data { attributes { name } } }
            model { data { attributes { name } } }
            engine_capacity { data { attributes { capacity } } }
            fuel_system { data { attributes { name } } }
          }
          images {
            data {
              attributes {
                formats
                url
              }
            }
          }
          sub_category {
            data {
              id
              attributes {
                name
                slug
                defaultShippingCost
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Memoized data fetch for the listing page
 */
const getListingData = cache(async (make: string, model: string, sub: string) => {
  const { data } = await createApolloClient().query({
    query: LISTING_QUERY,
    variables: { make, model, sub },
  });
  return data;
});

// Genero i metadata per il SEO
export async function generateMetadata(props: {
  params: Promise<{ make: string; model: string; sub: string }>;
}): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug, sub: subSlug } = await props.params;
  const data = await getListingData(makeSlug, modelSlug, subSlug);

  const model = data?.models?.data?.[0]?.attributes;
  const make = model?.make?.data?.attributes;
  const sub = data?.subCategories?.data?.[0]?.attributes;

  if (!make || !model || !sub) {
    return { title: "Ricambi Usati | Silano" };
  }

  const title = `Vendita ${sub.name} ${make.name} ${model.name} Usati | Silano`;
  const description = `Acquista ${sub.name} per ${make.name} ${model.name} su Silano. Ricambi auto usati, garantiti e pronti per la spedizione. Qualità e risparmio per la tua auto.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Subcategory(props: {
  params: Promise<{ make: string; model: string; sub: string }>;
}) {
  const { make: makeSlug, model: modelSlug, sub: subSlug } = await props.params;

  // Fetch data
  const data = await getListingData(makeSlug, modelSlug, subSlug);

  const model = data?.models?.data?.[0]?.attributes;
  const make = model?.make?.data?.attributes;
  const sub = data?.subCategories?.data?.[0]?.attributes;
  const products = data?.products?.data || [];

  if (!make || !model || !sub) {
    notFound();
  }

  const crumbs = [
    { label: "Inizio", link: "/ricambi" },
    { label: make.name, link: `/ricambi/catalogo/${makeSlug}` },
    { label: model.name, link: `/ricambi/catalogo/${makeSlug}/${modelSlug}` },
    { label: sub.name, link: `/ricambi/catalogo/${makeSlug}/${modelSlug}/${subSlug}` },
  ];

  return (
    <div className="w-full h-full px-4 lg:px-16 py-12">
      <div className="w-full">
        <RicambiHero 
          title={`${sub.name} ${make.name} ${model.name}`} 
          description={`Visualizza i ricambi disponibili per la categoria ${sub.name}. Seleziona un prodotto per vedere i dettagli e procedere all'acquisto.`}
          currentStep={3}
          brandName={make.name}
          modelName={model.name}
          subCategoryName={sub.name}
        />

        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <section id="selezione-prodotti" className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-6 bg-forest rounded-full"></span>
              Risultati della ricerca
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {products.length} {products.length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((prod: any) => (
                <CardProduct
                  key={prod.id}
                  id={prod.id}
                  imageUrl={
                    prod.attributes.images?.data?.[0]?.attributes?.formats?.small?.url || 
                    prod.attributes.images?.data?.[0]?.attributes?.url
                  }
                  slug={prod.attributes.slug}
                  price={prod.attributes.price}
                  shippingCost={prod.attributes.sub_category?.data?.[0]?.attributes?.defaultShippingCost ?? sub.defaultShippingCost ?? 15}
                  quantity={prod.attributes.quantity}
                  sub_category={prod.attributes.sub_category}
                  compatibilities={prod.attributes.compatibilities}
                  OE={prod.attributes.OE}
                  motorType={prod.attributes.motorType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nessun prodotto trovato</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Al momento non abbiamo ricambi disponibili per questa categoria specifica. Prova a cercare un'altra categoria o contattaci.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
