import Link from "next/link";
import { Metadata } from "next";

import { notFound } from "next/navigation";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import Gallery from "@/app/components/ui/gallery";
import Collapse from "@/app/components/ui/collapse";

import { toInteger, extractDecimal } from "@/lib/common";

export const revalidate = 5;

interface Slug {
  slug: string;
}

interface Params {
  params: Slug;
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

const generateTitle = (subs, comps, oe = "", motorType = "") => {
  return ` ${subs[0].attributes.name} ${comps
    .map(
      (comp) =>
        `${comp.make.data ? comp.make.data.attributes.name : ""} ${
          comp.model.data ? comp.model.data.attributes.name : ""
        } ${
          comp.engine_capacity.data && comp.engine_capacity.data.id != 5
            ? comp.engine_capacity.data.attributes.capacity
            : ""
        } ${
          comp.fuel_system.data && comp.fuel_system.data.id != 8
            ? comp.fuel_system.data.attributes.name
            : ""
        }`
    )
    .join(" / ")} ${oe ? oe : ""} ${motorType ? motorType : ""}`;
};

const generateDescription = (sub, comps, description) => {
  return `${
    description
      ? description
      : `
Autodemolizione specializzata nella vendita ricambi usati. 
Offriamo come ricambio usato funzionante ${sub[0].attributes.name} per:
      ${comps
        .map(
          (comp) =>
            `- ${comp.make.data ? comp.make.data.attributes.name : ""} ${
              comp.model.data ? comp.model.data.attributes.name : ""
            }`
        )
        .join("")}

Disponiamo di ricambi per carrozzeria, meccanica, parti elettriche ed elettroniche, selleria...
I ricambi sono accuratamente smontati e catalogati in magazzino da personale qualificato.
   `
  }

Rispondiamo quotidianamente alle vostre e-mail e Whatsapp.
  
Possibilità di spedizione in tutta Italia
    `;
};

// Genero i metadata per il SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  // Leggo lo slug dai parametri di route
  const slug = params.slug;

  // Fetch data
  const { data } = await getClient().query({
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
        images: [{ url: product.attributes.image?.data?.attributes?.url }],
      },
    };
  } else {
    return {};
  }
}

// Genero i path per la build
export async function generateStaticParams({ params }: Params) {
  // Fetch data
  const { data } = await getClient().query({
    query: queryStaticPath,
    variables: { slug: params.slug },
  });

  const products = data.products.data;

  // Automatic generation of paths
  const slugs = products.map(
    (x) =>
      new Object({
        params: x.attributes,
      })
  );

  return products.map((page) => ({
    slug: page.slug,
    fallback: true,
  }));
}

export default async function Ricambi({ params }: Params) {
  const { data } = await getClient().query({
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
            <Gallery images={product.attributes.images}></Gallery>

            <div className=" flex flex-col md:pl-8">
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
              <div className="whitespace-pre-wrap">
                {generateDescription(
                  product.attributes.sub_category.data,
                  product.attributes.compatibilities,
                  product.attributes.description
                )}
              </div>
              {/* Giacenza */}
              <div className="py-4 font-semibold text-lg">
                {" "}
                {product.attributes.quantity ? (
                  <div className="flex items-end space-x-2 font-normal">
                    <p className="">Ultimi pezzi rimasti </p>
                    {product.attributes.price && (
                      <p className=" text-2xl">
                        € {toInteger(product.attributes.price)}
                        <span className="text-sm">
                          {extractDecimal(product.attributes.price)}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-500">Non disponibile</p>
                )}
              </div>
              {/* Collapse */}
              {!product.attributes.price && (
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
              )}
              {/* Button */}
              {!product.attributes.price && (
                <Link
                  href={`https://wa.me/+393929898074?text=Ciao Silano SRL, ti contatto in merito all'annuncio ${
                    "https://www.silanosrl.it/ricambi/" + params.slug
                  } (non modificare). Avrei bisogno di informazioni ...`}
                  className="w-64 h-12 bg-forest text-white rounded-sm uppercase mt-4 flex justify-center items-center px-4"
                >
                  <span className="flex flex-col items-center">
                    <span className="">richiedi una quotazione</span>
                    <span className="font-light text-xs">whatsapp</span>
                  </span>
                </Link>
              )}
              {/* Snipchart button */}
               {product.attributes.price && product.attributes.quantity > 0 && (
                <button
                  className="snipcart-add-item w-full md:w-48 bg-forest shadow-md  p-4 text-white"
                  data-item-id={product.id}
                  data-item-price={product.attributes.price}
                  data-item-image={
                    product.attributes.images.data[0].attributes.formats
                      .thumbnail.url
                  }
                  data-item-name={generateTitle(
                    product.attributes.sub_category.data,
                    product.attributes.compatibilities,
                    product.attributes.OE,
                    product.attributes.motorType
                  )}
                  data-item-max-quantity={product.attributes.quantity}
                >
                  Aggiungi al carrello
                </button>
              )} 



              <div className="flex flex-col mt-8">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
