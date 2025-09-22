import { Metadata } from "next";
import { notFound } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

import Collapse from "@/app/components/ui/collapse";
import DownloadArea from "@/app/components/custom/downloadArea";
import Assistant from "@/app/components/custom/assistant";
import Card from "@/app/components/ui/card";

import MDXContent from "../components/custom/mdxContent";
import { serialize } from 'next-mdx-remote/serialize'

interface Slug {
  slug: string;
}
interface Params {
  params: Promise<Slug>;
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
  pages(filters: { slug: { ne: "ricambi" } }) {
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
export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params;
  // Leggo lo slug dai parametri di route
  const slug = params.slug;

  // Fetch data
  const { data } = await createApolloClient().query({
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
  const { data } = await createApolloClient().query({
    query: queryStaticPath,
  });

  const pages = data.pages.data;
  return pages.map((page) => ({
    slug: page.attributes.slug,
  }));
}

export default async function Page(props: Params) {
  const params = await props.params;
  const { data } = await createApolloClient().query({
    query,
    variables: { slug: params.slug },
  });

  if (data.pages.data.length === 0) {
    notFound()
  }

  const page = data.pages.data[0].attributes;

  const componentPageDownload = page.layout?.find(
    (x) => x.__typename === "ComponentPageDownload"
  );

  const componentCommonAssistant = page.layout?.find(
    (x) => x.__typename === "ComponentCommonAssistant"
  );

  const mdxSource = await serialize(page.description)

  return (
    <div className="w-full h-full px-4 md:px-16 py-8 flex flex-col lg:flex-row">
      <div className="w-full">
        {/* Page title */}
        <h1 className=" uppercase text-2xl mb-8 text-center lg:text-left">{page.title}</h1>

        {/* Page description */}
        {page.description && (
          <div className="mt-8 text-xl break-words description">
            <MDXContent source={mdxSource} />
          </div>
        )}


        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <div className="w-full my-12">
            {page.faq.map((faq) => (
              <Collapse key={faq.id} title={faq.question} isRemakable={true}>
                {faq.answer}
              </Collapse>
            ))}
          </div>
        )}

        {/* Activities */}
        {page.activities && page.activities.length > 0 && (
          <div className="w-full flex flex-col md:flex-row space-y-8 md:space-x-4 md:space-y-0 my-8">
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
      {(componentCommonAssistant || componentPageDownload) && (
        <div className="w-full my-6 lg:my-0 lg:w-5/12 xl:w-4/12 lg:ml-4 flex flex-col space-y-4">
          {/* Assistant */}
          {componentCommonAssistant && (
            <Assistant component={componentCommonAssistant} />
          )}

          {/* Download Area */}
          {componentPageDownload && (
            <DownloadArea component={componentPageDownload} />
          )}
        </div>
      )}

      <Link href="https://api.whatsapp.com/send/?phone=%2B393929898074&text&type=phone_number&app_absent=0" className="fixed bottom-4 right-4">
        <Image src="/whatsapp.svg"
          alt="Whatsapp"
          width={52}
          height={52}>
        </Image>
      </Link>
    </div>
  );
}