"use client";

import { useCart } from "@/app/store/useCart";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, ShoppingBagIcon, TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { toInteger, extractDecimal } from "@/lib/common";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getSubtotal } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    toggleCart(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-[3rem] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-50">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <ShoppingBagIcon className="w-6 h-6 text-forest" />
                Carrello
              </h2>
              <button
                onClick={() => toggleCart(false)}
                className="p-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Il carrello è vuoto</p>
                  <button 
                    onClick={() => toggleCart(false)}
                    className="text-forest font-bold text-sm uppercase underline decoration-2 underline-offset-4 cursor-pointer"
                  >
                    Torna allo shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <Link 
                      href={`/ricambi/${item.slug}`}
                      onClick={() => toggleCart(false)}
                      className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link 
                            href={`/ricambi/${item.slug}`}
                            onClick={() => toggleCart(false)}
                            className="text-sm font-black text-gray-900 leading-tight group-hover:text-forest transition-colors cursor-pointer"
                          >
                            {item.title}
                          </Link>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mt-1">
                          RIF: {item.id}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 scale-90 -ml-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-forest transition-colors cursor-pointer"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-gray-700 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            disabled={item.quantity >= (item.maxQuantity || Infinity)}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-forest transition-colors cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1 text-forest">
                          <span className="text-sm font-black">€ {toInteger(item.price)}</span>
                          <span className="text-[10px] font-bold -ml-0.5">{extractDecimal(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotale</span>
                  <div className="flex items-baseline gap-1 text-2xl font-black text-gray-900">
                    <span>€ {toInteger(getSubtotal())}</span>
                    <span className="text-lg -ml-1">{extractDecimal(getSubtotal())}</span>
                  </div>
                </div>
                <button
                  disabled={isCheckoutLoading}
                  onClick={handleCheckout}
                  className="w-full h-16 bg-forest text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg hover:bg-forest/90 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isCheckoutLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Procedi al checkout
                      <ShoppingBagIcon className="w-6 h-6" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">
                  Spedizione calcolata allo step successivo.<br />
                  Pagamenti sicuri tramite Mollie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
