"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCart } from "@/app/store/useCart";

interface CartActionsProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    totalPrice: number;
    quantity: number;
    image: string;
  };
  isAvailable: boolean;
  hasPrice: boolean;
  waBaseUrl: string;
  quoteMessage: string;
  variant?: "full" | "mobile";
}

export default function CartActions({ 
  product, 
  isAvailable, 
  hasPrice, 
  waBaseUrl, 
  quoteMessage,
  variant = "full" 
}: CartActionsProps) {
  const { addItem } = useCart();

  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Totale</span>
          {hasPrice ? (
            <span className="text-xl font-black text-forest">€ {product.totalPrice.toFixed(2)}</span>
          ) : (
            <span className="text-sm font-black text-gray-400 uppercase tracking-tight">Cifra da definire</span>
          )}
        </div>
        
        {isAvailable && hasPrice ? (
          <button
            onClick={() => addItem({
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.totalPrice,
              quantity: 1,
              image: product.image,
              maxQuantity: product.quantity
            })}
            className="bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex-1 shadow-lg active:scale-95 transition-all text-center cursor-pointer"
          >
            Acquista ora
          </button>
        ) : isAvailable ? (
          <a
            href={waBaseUrl + quoteMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex-1 shadow-lg active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Image src="/whatsapp.svg" alt="WA" width={16} height={16} unoptimized />
            Magazzino
          </a>
        ) : (
          <div className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm uppercase flex-1 text-center">
            Esaurito
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isAvailable && hasPrice ? (
        <button
          onClick={() => addItem({
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.totalPrice,
            quantity: 1,
            image: product.image,
            maxQuantity: product.quantity
          })}
          className="w-full bg-forest text-white h-16 rounded-2xl font-black text-lg uppercase tracking-wide hover:bg-forest/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
        >
          <ShoppingBagIcon className="w-6 h-6" />
          Aggiungi al carrello
        </button>
      ) : isAvailable ? (
        <a
          href={waBaseUrl + quoteMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gray-800 text-white h-16 rounded-2xl font-black text-lg uppercase tracking-wide hover:bg-gray-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Image src="/whatsapp.svg" alt="WhatsApp" width={24} height={24} unoptimized />
          Magazzino
        </a>
      ) : null}
    </div>
  );
}
