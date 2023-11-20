import Link from "next/link";
import { Metadata } from "next";
import Script from "next/script";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import Gallery from "@/app/components/ui/gallery";
import Collapse from "@/app/components/ui/collapse";

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
  const snip_id = process.env.SNIPCART_ID;
  const { data } = await getClient().query({
    query,
    variables: { slug: params.slug },
  });

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
      <Script id="gateway_payament" strategy="afterInteractive">
        {`
         window.SnipcartSettings = {
          publicApiKey: "${snip_id}",
          loadStrategy: "on-user-interaction",
        };
      
        (function(){var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var m,g;(g=(m=window.SnipcartSettings).loadCSS)!=null||(m.loadCSS=!0);var y=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,f=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(f.forEach(function(t){return document.addEventListener(t,o)}),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],n=document.querySelector("#snipcart"),i=document.querySelector('src[src^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][src$="snipcart.js"]')),e=document.querySelector('link[href^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][href$="snipcart.css"]'));n||(n=document.createElement("div"),n.id="snipcart",n.setAttribute("hidden","true"),document.body.appendChild(n)),h(n),i||(i=document.createElement("script"),i.src="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.js"),i.async=!0,t.appendChild(i)),!e&&window.SnipcartSettings.loadCSS&&(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.css"),t.prepend(e)),f.forEach(function(v){return document.removeEventListener(v,o)})}function h(t){!y||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
        `}
      </Script>

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
                    garantirti la migliore quotazione contattaci direttamente
                    per conoscere il prezzo.
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
        </div>
      )}
    </div>
  );
}
