
import Script from "next/script";

interface GoogleAnaliticsProps {
  ga_id: string;
}

export default function GoogleAnalitics({ ga_id }: GoogleAnaliticsProps) {
   
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7JB23TDQ7L"
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
