import { cache } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Header from "./components/header";
import Activities from "./components/custom/activities";
const Maps = dynamic(() => import("./components/custom/maps"));

const HOMEPAGE_QUERY = gql`
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

/**
 * Memoized data fetch to prevent double network requests 
 * between generateMetadata and the Home component.
 */
const getHomepageData = cache(async () => {
  const { data } = await createApolloClient().query({
    query: HOMEPAGE_QUERY,
  });
  return data;
});

// Genero i metadata per il SEO
export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();
  const seo = data?.homepage?.data?.attributes?.seo;

  if (!seo) {
    return {
      title: "Silano",
    };
  }

  const imageUrl = seo.image?.data?.attributes?.url || "";

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function Home() {
  const data = await getHomepageData();
  const attributes = data?.homepage?.data?.attributes;

  if (!attributes) {
    return (
      <div className="w-full flex justify-center items-center h-96">
        <p className="text-gray-500">Contenuto non disponibile.</p>
      </div>
    );
  }

  const { subtitle, title, slogan, activities } = attributes;

  return (
    <>
      <div className="w-full">
        {/* Header contenente lo slogan */}
        <div className="w-full h-[400px]">
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
        <Maps className="px-4 lg:px-16 " height={400} />
      </div>
    </>
  );
}
