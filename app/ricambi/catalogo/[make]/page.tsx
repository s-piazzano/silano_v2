import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Classifier from "@/app/components/custom/classifier";
import { reduceSameInitialString } from "@/lib/common";
import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import RicambiHero from "@/app/components/custom/ricambiHero";

//Ogni giorno effettua il revalidate
export const revalidate = 3600;
export const runtime = 'edge';

const BRAND_QUERY = gql`
  query ($slug: String) {
    makes(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          slug
          models(pagination: { pageSize: 200 }, sort: "name:asc") {
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
  }
`;

/**
 * Memoized data fetch for the brand page
 */
const getBrandData = cache(async (slug: string) => {
  const { data } = await createApolloClient().query({
    query: BRAND_QUERY,
    variables: { slug },
  });
  return data;
});

// Genero i metadata per il SEO
export async function generateMetadata(props: {
  params: Promise<{ make: string }>;
}): Promise<Metadata> {
  const { make: slug } = await props.params;
  const data = await getBrandData(slug);

  if (!data?.makes?.data?.[0]) {
    return { title: "Ricambi Usati | Silano" };
  }

  const make = data.makes.data[0].attributes;
  const title = `Ricambi Usati ${make.name} | Silano`;
  const description = `Scopri il catalogo completo di ricambi usati per ${make.name}. Seleziona il tuo modello per trovare i pezzi compatibili.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Models(props: {
  params: Promise<{ make: string }>;
}) {
  const { make: slug } = await props.params;

  // Fetch data
  const data = await getBrandData(slug);

  // Se non esiste una marca passato dallo slug restituisco 404
  if (!data?.makes?.data || data.makes.data.length === 0) {
    notFound();
  }

  const make = data.makes.data[0];
  const models = make.attributes.models.data;
  
  // Formatto i dati per il componente Classifier
  const modelSerialized = models.map((x: any) => {
    return {
      name: x.attributes.name,
      url: `/ricambi/catalogo/${slug}/${x.attributes.slug}`,
    };
  });
  const alf = reduceSameInitialString(modelSerialized.map((x) => x.name));

  const crumbs = [
    {
      label: "Inizio",
      link: "/ricambi",
    },
    {
      label: make.attributes.name,
      link: `/ricambi/catalogo/${slug}`,
    },
  ];

  return (
    <div className="w-full h-full px-4 lg:px-16 py-12">
      <div className="w-full">
        <RicambiHero 
          title={`Catalogo ${make.attributes.name}`} 
          description={`Seleziona il modello della tua ${make.attributes.name} per visualizzare le categorie di ricambi disponibili.`}
          currentStep={2}
          brandName={make.attributes.name}
        />

        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <section id="selezione-modelli" className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2 text-gray-800 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-6 bg-forest rounded-full"></span>
            Scegli Modello
          </h3>
          <p className="text-gray-500 mb-6 italic text-sm">
            Filtra i modelli della tua {make.attributes.name} per restringere la ricerca.
          </p>
          <Classifier 
            divItems={alf} 
            items={modelSerialized} 
            placeholder={`Cerca un modello ${make.attributes.name} (es. Panda, Golf...)`}
          />
        </section>
      </div>
    </div>
  );
}
