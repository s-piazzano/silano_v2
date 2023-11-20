import { Metadata } from "next";
import dynamic from "next/dynamic";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import DocumentToHtmlString from "../components/custom/documentToHtmlString";
const Maps = dynamic(() => import("@/app/components/custom/maps"));


const querySEO = gql`
  query {
    contact {
      data {
        attributes {
          seo {
            title
            description
            image {
              data {
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
  }
`;

const query = gql`
  query {
    contact {
      data {
        attributes {
          description
        }
      }
    }
  }
`;

// Genero i metadata per il SEO
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data
  const { data } = await getClient().query({
    query: querySEO,
  });


  const {
    data: {
      attributes: { seo },
    },
  } = data.contact;

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
  const { data } = await getClient().query({
    query,
  });

  const {
    data: {
      attributes: { description },
    },
  } = data.contact;

  return (
    <div className="w-full flex flex-col md:flex-row px-4 md:px-16 py-8">
      <div className="w-full md:w-4/12 mb-4">
        <DocumentToHtmlString description={description} />
      </div>
      <div className="w-full md:w-8/12">
        <Maps width={300} height={500} />
      </div>
    </div>
  );
}
