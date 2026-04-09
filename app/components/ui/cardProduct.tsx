import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBagIcon, 
  ArrowRightIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

import { generateTitle } from "@/utils/common";

interface CardProps {
  id: string;
  imageUrl: string;
  slug: string;
  price: number;
  shippingCost?: number;
  quantity: number;
  sub_category: any;
  compatibilities: any[];
  OE?: string;
  motorType?: string;
}

export default function CardProduct({
  id,
  imageUrl,
  slug,
  price,
  shippingCost = 15,
  quantity,
  sub_category,
  compatibilities,
  OE,
  motorType,
}: CardProps) {
  const hasPrice = price && price > 0;
  const totalPrice = hasPrice ? (price + shippingCost) : 0;
  const isAvailable = quantity > 0;
  
  const title = generateTitle(
    sub_category.data,
    compatibilities,
    OE,
    motorType
  );

  // Link per la quotazione (WhatsApp con messaggio predefinito)
  const quoteLink = `https://wa.me/393929898074?text=${encodeURIComponent(`Buongiorno Silano, vorrei una quotazione per: ${title} (Rif: ${id})`)}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-56 w-full bg-gray-50/50 p-4 flex items-center justify-center overflow-hidden">
        <Image
          className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          src={imageUrl || "https://silano-3r.fra1.digitaloceanspaces.com/3r/eb7b1453f0328c5136fe884112e2b89c.jpg"}
          width={400}
          height={300}
          alt={title}
          style={{ objectFit: "contain" }}
        />
        {/* Availability Badge */}
        <div className={`absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isAvailable ? (
            <><CheckCircleIcon className="w-3 h-3" /> Disponibile</>
          ) : (
            <><XCircleIcon className="w-3 h-3" /> Esaurito</>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 flex-1">
          <h3 className="text-gray-900 font-bold leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          
          <div className="space-y-1.5 mt-3">
            {OE && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded tracking-wide">OE</span>
                <span className="font-mono text-gray-600">{OE}</span>
              </div>
            )}
            {motorType && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <InformationCircleIcon className="w-3.5 h-3.5 text-forest/50" />
                <span>Motore: <span className="font-semibold text-gray-700">{motorType}</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-gray-50">
          <div className="flex items-baseline justify-between mb-4">
            {hasPrice ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium tracking-tight">Prezzo finale</span>
                <span className="text-2xl font-black text-forest">
                  € {totalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-xs text-pink-500 font-bold italic uppercase tracking-tighter">Quotazione</span>
                <span className="text-lg font-black text-gray-400 uppercase tracking-tight">
                  Prezzo da definire
                </span>
              </div>
            )}
            
            {hasPrice && shippingCost > 0 && (
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-right">
                Sped. inclusa
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/ricambi/${slug}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              Dettagli
            </Link>
            
            {isAvailable && hasPrice ? (
              <button
                className="snipcart-add-item flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest/90 transition-all shadow-sm active:scale-95"
                data-item-id={id}
                data-item-price={totalPrice}
                data-item-image={imageUrl}
                data-item-name={title}
                data-item-max-quantity={quantity}
                data-item-url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/ricambi/${slug}`}
              >
                <ShoppingBagIcon className="w-4 h-4" />
                Acquista
              </button>
            ) : isAvailable ? (
              <a
                href={quoteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest/90 transition-all shadow-sm active:scale-95"
              >
                <Image 
                  src="/whatsapp.svg" 
                  alt="WhatsApp" 
                  width={16} 
                  height={16} 
                  className=""
                />
                Magazzino
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
