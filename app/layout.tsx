import "./globals.css";

import { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/navbar";
import Footer from "@/app/components/footer";
import CookiesAlert from "./components/custom/cookieAlerts"; 
import GoogleAnalitics from "./components/custom/googleAnalitics";

export const dynamic = 'force-static'

const inter = Inter({ subsets: ["latin"] });

const query = gql`
  query ($menu: String) {
    menus(filters: { name: { eq: $menu } }) {
      data {
        attributes {
          logo {
            data {
              attributes {
                url
              }
            }
          }
          hours
          contact
          layout {
            __typename
            ... on ComponentDropdownMenu {
              id
              name
              url
              type
              sections {
                title
                pages {
                  data {
                    attributes {
                      title
                      slug
                    }
                  }
                }
              }
            }
            ... on ComponentCommonLink {
              linkName: name
              url
              icon
            }
          }
        }
      }
    }

    footer {
      data {
        attributes {
          body {
            __typename
            ... on ComponentFooterCard {
              id
              name
              description
            }
            ... on ComponentMenuSection {
              id
              name
              links {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const metadata: Metadata = {
  title: {
    template: "%s | Silano SRL",
    default: "Silano SRL",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const cookiePolicy = cookieStore.has("cookiePolicy");

  const { data } = await getClient().query({
    query,
    variables: { menu: "default" },
  });

  const footerLayout = data.footer.data.attributes.body;

  const menu = {
    imageUrl: data.menus.data[0].attributes.logo.data.attributes.url,
    hours: data.menus.data[0].attributes.hours,
    contact: data.menus.data[0].attributes.contact,
    layout: data.menus.data[0].attributes.layout,
  };

  return (
    <html lang="it">
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <GoogleAnalitics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      )}
      <body className={` relative flex flex-col ${inter.className}`}>
        {/* NAVIGATION BAR */}
        <Navbar
          imageUrl={menu.imageUrl}
          hours={menu.hours}
          contact={menu.contact}
          layout={menu.layout}
        />
        <div className="w-full">{children}</div>
        {/* FOOTER */}
        <div className="mt-8">
          <Footer layout={footerLayout} />
        </div>
        <Analytics />
         <CookiesAlert cookiePolicy={cookiePolicy}></CookiesAlert>
      </body>
    </html>
  );
}
