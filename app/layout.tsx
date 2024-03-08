import dynamic from "next/dynamic";

import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

import Navbar from "./components/navbar";
import Footer from "@/app/components/footer";
const CookiesAlert = dynamic(() => import("./components/custom/cookieAlerts"));

const GoogleAnalitics = dynamic(
  () => import("./components/custom/googleAnalitics")
);

const inter = Inter({ subsets: ["latin"] });
// Snipcart ID
const snip_id = process.env.SNIPCART_ID;

const query = gql`
  query ($menu: String) {
    menus(filters: { name: { eq: $menu } }) {
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
  metadataBase: new URL("https://www.silanosrl.it"),
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
  const { data } = await getClient().query({
    query,
    variables: { menu: "default" },
  });

  const footerLayout = data.footer.data.attributes.body;

  const menu = {
    imageUrl:
      data.menus.data[0].attributes.logo.data.attributes.formats.thumbnail.url,
    hours: data.menus.data[0].attributes.hours,
    contact: data.menus.data[0].attributes.contact,
    layout: data.menus.data[0].attributes.layout,
  };

  return (
    <html lang="it">
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <GoogleAnalitics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      )}
      <body
        className={` relative flex flex-col min-h-screen ${inter.className}`}
      >
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
          <Footer layout={footerLayout} />
        </div>

        <CookiesAlert></CookiesAlert>
      </body>
      {/* Script di inizializzazione snipcart */}
      <Script id="gateway_payament" strategy="afterInteractive">
        {`
         window.SnipcartSettings = {
          publicApiKey: "${snip_id}",
          loadStrategy: "on-user-interaction",
          currency: "EUR",
          templatesUrl: "/snipcart-templates.html",
        };
      
         (function(){var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var m,g;(g=(m=window.SnipcartSettings).loadCSS)!=null||(m.loadCSS=!0);var y=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,f=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(f.forEach(function(t){return document.addEventListener(t,o)}),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],n=document.querySelector("#snipcart"),i=document.querySelector('src[src^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][src$="snipcart.js"]')),e=document.querySelector('link[href^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][href$="snipcart.css"]'));n||(n=document.createElement("div"),n.id="snipcart",n.setAttribute("hidden","true"),document.body.appendChild(n)),h(n),i||(i=document.createElement("script"),i.src="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.js"),i.async=!0,t.appendChild(i)),!e&&window.SnipcartSettings.loadCSS&&(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.css"),t.prepend(e)),f.forEach(function(v){return document.removeEventListener(v,o)})}function h(t){!y||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
        `}
      </Script>
    </html>
  );
}