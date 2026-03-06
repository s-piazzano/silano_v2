"use client";

import Script from "next/script";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function GoogleTagManager() {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookiePolicy");
    setIsAccepted(consent === "accepted");
  }, []);

  if (!isAccepted) return null;

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KC23B962');
        `}
      </Script>
    </>
  );
}
