/* import Link from "next/link"; */
import { Metadata } from "next";
import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Classifier from "@/app/components/custom/classifier";
import { reduceSameInitialString } from "@/lib/common";
import Breadcrumbs from "@/app/components/ui/breadcrumbs";

//Ogni giorno effettua il revalidate
export const revalidate = 3600;
export const runtime = 'edge';

interface Make {
  make: string;
}
interface Params {
  params: Promise<Make>;
}
interface StaticParams {
  params: Make;
}

const queryStaticPath = gql`
  query {
    makes(pagination: { pageSize: 10000 }) {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;
const query = gql`
  query ($slug: String) {
    makes(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
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



export default async function Models(props: Params) {
  const params = await props.params;
  // Leggo lo slug dai parametri di route
  const slug = params.make;

  // Fetch data
  const { data } = await createApolloClient().query({
    query: query,
    variables: { slug },
  });

  // Se non esiste una marca passato dallo slug restituisco 404
  if (data.makes.data.length === 0) {
    notFound();
  }

  const make = data.makes.data[0];
  const models = make.attributes.models.data;
  // Formatto i dati per il componente  Classifier
  const modelSerialized = models.map((x) => {
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
    <div className="w-full h-full px-4 lg:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-4">{make.attributes.name}</h1>

        <Breadcrumbs crumbs={crumbs} />
        <h3 className="my-2">Scegli Modello</h3>
        <Classifier divItems={alf} items={modelSerialized} />
      </div>
    </div>
  );
}
