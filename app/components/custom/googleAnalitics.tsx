"use client";

import Script from "next/script";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

interface GoogleAnaliticsProps {
  ga_id: string;
}

export default function GoogleAnalitics({ ga_id }: GoogleAnaliticsProps) {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookiePolicy");
    setIsAccepted(consent === "accepted");
  }, []);

  if (!isAccepted) return null;

  return (
    <>
      <Script id="google-consent-mode" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          
          if (typeof window !== 'undefined') {
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });

            gtag('consent', 'update', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });
          }
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga_id}');
        `}
      </Script>
    </>
  );
}
