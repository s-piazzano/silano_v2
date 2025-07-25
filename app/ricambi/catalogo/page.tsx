import { Metadata } from "next";
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import { reduceSameInitialString } from "@/lib/common";
import Classifier from "@/app/components/custom/classifier";

// Ogni 5 giorni aggiorna i dati contenuti nella pagina
export const revalidate = 432000;

const querySEO = gql`
  query ($page: String) {
    pages(filters: { title: { eqi: $page } }) {
      data {
        attributes {
          seo {
            title
            description
            image {
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
  }
`;

const query = gql`
  query ($page: String) {
    pages(filters: { title: { eqi: $page } }) {
      data {
        attributes {
          title
          description
        }
      }
    }
    makes(
      pagination: { pageSize: 200 }
      sort: "name:asc"
      filters: { warehouseVisible: { eq: true } }
    ) {
      data {
        id
        attributes {
          name
          slug
        }
      }
    }
  }
`;

// Metadata SEO
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await createApolloClient().query({
    query: querySEO,
    variables: { page: "ricambi" },
  });

  const pageData = data?.pages?.data?.[0];
  const seo = pageData?.attributes?.seo;

  return {
    title: seo?.title || "Ricambi",
    description: seo?.description || "",
    openGraph: {
      title: seo?.title || "Ricambi",
      description: seo?.description || "",
      images: seo?.image?.data?.attributes?.url
        ? [{ url: seo.image.data.attributes.url }]
        : [],
    },
  };
}

export default async function Ricambi() {
  const { data } = await createApolloClient().query({
    query,
    variables: { page: "ricambi" },
  });

  const pageData = data?.pages?.data?.[0];
  const makesData = data?.makes?.data;

  // Controlli difensivi
  if (!pageData || !makesData || makesData.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-500">Errore nel caricamento dati</h1>
        <p>Contenuti non disponibili. Verifica i dati nel CMS o nel backend.</p>
      </div>
    );
  }

  const page = pageData.attributes;
  const makes = makesData.map((make) => make.attributes.name);
  const makeSerialized = makesData.map((make) => ({
    name: make.attributes.name,
    url: `/ricambi/catalogo/${make.attributes.slug}`,
  }));

  const alf = reduceSameInitialString(makes);

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        <h1 className="uppercase text-2xl mb-8">{page.title}</h1>
        <h2 className="-mt-4 mb-8">{page.description}</h2>

        <h3 className="mb-2">Scegli Marca</h3>
        <Classifier divItems={alf} items={makeSerialized} />
      </div>
    </div>
  );
}
