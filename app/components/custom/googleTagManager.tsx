
import Script from "next/script";

interface GoogleTagManagerProps {
  ga_id: string;
}

export default function GoogleTagManager({ ga_id }: GoogleTagManagerProps) {
   
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
