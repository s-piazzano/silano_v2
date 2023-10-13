import { Metadata } from "next";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import DocumentToHtmlString from "../components/custom/documentToHtmlString";
import Maps from "@/app/components/custom/maps";

const querySEO = gql`
  query {
    contact {
      data {
        id
        attributes {
          description
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
  query {
    contact {
      data {
        id
        attributes {
          description
        }
      }
    }
  }
`;

// Genero i metadata per il SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch data
  const { data } = await getClient().query({
    query: querySEO,
  });

  const seo = data.contact.data.attributes.seo;

  return {
    title: seo.title,
    description: seo.title,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.image?.data?.attributes?.url }],
    },
  };
}

export default async function Contatti() {
  // Fetch data
  const { data } = await getClient().query({
    query: query,
  });
  const contact = data.contact.data.attributes;

  return (
    <div className="w-full flex flex-col md:flex-row px-4 md:px-16 py-8 mb-12">
      <div className="w-full md:w-4/12 mb-4">
        {/*  Dati anagrafici dell'azienda */}
        <DocumentToHtmlString description={contact.description} />
      </div>
      <div className="w-full md:w-8/12">
        <Maps width={300} height={500} />
      </div>
    </div>
  );
}
