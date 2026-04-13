import "./globals.css";

import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ReactNode } from 'react';
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";

const Navbar = dynamic(() => import("./components/navbar"));
const Footer = dynamic(() => import("@/app/components/footer"));
const CookiesAlert = dynamic(() => import("./components/custom/cookieAlerts"));
const GoogleAnalytics = dynamic(() => import("./components/custom/googleAnalitics"));
const GoogleTagManager = dynamic(() => import("./components/custom/googleTagManager"));

const CartDrawer = dynamic(() => import("./components/custom/cartDrawer"));

const inter = Inter({ subsets: ["latin"] });

// Query GraphQL con supporto i18n
const query = gql`
  query ($menu: String, $locale: I18NLocaleCode) {
    menus(filters: { name: { eq: $menu } }, locale: $locale) {
      data {
        attributes {
          logo {
            data {
              attributes {
                url
                formats
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
                url
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
          localizations {
            data {
              attributes {
                locale
              }
            }
          }
        }
      }
    }

    footer(locale: $locale) {
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
          localizations {
            data {
              attributes {
                locale
              }
            }
          }
        }
      }
    }
  }
`;

type Props = {
  children: ReactNode;
  params: Promise<{ locale?: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Accedi a 'locale' tramite 'props.params.locale'
  const { locale } = await params;

  // Il resto della logica rimane invariato
  return {
    metadataBase: new URL("https://www.silanosrl.it"),
    title: {
      template: "%s | Silano SRL",
      default: locale === 'en' ? "Silano SRL" : "Silano SRL",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'it': '/it',
        'en': '/en',
      },
    }
  };
}

export default async function RootLayout({
  children,
  params
}: Props) {
  const { locale = 'it' } = await params;

  // Fetch dati da Strapi con la lingua corretta
  const { data } = await createApolloClient().query({
    query,
    variables: {
      menu: "default",
    },
  });

  const footerLayout = data.footer?.data?.attributes?.body || [];
  const menuData = data.menus?.data[0]?.attributes;

  const menu = {
    imageUrl: menuData?.logo?.data?.attributes?.formats?.thumbnail?.url || '',
    hours: menuData?.hours || '',
    contact: menuData?.contact || '',
    layout: menuData?.layout || [],
    localizations: menuData?.localizations?.data || []
  };

  return (
    <html lang={locale}>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
          <GoogleTagManager />
        </>
      )}


      <body className={`relative flex flex-col min-h-screen ${inter.className}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KC23B962"
            height="0"
            width="0"
          ></iframe>
        </noscript>


        {/* Navigation Bar */}
        <Navbar
          imageUrl={menu.imageUrl}
          hours={menu.hours}
          contact={menu.contact}
          layout={menu.layout}
        />

        <div className="w-full grow">{children}</div>

        {/* Footer */}
        <div className="mt-8">
          <Footer
            layout={footerLayout}
          />
        </div>

        <CookiesAlert />
        <CartDrawer />
      </body>

    </html>
  );
}