import { Metadata } from "next";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import { reduceSameInitialString } from "@/lib/common";
import Classifier from "../components/custom/classifier";

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

// Genero i metadata per il SEO
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data
  const { data } = await createApolloClient().query({
    query: querySEO,
    variables: { page: "ricambi" },
  });

  const seo = data.pages.data[0].attributes.seo;

  return {
    title: seo?.title,
    description: seo?.title,
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      images: [{ url: seo?.image?.data?.attributes?.url }],
    },
  };
}

export default async function Ricambi() {
  const { data } = await createApolloClient().query({
    query,
    variables: { page: "ricambi" },
  });

  const page = data.pages.data[0].attributes;
  const makes = data.makes.data.map((make) => make.attributes.name);

  const makeSerialized = data.makes.data.map((make) => {
    return {
      name: make.attributes.name,
      url: `/ricambi/catalogo/${make.attributes.slug}`,
    };
  });
  const alf = reduceSameInitialString(makes);

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-8">{page.title}</h1>
        <h2 className="-mt-4 mb-4">{page.description}</h2>

        <h3 className="mb-2">Scegli Marca</h3>
        <Classifier divItems={alf} items={makeSerialized} />
      </div>
    </div>
  );
}
