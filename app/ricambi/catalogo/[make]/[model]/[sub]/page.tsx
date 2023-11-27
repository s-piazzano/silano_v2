import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Breadcrumbs from "@/app/components/ui/breadcrumbs";
import SubcategoryTable from "@/app/components/custom/subcategoriesTable";
import Card from "@/app/components/ui/card";
import CardProduct from "@/app/components/ui/cardProduct";

export const revalidate = 60;

interface Props {
  sub: string;
  make: string;
  model: string;
}

interface Params {
  params: Props;
}

const query = gql`
  # Write your query or mutation here
  query ($sub: String, $make: String, $model: String) {
    models(filters: { slug: { eqi: $model } }) {
      data {
        id
        attributes {
          name
          slug
          make {
            data {
              id
              attributes {
                name
                slug
              }
            }
          }
        }
      }
    }
    subCategories(filters: { slug: { eqi: $sub } }) {
      data {
        attributes {
          name
        }
      }
    }
    products(
      filters: {
        and: [
          { compatibilities: { make: { slug: { eqi: $make } } } }
          { compatibilities: { model: { slug: { eqi: $model } } } }
          { sub_category: { slug: { eqi: $sub } } }
          { quantity: { gt: 0 } }
        ]
      }
      pagination: { pageSize: 1000 }
    ) {
      data {
        id
        attributes {
          quantity
          price
          OE
          motorType
          slug
          compatibilities {
            id
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
                attributes {
                  capacity
                }
              }
            }
            fuel_system {
              data {
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
                formats
              }
            }
          }
          sub_category(sort: "name:asc") {
            data {
              id
              attributes {
                name
                slug
                category {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    makes(filters: { slug: { eqi: $make } }) {
      data {
        attributes {
          name
        }
      }
    }
    models(filters: { slug: { eqi: $model } }) {
      data {
        attributes {
          name
        }
      }
    }
    subCategories(filters: { slug: { eqi: $sub } }) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export default async function Subcategory({ params }: Params) {
  // Fetch data
  const { data } = await getClient().query({
    query: query,
    variables: { sub: params.sub, make: params.make, model: params.model },
  });

  const products = data.products.data;
  const modelName = data.models.data[0].attributes.name;
  const makeName = data.models.data[0].attributes.make.data.attributes.name;
  const subName = data.subCategories.data[0].attributes.name;

  // Se non esiste un modello passato dallo slug restituisco 404
  /*   if (data.models.data.length === 0) {
    notFound();
  } */

  const crumbs = [
    {
      label: "Inizio",
      link: "/ricambi",
    },
    {
      label: data.makes.data[0]?.attributes?.name,
      link: `/ricambi/catalogo/${params.make}`,
    },
    {
      label: data.models.data[0]?.attributes?.name,
      link: `/ricambi/catalogo/${params.make}/${params.model}`,
    },
    {
      label: data.subCategories?.data[0]?.attributes?.name,
      link: `/ricambi/catalogo/${params.make}/${params.model}/${params.sub}`,
    },
  ];

  const generateTitle = (subs) => {
    return subs.map((sub) => sub.attributes.name).join(" / ");
  };

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-4">{`${makeName} ${modelName} - ${subName}`}</h1>
        <Breadcrumbs crumbs={crumbs} />
        <h3 className="my-2"></h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3  gap-4">
          {products.map((prod) => {
            return (
              <CardProduct
                key={prod.id}
                id={prod.id}
                imageUrl={
                  prod.attributes.images?.data[0]?.attributes?.formats.small.url
                }
                slug={prod.attributes.slug}
              >
                <div className="px-1">
                  <h3 className="text-sm">
                    {generateTitle(prod.attributes.sub_category.data)}
                  </h3>
                  {/* OE */}
                  <p className="">{prod.attributes.OE && prod.attributes.OE}</p>
                  {/* Motor type */}
                  <p className="">
                    {prod.attributes.motorType && prod.attributes.motorType}
                  </p>
                  {/* Quantità */}
                  <p
                    className={
                      prod.attributes.quantity
                        ? "font-light text-green-600"
                        : "text-red-500"
                    }
                  >
                    {prod.attributes.quantity
                      ? "Disponibile per la spedizione"
                      : "Non disponibile"}
                  </p>
                  {/* Compatibilità */}
                  <div className="flex flex-col space-y-1 mt-2">
                    <p className="text-xs">Compatibilità: </p>
                    {prod.attributes.compatibilities.map((comp) => (
                      <ul key={comp.id} className="text-xs">
                        {comp.make.data.attributes.name}{" "}
                        {comp.model.data.attributes.name}{" "}
                        {comp.engine_capacity.data.attributes.capacity}{" "}
                        {comp.fuel_system.data.attributes.name}
                      </ul>
                    ))}
                  </div>
                </div>
              </CardProduct>
            );
          })}
        </div>
      </div>
    </div>
  );
}
