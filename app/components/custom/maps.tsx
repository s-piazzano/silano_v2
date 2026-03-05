"use client";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface MapsProps {
  width?: number;
  height: number;
  className?: string;
}

export default function Maps({ width, height, className }: MapsProps) {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookiePolicy");
    setIsAccepted(consent === "accepted");
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full flex justify-center">
        {isAccepted ? (
          <iframe
            title="whereweare"
            className="w-full shadow-sm"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2803.1638649489246!2d8.130221315554195!3d45.36568827909993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786325e10f5ac6b%3A0xb1064ec6142248e8!2sSilano%20Srl!5e0!3m2!1sit!2sit!4v1670600026007!5m2!1sit!2sit"
            width={width}
            height={height}
            loading="lazy"
          ></iframe>
        ) : (
          <div
            style={{ height }}
            className="w-full bg-stone-100 flex flex-col items-center justify-center p-8 text-center border border-stone-200"
          >
            <p className="text-stone-600 mb-4">
              Per visualizzare la mappa interattiva di Google Maps, è necessario accettare i cookie.
            </p>
            <p className="text-sm text-stone-400">
              Puoi farlo cliccando su &quot;ACCETTA&quot; nel banner in fondo alla pagina.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
