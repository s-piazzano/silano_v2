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
      setIsVisible(!hasAccepted); // Mostra il banner solo se NON ha espresso una preferenza
    };

    checkCookie();
  }, []);

  const acceptCookie = () => {
    setCookie("cookiePolicy", "accepted", {
      maxAge: 60 * 60 * 24 * 365, // 1 anno
      path: '/',
    });
    setIsVisible(false);
    window.location.reload(); // Riavvia per caricare gli script di tracciamento
  };

  const rejectCookie = () => {
    setCookie("cookiePolicy", "rejected", {
      maxAge: 60 * 60 * 24 * 365, // 1 anno
      path: '/',
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 w-full flex justify-center animate-fade-in z-[9999]">
      <div className={`left-0 bg-white border-forest border mb-4 mx-4 p-4 flex flex-col ${className}`}>
        <p>
          Noi e terze parti selezionate utilizziamo cookie o tecnologie simili
          per scopi tecnici e, con il vostro consenso, per altri scopi. Negare
          il consenso può rendere le funzionalità correlate non disponibili.
          Puoi dare, negare o revocare liberamente il tuo consenso in qualsiasi
          momento. Usa il pulsante Accetta per acconsentire.
        </p>
        <div className="flex justify-between items-center mt-4 gap-4">
          <Link className="text-forest hover:underline text-sm" href="/cookie-policy">
            Scopri di più
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-forest text-forest rounded-xs hover:bg-stone-100 transition-colors text-sm uppercase"
              onClick={rejectCookie}
            >
              RIFIUTA
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-forest text-white rounded-xs hover:bg-forest-dark transition-colors text-sm uppercase"
              onClick={acceptCookie}
            >
              ACCETTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}