"use client";

import { useEffect } from "react";
import { useCart } from "@/app/store/useCart";
import Link from "next/link";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Svuotiamo il carrello non appena l'utente atterra sulla pagina di successo
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl border border-gray-50 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ordine Ricevuto!</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Grazie per aver scelto Silano. Il tuo pagamento è stato elaborato con successo e il nostro magazzino sta già preparando il tuo ricambio.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cosa succede ora?</p>
          <p className="text-sm text-stone-900 font-medium leading-relaxed">
            Riceverai a breve un&apos;email di conferma con i dettagli della spedizione. Riceverai il tuo pezzo in 24/48 ore.
          </p>
        </div>

        <Link
          href="/ricambi"
          className="w-full h-16 bg-forest text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg hover:bg-forest/90 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          Torna al catalogo
          <ArrowRightIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
