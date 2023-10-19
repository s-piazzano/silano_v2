import { Metadata } from "next";
import { notFound } from 'next/navigation'

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Collapse from "@/app/components/ui/collapse";
import DownloadArea from "@/app/components/custom/downloadArea";
import Assistant from "@/app/components/custom/assistant";
import Card from "@/app/components/ui/card";
import DocumentToHtmlString from "@/app/components/custom/documentToHtmlString";

interface Slug {
  slug: string;
}
interface Params {
  params: Slug;
}

const querySEO = gql`
  query ($slug: String) {
    pages(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
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
  }
`;

const queryStaticPath = gql`
  query {
    pages {
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
    pages(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          slug
          title
          description
          faq {
            id
            question
            answer
          }
          activities {
            id
            title
            description
            image {
              data {
                attributes {
                  formats
                }
              }
            }
            link {
              name
              url
            }
          }
          layout {
            __typename
            ... on ComponentPageDownload {
              id
              title
              links {
                id
                name
                url
              }
            }
            ... on ComponentCommonAssistant {
              id
              avatar {
                data {
                  attributes {
                    url
                    name
                  }
                }
              }
              description
              button
              assistan_option {
                data {
                  attributes {
                    steps
                    result
                  }
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
export async function generateMetadata({ params }): Promise<Metadata> {
  // Leggo lo slug dai parametri di route
  const slug = params.slug;

  // Fetch data
  const { data } = await getClient().query({
    query: querySEO,
    variables: { slug },
  });

  const seo = data.pages.data[0]?.attributes?.seo;

  return {
    title: seo?.title,
    description: seo?.title,
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      images: [{ url: seo?.image?.data?.attributes?.url }],
    },
  };
}

// Genero i path per la build
export async function generateStaticParams() {
  // Fetch data
  const { data } = await getClient().query({
    query: queryStaticPath,
  });

  const pages = data.pages.data;

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function Page({ params }: Params) {
  const { data } = await getClient().query({
    query,
    variables: { slug: params.slug },
  });

  console.log(data)

  if(data.pages.data.length === 0){
    notFound()
  }

  const page = data.pages.data[0].attributes;

  const componentPageDownload = page.layout.find(
    (x) => x.__typename === "ComponentPageDownload"
  );

  const componentCommonAssistant = page.layout.find(
    (x) => x.__typename === "ComponentCommonAssistant"
  );

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-8">{page.title}</h1>
        {/* Page description */}
        {page.description && (
          <div className="mt-8 text-xl break-words ">
            <DocumentToHtmlString description={page.description} />
          </div>
        )}

        {/* FAQ */}
        {page.faq && (
          <div className="w-full my-12">
            {page.faq.map((faq) => (
              <Collapse key={faq.id} title={faq.question} isRemakable={true}>
                {faq.answer}
              </Collapse>
            ))}
          </div>
        )}
        {/* Activities */}
        {page.activities && (
          <div className="w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-start items-stretch">
            {page.activities.map((activity) => {
              return (
                <Card
                  className="w-full md:w-60"
                  containerClass="px-2"
                  titleClass="text-base"
                  descriptionClass="text-sm"
                  linkClass="px-2"
                  id={`activity-car-${activity.id}`}
                  key={activity.id}
                  title={activity.title}
                  description={activity.description}
                  link={activity.link}
                  imageUrl={
                    activity.image?.data?.attributes?.formats?.medium?.url
                  }
                ></Card>
              );
            })}
          </div>
        )}
      </div>
      {/* Right Column */}
      {/* if ComponentAssistant and ComponentDownload are defined show column */}
      {(componentCommonAssistant || componentPageDownload) && (
        <div className="w-full lg:w-5/12 xl:w-4/12 lg:ml-4 flex flex-col space-y-4">
          {/* Assistant */}
          {componentCommonAssistant && (
            <Assistant component={componentCommonAssistant} />
          )}
          {}
          {/* Download Area */}
          {componentPageDownload && (
            <DownloadArea component={componentPageDownload} />
          )}
        </div>
      )}
    </div>
  );
}
