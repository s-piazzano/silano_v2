"use client";
import Link from "next/link";

import { setCookiePolicy } from "@/app/actions";

import { useState, useEffect } from "react";

interface CookiesAlertProps {
  className?: string;
  cookiePolicy: boolean;
}

export default function CookiesAlert({
  className,
  cookiePolicy,
}: CookiesAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 2000);
  });

  return (
    <div
      className={
        cookiePolicy || !isVisible
          ? "hidden"
          : "fixed bottom-0 w-full flex justify-center"
      }
    >
      <div className="left-0 z-50  bg-white border-forest border  mb-4 mx-4 p-4 flex flex-col">
        <p>
          Noi e terze parti selezionate utilizziamo cookie o tecnologie simili
          per scopi tecnici e, con il vostro consenso, per altri scopi. Negare
          il consenso può rendere le funzionalità correlate non disponibili.
          Puoi dare, negare o revocare liberamente il tuo consenso in qualsiasi
          momento. Usa il pulsante Accetta per acconsentire.
        </p>
        <div className="flex justify-between items-end mt-2">
          <Link className="text-forest" href="/cookie-policy">
            Scopri di più
          </Link>
          <form action={setCookiePolicy}>
            <button
              type="submit"
              className="p-2 bg-forest text-white rounded-sm"
            >
              ACCETTA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}