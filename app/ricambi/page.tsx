import { cache } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import { reduceSameInitialString } from "@/lib/common";
import Classifier from "../components/custom/classifier";

// Ogni 5 giorni aggiorna i dati contenuti nella pagina
export const revalidate = 432000;

const RICAMBI_PAGE_QUERY = gql`
  query ($page: String) {
    pages(filters: { title: { eqi: $page } }) {
      data {
        attributes {
          title
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

/**
 * Memoized data fetch to prevent double network requests
 */
const getRicambiData = cache(async () => {
  const { data } = await createApolloClient().query({
    query: RICAMBI_PAGE_QUERY,
    variables: { page: "ricambi usati" },
  });
  return data;
});

import RicambiHero from "../components/custom/ricambiHero";
import PopularBrands from "../components/custom/popularBrands";

// Genero i metadata per il SEO
export async function generateMetadata(): Promise<Metadata> {
  const data = await getRicambiData();
  const seo = data?.pages?.data?.[0]?.attributes?.seo;

  if (!seo) {
    return {
      title: "Ricambi Usati | Silano",
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
  };
}

export default async function Ricambi() {
  const data = await getRicambiData();
  const page = data?.pages?.data?.[0]?.attributes;
  const makesData = data?.makes?.data;

  if (!page || !makesData) {
    return (
      <div className="w-full flex justify-center items-center h-96">
        <p className="text-gray-500">Contenuto non disponibile.</p>
      </div>
    );
  }

  const makes = makesData.map((make: any) => make.attributes.name);
  const makeSerialized = makesData.map((make: any) => {
    return {
      name: make.attributes.name,
      url: `/ricambi/catalogo/${make.attributes.slug}`,
    };
  });
  const alf = reduceSameInitialString(makes);

  return (
    <div className="w-full h-full px-4 lg:px-16 py-12">
      {/* Hero Section with Search and Steps */}
      <RicambiHero title={page.title} description={page.description} />

      {/* Popular Brands Shortcuts */}
      <div id="marche-popolari">
        <PopularBrands items={makeSerialized} />
      </div>

      {/* Full Alphabetical List */}
      <div className="mt-20">
        <h2 className="text-xl font-bold mb-2 text-gray-800 uppercase tracking-wider">
          Tutte le marche
        </h2>
        <p className="text-gray-500 mb-6 italic">
          Sfoglia l&apos;elenco completo in ordine alfabetico o usa la ricerca qui sotto.
        </p>
        <Classifier divItems={alf} items={makeSerialized} />
      </div>

      <Link
        href="https://api.whatsapp.com/send/?phone=%2B393929898074&text&type=phone_number&app_absent=0"
        className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform active:scale-95 shadow-xl rounded-full"
      >
        <Image
          src="/whatsapp.svg"
          alt="Whatsapp"
          width={60}
          height={60}
          className="drop-shadow-lg"
        ></Image>
      </Link>
    </div>
  );
}
