"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/store/useCart";
import { useEffect, useState } from "react";

export default function ButtonCart() {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Evitiamo errori di idratazione (Zustand persist + SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!pathname.includes("ricambi") && !pathname.includes("checkout")) return null;

  const itemCount = mounted ? getTotalItems() : 0;

  return (
    <button
      className="w-12 h-12 hover:bg-gray-100 rounded-2xl flex justify-center items-center cursor-pointer relative transition-all active:scale-95"
      onClick={() => toggleCart(true)}
      aria-label="Apri carrello"
    >
      <ShoppingCartIcon className="text-forest w-8 h-8" />
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 bg-forest text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
          {itemCount}
        </span>
      )}
    </button>
  );
}