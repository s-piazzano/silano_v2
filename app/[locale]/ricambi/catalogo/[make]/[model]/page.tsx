import { Metadata } from "next";
import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/[locale]/components/ui/breadcrumbs";
import SubcategoryTable from "@/app/[locale]/components/custom/subcategoriesTable";

export const revalidate = 3600;

const queryStaticPath = gql`
  query ($slug: String) {
    models(filters: { slug: { eqi: $slug } }) {
      data {
        id
        attributes {
          slug
        }
      }
    }
  }
`;

const query = gql`
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

// Genero i path per la build
export async function generateStaticParams({
  params,
}: {
  params: { model: string };
}) {
  // Fetch data
  const { data } = await createApolloClient().query({
    query: queryStaticPath,
    variables: { slug: params.model },
  });
  const models = data.models.data;

  // Automatic generation of paths
  const slugs = models.map(
    (x) =>
      new Object({
        params: x.attributes,
      })
  );

  return models.map((model) => ({
    slug: model.slug,
    fallback: true,
  }));
}

export default async function Subcategory(
  props: {
    params: Promise<{ model: string }>;
  }
) {
  const params = await props.params;
  // Leggo lo slug dai parametri di route
  const modelSlug = params.model;

  // Fetch data
  const { data } = await createApolloClient().query({
    query: query,
    variables: { model: modelSlug },
  });

  // Se non esiste un modello passato dallo slug restituisco 404
  if (data.models.data.length === 0) {
    notFound();
  }

  const make = data.models.data[0].attributes.make.data.attributes;
  const model = data.models.data[0].attributes;
  const subs = data.products.data.map(
    (prod) => prod.attributes.sub_category.data[0]
  );

  const crumbs = [
    {
      label: "Inizio",
      link: "/ricambi",
    },
    {
      label: make.name,
      link: `/ricambi/catalogo/${make.slug}`,
    },
  ];

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-4">{`${make.name} ${model.name}`}</h1>
        <Breadcrumbs crumbs={crumbs} />
        <h3 className="my-2">Scegli la categoria</h3>
        <SubcategoryTable subcategories={subs} />
      </div>
    </div>
  );
}
