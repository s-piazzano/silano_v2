"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Snipcart?: {
      api: {
        theme: {
          cart: {
            open: () => void;
          };
        };
      };
    };
  }
}

export default function ButtonCart() {
  const pathname = usePathname();

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.Snipcart) {
      window.Snipcart.api.theme.cart.open();
    } else {
      // Fallback per sviluppo locale o errori di caricamento
      window.location.href = "#snipcart-checkout";
    }
  };


  if (!pathname.includes("ricambi")) return null;

  return (
    <button
      className="w-12 h-12 hover:bg-gray-100 rounded-md flex justify-center items-center cursor-pointer relative snipcart-checkout"
      onClick={handleCartClick}
      aria-label="Apri carrello"
      id="snipcart-checkout"
    >
      <ShoppingCartIcon className="text-forest w-8 h-8" />
    </button>
  );
}