import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import SubcategoryTable from "@/app/components/custom/subcategoriesTable";
import RicambiHero from "@/app/components/custom/ricambiHero";

export const revalidate = 3600;
export const runtime = 'edge';

const MODEL_QUERY = gql`
  query ($model: String) {
    models(filters: { slug: { eqi: $model } }) {
      data {
        id
        attributes {
          name
          slug
          make {
            data {
              id
              attributes {
                name
                slug
              }
            }
          }
        }
      }
    }
    products(
      filters: {
        and: [
          { compatibilities: { model: { slug: { eqi: $model } } } }
          { quantity: { gt: 0 } }
        ]
      }
      pagination: { pageSize: 1000 }
    ) {
      data {
        id
        attributes {
          sub_category(sort: "name:asc") {
            data {
              id
              attributes {
                name
                slug
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
        }
      }
    }
  }
`;

/**
 * Memoized data fetch for the model page
 */
const getModelData = cache(async (modelSlug: string) => {
  const { data } = await createApolloClient().query({
    query: MODEL_QUERY,
    variables: { model: modelSlug },
  });
  return data;
});



export async function generateMetadata(props: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model: modelSlug } = await props.params;
  const data = await getModelData(modelSlug);

  const model = data?.models?.data?.[0]?.attributes;
  const make = model?.make?.data?.attributes;

  if (!model || !make) {
    return { title: "Ricambi Usati | Silano" };
  }

  const title = `Ricambi Usati ${make.name} ${model.name} | Silano`;
  const description = `Scopri i ricambi usati disponibili per ${make.name} ${model.name} su Silano. Qualità garantita e spedizione veloce.`;

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
  params: Promise<{ model: string }>;
}) {
  const params = await props.params;
  const modelSlug = params.model;

  // Fetch data
  const data = await getModelData(modelSlug);

  // Se non esiste un modello passato dallo slug restituisco 404
  if (!data?.models?.data || data.models.data.length === 0) {
    notFound();
  }

  const make = data.models.data[0].attributes.make.data.attributes;
  const model = data.models.data[0].attributes;
  const subs =
    data.products.data
      ?.map((prod: any) => prod.attributes.sub_category.data?.[0])
      .filter(Boolean) || [];

  const crumbs = [
    {
      label: "Inizio",
      link: "/ricambi",
    },
    {
      label: make.name,
      link: `/ricambi/catalogo/${make.slug}`,
    },
    {
      label: model.name,
      link: `/ricambi/catalogo/${make.slug}/${model.slug}`,
    },
  ];

  return (
    <div className="w-full h-full px-4 lg:px-16 py-12">
      <div className="w-full">
        {/* Hero Section with Search and Steps */}
        <RicambiHero 
          title={`Ricambi ${make.name} ${model.name}`} 
          description={`Esplora le categorie di ricambi disponibili per la tua ${make.name} ${model.name}. Seleziona una categoria per vedere i componenti.`}
          currentStep={3}
          brandName={make.name}
          modelName={model.name}
        />

        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <section id="selezione-categorie" className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-6 bg-forest rounded-full"></span>
            Scegli la categoria
          </h3>
          <SubcategoryTable subcategories={subs} />
        </section>
      </div>
    </div>
  );
}
