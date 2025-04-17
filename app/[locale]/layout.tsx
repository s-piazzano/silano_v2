import "./globals.css";

import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import createApolloClient from "@/lib/client";
import { gql } from "@apollo/client";
import Head from 'next/head';

const Navbar = dynamic(() => import("./components/navbar"));
const Footer = dynamic(() => import("@/app/[locale]/components/footer"));
const CookiesAlert = dynamic(() => import("./components/custom/cookieAlerts"));
const GoogleAnalytics = dynamic(() => import("./components/custom/googleAnalitics"));
const GoogleTagManager = dynamic(() => import("./components/custom/googleTagManager"));

const inter = Inter({ subsets: ["latin"] });
const snip_id = process.env.SNIPCART_ID;

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
  params: Promise<{ locale: string }>
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
  const { locale } = await params;

  // Verifica che la lingua sia supportata
  const supportedLocales = ['it', 'en'];
  if (!supportedLocales.includes(locale)) notFound();

  // Fetch dati da Strapi con la lingua corretta
  const { data } = await createApolloClient().query({
    query,
    variables: {
      menu: "default",
      locale: locale === 'en' ? 'en' : 'it'
    },
  });

  const footerLayout = data.footer?.data?.attributes?.body || [];
  const menuData = data.menus?.data[0]?.attributes;

  // Gestione fallback se non ci sono dati per la lingua richiesta
  if (!menuData) {
    const { data: fallbackData } = await createApolloClient().query({
      query,
      variables: {
        menu: "default",
        locale: locale === 'en' ? 'it' : 'en' // Fallback alla lingua alternativa
      },
    });

    if (!fallbackData.menus?.data[0]?.attributes) notFound();
  }

  const menu = {
    imageUrl: menuData?.logo?.data?.attributes?.formats?.thumbnail?.url || '',
    hours: menuData?.hours || '',
    contact: menuData?.contact || '',
    layout: menuData?.layout || [],
    localizations: menuData?.localizations?.data || []
  };

  return (
    <html lang={locale}>
      <Head>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <>
            <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
            <GoogleTagManager ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
          </>
        )}
      </Head>


      <body className={`relative flex flex-col min-h-screen ${inter.className}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KC23B962"
            height="0"
            width="0"
          ></iframe>
        </noscript>

        <NextIntlClientProvider>
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
        </NextIntlClientProvider>

        {/* Script di configurazione Snipcart */}
        <Script id="snipcart-settings" strategy="beforeInteractive">
          {`
            window.SnipcartSettings = {
              publicApiKey: "${snip_id}",
              loadStrategy: "on-user-interaction",
              currency: "EUR",
              templatesUrl: "/snipcart-templates.html",
              modalStyle: "side",
            };
             (function(){var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var m,g;(g=(m=window.SnipcartSettings).loadCSS)!=null||(m.loadCSS=!0);var y=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,f=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(f.forEach(function(t){return document.addEventListener(t,o)}),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],n=document.querySelector("#snipcart"),i=document.querySelector('src[src^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][src$="snipcart.js"]')),e=document.querySelector('link[href^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][href$="snipcart.css"]'));n||(n=document.createElement("div"),n.id="snipcart",n.setAttribute("hidden","true"),document.body.appendChild(n)),h(n),i||(i=document.createElement("script"),i.src="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.js"),i.async=!0,t.appendChild(i)),!e&&window.SnipcartSettings.loadCSS&&(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.css"),t.prepend(e)),f.forEach(function(v){return document.removeEventListener(v,o)})}function h(t){!y||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
          `}

        </Script>

      </body>

    </html>
  );
}