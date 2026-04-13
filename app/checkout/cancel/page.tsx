"use client";

import Link from "next/link";
import { XCircleIcon, ShoppingBagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl border border-gray-50 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <XCircleIcon className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pagamento Annullato</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Il processo di pagamento è stato interrotto. Non preoccuparti, i tuoi articoli sono ancora salvati nel carrello.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-full h-16 bg-forest text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg hover:bg-forest/90 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Riprova il pagamento
            <ShoppingBagIcon className="w-6 h-6" />
          </button>
          
          <Link
            href="/ricambi"
            className="w-full h-16 bg-gray-50 text-gray-600 rounded-2xl font-black text-lg uppercase tracking-wide hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            Torna al catalogo
          </Link>
        </div>

        <p className="text-[10px] text-gray-400 font-medium italic">
          Se riscontri problemi tecnici, non esitare a contattarci tramite WhatsApp.
        </p>
      </div>
    </div>
  );
}
