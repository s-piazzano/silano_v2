import Link from "next/link";
import { Metadata } from "next";

import { notFound } from "next/navigation";

import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Image from "next/image";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import Gallery from "@/app/components/ui/gallery";
import Collapse from "@/app/components/ui/collapse";

import { toInteger, extractDecimal } from "@/lib/common";

/* import CartButton from "@/app/components/ui/cartButton";
 */
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import { generateTitle } from "@/utils/common";

export const revalidate = 5;

interface Slug {
  slug: string;
}

interface Params {
  params: Promise<Slug>;
}

const querySEO = gql`
  query ($slug: String) {
    products(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          updatedAt
          OE
          motorType
          description
          price
          title
          sub_category {
            data {
              attributes {
                name
              }
            }
          }
          compatibilities {
            make {
              data {
                attributes {
                  name
                }
              }
            }
            model {
              data {
                attributes {
                  name
                }
              }
            }
            engine_capacity {
              data {
                id
                attributes {
                  capacity
                }
              }
            }
            fuel_system {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
          images {
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
`;

const queryStaticPath = gql`
  query {
    products(pagination: { pageSize: 100000 }) {
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
  query ($slug: String) {
    products(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          updatedAt
          OE
          motorType
          description
          price
          title
          quantity
          sub_category {
            data {
              attributes {
                name
                slug
              }
            }
          }
          compatibilities {
            make {
              data {
                attributes {
                  name
                  slug
                }
              }
            }
            model {
              data {
                attributes {
                  name
                  slug
                }
              }
            }
            engine_capacity {
              data {
                id
                attributes {
                  capacity
                }
              }
            }
            fuel_system {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
          images {
            data {
              id
              attributes {
                url
                formats
              }
            }
          }
        }
      }
      meta {
        pagination {
          pageCount
        }
      }
    }
  }
`;

const generateDescription = (sub, comps, description) => {
  return `${description
    ? description
    : `
Offriamo come ricambio usato funzionante ${sub[0].attributes.name} per:
      ${comps
      .map(
        (comp) =>
          `- ${comp.make.data ? comp.make.data.attributes.name : ""} ${comp.model.data ? comp.model.data.attributes.name : ""
          }`
      )
      .join("")}
   `
    }
    `;
};

// Genero i metadata per il SEO
export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params;
  // Leggo lo slug dai parametri di route
  const slug = params.slug;

  // Fetch data
  const { data } = await createApolloClient().query({
    query: querySEO,
    variables: { slug },
  });

  const product = data.products.data[0];

  if (product) {
    return {
      title: generateTitle(
        product.attributes.sub_category.data,
        product.attributes.compatibilities,
        product.attributes.OE,
        product.attributes.motorType
      ),
      description: generateDescription(
        product.attributes.sub_category.data,
        product.attributes.compatibilities,
        product.attributes.description
      ),
      openGraph: {
        title: generateTitle(
          product.attributes.sub_category.data,
          product.attributes.compatibilities,
          product.attributes.OE,
          product.attributes.motorType
        ),
        description: generateDescription(
          product.attributes.sub_category.data,
          product.attributes.compatibilities,
          product.attributes.description
        ),
        images: [product.attributes.images?.data[0]?.attributes?.url],
      },
    };
  } else {
    return {};
  }
}

// Genero i path per la build
export async function generateStaticParams() {

  // Fetch data
  const { data } = await createApolloClient().query({
    query: queryStaticPath,
    variables: {},
  });

  const products = data.products?.data ?? [];
  return products.map((product) => ({
    params: { slug: product.attributes?.slug ?? "" },
    fallback: 'blocking'
  }));
}

export default async function Ricambi(props: Params) {
  const params = await props.params;
  const { data } = await createApolloClient().query({
    query,
    variables: { slug: params.slug },
  });

  // Se non esiste il prodotto passato dallo slug restituisco 404
  if (data.products.data.length === 0) {
    notFound();
  }

  const product = data.products.data[0];

  const make = {
    name: product.attributes.compatibilities[0].make.data.attributes.name,
    slug: product.attributes.compatibilities[0].make.data.attributes.slug,
  };
  const model = {
    name: product.attributes.compatibilities[0].model.data.attributes.name,
    slug: product.attributes.compatibilities[0].model.data.attributes.slug,
  };
  const sub = {
    name: product.attributes.sub_category.data[0].attributes.name,
    slug: product.attributes.sub_category.data[0].attributes.slug,
  };

  // Genero i crumbs
  const crumbs = [
    {
      label: "Inizio",
      link: "/ricambi",
    },
    {
      label: make.name,
      link: `/ricambi/catalogo/${make.slug}`,
    },
    {
      label: model.name,
      link: `/ricambi/catalogo/${make.slug}/${model.slug}`,
    },
    {
      label: sub.name,
      link: `/ricambi/catalogo/${make.slug}/${model.slug}/${sub.slug}`,
    },
  ];

  return (
    <div className="">
      {product && (
        <div className="px-4 md:px-16 py-8 flex flex-col">
          <Breadcrumbs crumbs={crumbs} />
          <div className="flex flex-col md:flex-row ">
            {/* Titolo del prodotto - versione mobile*/}
            <h1 className="md:hidden text-lg font-semibold mb-4">
              {product.attributes.title
                ? product.attributes.title
                : generateTitle(
                  product.attributes.sub_category.data,
                  product.attributes.compatibilities,
                  product.attributes.OE,
                  product.attributes.motorType
                )}
            </h1>
            {/*Galleria immagini prodotto*/}
            <div className="md:w-7/12 flex-none lg:pr-4">
              <Gallery images={product.attributes.images}></Gallery>
            </div>

            <div className=" flex flex-col  border-t md:border-t-0 md:pl-8 ">
              {/* Titolo del prodotto - versione desktop*/}
              <h1 className="hidden md:block text-lg font-semibold">
                {product.attributes.title
                  ? product.attributes.title
                  : generateTitle(
                    product.attributes.sub_category.data,
                    product.attributes.compatibilities,
                    product.attributes.OE,
                    product.attributes.motorType
                  )}
              </h1>
              <div className="hidden md:block border border-b-0 "></div>
              <div className="flex flex-col space-y-4 my-4">
                {/* Giacenza */}
                <div className="text-lg">
                  {" "}
                  {product.attributes.quantity ? (
                    <div className="flex flex-col space-y-2 font-bold">
                      {product.attributes.price &&
                        product.attributes.price > 0 && (
                          <p className=" text-2xl">
                            € {toInteger(product.attributes.price)}
                            <span className="text-sm">
                              {extractDecimal(product.attributes.price)}
                            </span>
                          </p>
                        )}
                      <p className="text-sm font-normal">
                        Ultimi pezzi rimasti{" "}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500">Non disponibile</p>
                  )}
                </div>
                {/* Button */}
                {/* Richiedi uan quatozione - visibile se non è definito un prezzo */}
                {!product.attributes.price && (
                  <Link
                    href={`https://wa.me/+393929898074?text=Ciao Silano SRL, ti contatto in merito all'annuncio ${"https://www.silanosrl.it/ricambi/" + params.slug
                      } (non modificare). Avrei bisogno di informazioni ...`}
                    className="w-64 h-12 bg-forest text-white rounded-sm uppercase flex justify-center items-center px-4"
                  >
                    <span className="flex flex-col items-center">
                      <span className="">richiedi una quotazione</span>
                      <span className="font-light text-xs">whatsapp</span>
                    </span>
                  </Link>
                )}
                {/* Snipchart button */}
                {product.attributes.price &&
                  product.attributes.price > 0 &&
                  product.attributes.quantity > 0 && (
                    (<button
                      className="snipcart-add-item w-full md:w-48 bg-forest shadow-md  p-4 text-white"
                      data-item-id={product.id}
                      data-item-price={product.attributes.price}
                      data-item-image={
                        product.attributes.images?.data[0]?.attributes?.formats
                          ?.thumbnail?.url
                      }
                      data-item-name={generateTitle(
                        product.attributes.sub_category.data,
                        product.attributes.compatibilities,
                        product.attributes.OE,
                        product.attributes.motorType
                      )}
                      data-item-max-quantity={product.attributes.quantity}
                    >Aggiungi al carrello
                    </button>)
                    /*  <CartButton productID={product.id} /> */
                  )}
              </div>
              {/* link per i contatti */}
              <div className="mt-4 flex flex-col space-y-2 text-md">
                <Link
                  href={`https://wa.me/+393929898074?text=Ciao Silano SRL, ti contatto in merito all'annuncio ${"https://www.silanosrl.it/ricambi/" + params.slug
                    } (non modificare). Avrei bisogno di informazioni ...`}
                  className="flex items-center"
                >
                  <Image
                    src="/whatsapp.svg"
                    alt="Whatsapp"
                    width={32}
                    height={32}
                    className="mr-2"
                    unoptimized
                  />{" "}
                  Richiedi assistenza
                </Link>
                <Link
                  href={`mailto:ricambisilano@gmail.com`}
                  className="flex items-center"
                >
                  <EnvelopeIcon className="w-[32px] h-[32px] mr-2"></EnvelopeIcon>
                  Scrivici: ricambisilano@gmail.com
                </Link>
              </div>
              {/* metodi di pagamento */}
              <div className="flex flex-col space-y-2 mt-8">
                <h3>Metodi di pagamento accettati:</h3>
                <Image
                  src="/carte.webp"
                  width={220}
                  height={95}
                  alt="metodi di pagamento"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="">
              <div className=" p-0">
                <h3 className="bg-forest w-32 text-base-100 font-extralight p-1 text-center">
                  Descrizione
                </h3>
                <div className="border-forest border-b"></div>
              </div>
              <div className="whitespace-pre-wrap mt-2">
                {generateDescription(
                  product.attributes.sub_category.data,
                  product.attributes.compatibilities,
                  product.attributes.description
                )}
              </div>
              {/* Collapse */}
              {/*  {!product.attributes.price && (
                <Collapse
                  className="w-full md:w-96"
                  title="Perché il prezzo non è definito?"
                >
                  <p>
                    I prezzi sui ricambi sono in continua evoluzione. Per
                    garantirti la migliore quotazione contattaci direttamente
                    per conoscere il prezzo.
                  </p>
                </Collapse>
              )} */}
              {/* <div className="flex flex-col">
                <h2 className="font-semibold">
                  Non sei sicuro della compatibilità o hai bisogno di maggiori
                  informazioni?
                </h2>
                <h2 className="font-normal mt-2">
                  Non esitare a contattarci. Siamo a tua disposizione
                </h2>
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4"
                  href={`https://wa.me/+393929898074?text=Ciao Silano SRL, ti contatto in merito all'annuncio ${
                    "https://www.silanosrl.it/ricambi/" + params.slug
                  } (non modificare). Avrei bisogno di informazioni ...`}
                >
                  Scrivici su Whatsapp (+39 392 9898 074) - clicca qui
                </a>
                <div className="flex flex-col md:flex-row mt-1">
                  <p>Se preferisci scrivere una e-mail:</p>
                  <a
                    href="mailto:ricambisilano@gmail.com"
                    className="ml-0 md:ml-2"
                  >
                    ricambisilano@gmail.com
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
