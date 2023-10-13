import Link from "next/link";
import { Metadata } from "next";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Gallery from "@/app/components/ui/gallery";
import Collapse from "@/app/components/ui/collapse";

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
    products(pagination:{pageSize: 100000}) {
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

  const product = data.products.data[0];

  return (
    <div className="">
      {product && (
        <div className="px-4 md:px-16 py-8 flex flex-col md:flex-row ">
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
          <Gallery images={product.attributes.images}></Gallery>

          <div className=" flex flex-col pt-8 md:pl-8 md:pt-0">
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
            {/* Collapse */}
            {!product.attributes.price && (
              <Collapse
                className="w-full md:w-96"
                title="Perché il prezzo non è definito?"
              >
                <p>
                  I prezzi sui ricambi sono in continua evoluzione. Per
                  garantirti la migliore quotazione contattaci direttamente per
                  conoscere il prezzo.
                </p>
              </Collapse>
            )}
            {/* Button */}
            {!product.price && (
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
      )}
    </div>
  );
}
