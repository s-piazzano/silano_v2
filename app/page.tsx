import { Metadata } from "next";
import dynamic from "next/dynamic";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Header from "./components/header";
import Activities from "./components/custom/activities";
const Maps = dynamic(() => import("./components/custom/maps"));

const querySEO = gql`
  query {
    homepage {
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
    homepage {
      data {
        id
        attributes {
          slogan
          subtitle
          title
          activities {
            id
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
            link {
              name
              url
            }
          }
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
// Genero i metadata per il SEO
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data
  const { data } = await createApolloClient().query({
    query: querySEO,
  });

  const {
    data: {
      attributes: { seo },
    },
  } = data.homepage;

  return {
    title: seo.title,
    description: seo.title,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.image.data.attributes.url }],
    },
  };
}

export default async function Home() {
  //Fetch data
  const { data } = await createApolloClient().query({
    query,
    variables: { menu: "default" },
  });

  const {
    data: {
      attributes: { subtitle, title, slogan, activities },
    },
  } = data.homepage;

  return (
    <>
      <div className="w-full">
        {/* Header contenente lo slogan */}
        <div className="w-full h-screen">
          <Header
            title={title}
            subtitle={subtitle}
            slogan={slogan}
            activities={activities}
          />
        </div>
        {/* Attività dell'azienda */}
        <Activities activities={activities} />
        {/* Mappa Google */}
        <Maps className="px-4 md:px-16 -mt-96" height={400} />
      </div>
    </>
  );
}
