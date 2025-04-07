"use client";
import Link from "next/link";
import { hasCookie, setCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface CookiesAlertProps {
  className?: string;
  cookiePolicy?: boolean;
}

export default function CookiesAlert({
  className,
  cookiePolicy,
}: CookiesAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se il cookie esiste solo dopo il mount (lato client)
    const checkCookie = () => {
      const hasAccepted = hasCookie("cookiePolicy");
      setIsVisible(!hasAccepted); // Mostra il banner solo se NON ha accettato
    };

    // Aggiungi un piccolo delay per l'animazione/UX
    const timer = setTimeout(checkCookie, 2000);
    
    // Pulizia del timeout se il componente viene smontato
    return () => clearTimeout(timer);
  }, []);

  const acceptCookie = () => {
    setCookie("cookiePolicy", "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 anno
      path: '/',
    });
    setIsVisible(false); // Nascondi il banner dopo l'accettazione
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 w-full flex justify-center animate-fade-in">
      <div className={`left-0 z-50 bg-white border-forest border mb-4 mx-4 p-4 flex flex-col ${className}`}>
        <p>
          Noi e terze parti selezionate utilizziamo cookie o tecnologie simili
          per scopi tecnici e, con il vostro consenso, per altri scopi. Negare
          il consenso può rendere le funzionalità correlate non disponibili.
          Puoi dare, negare o revocare liberamente il tuo consenso in qualsiasi
          momento. Usa il pulsante Accetta per acconsentire.
        </p>
        <div className="flex justify-between items-end mt-2">
          <Link className="text-forest hover:underline" href="/cookie-policy">
            Scopri di più
          </Link>
          <button
            type="button" // Cambiato da "submit" a "button" poiché non è in un form
            className="p-2 bg-forest text-white rounded-xs hover:bg-forest-dark transition-colors"
            onClick={acceptCookie}
          >
            ACCETTA
          </button>
        </div>
      </div>
    </div>
  );
}