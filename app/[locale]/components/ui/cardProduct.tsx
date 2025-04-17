import Image from "next/image";
import Link from "next/link";

import { generateTitle } from "@/utils/common";

interface CardProps {
  id: string;
  key: string;
  imageUrl: string;
  children: React.ReactNode;
  slug: string;
  price: number;
  quantity: number;
  sub_category: {
    data: {
      attributes: {
        name: string;
        defaultShippingCost: number;
      };
    };
  },
  compatibilities: {
    data: {
      attributes: {
        make: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
        model: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
        engine_capacity: {
          data: {
            attributes: {
              capacity: string;
            };
          };
        };
        fuel_system: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
      };
    }
  }[];
  OE: string;
  motorType: string;
}

export default function CardProduct({
  id,
  imageUrl = "https://silano-3r.fra1.digitaloceanspaces.com/3r/eb7b1453f0328c5136fe884112e2b89c.jpg?updated_at=2023-02-16T10:32:29.892Z",
  children,
  slug,
  price,
  quantity,
  sub_category,
  compatibilities,
  OE,
  motorType,
}: CardProps) {
  return (
    <div
      id={id}
      className={`bg-neutral-100 w-full md:max-w-sm  rounded-sm overflow-hidden shadow-lg flex flex-col`}
    >
      <Image
        className="w-full h-[220px] "
        src={imageUrl}
        width={600}
        height={400}
        alt="image-card"
        style={{ objectFit: "contain" }}
      />
      {/* Children */}
      <div className={`flex flex-col py-4 grow p-2`}>{children}</div>
      {/* Footer */}
      <div className="p-2 py-4 flex justify-between items-center">
        {" "}
      
        {/* Snipchart button */}
        {price &&
          price > 0 &&
          quantity > 0 && (
            (<button
              className="snipcart-add-item p-2 text-white bg-forest font-light uppercase rounded-xs"
              data-item-id={id}
              data-item-price={price}
              data-item-image={
                imageUrl
              }
              data-item-name={generateTitle(
                sub_category.data,
                compatibilities,
                OE,
                motorType
              )}
              data-item-max-quantity={quantity}
            >Acquista ora
            </button>)
            /*  <CartButton productID={product.id} /> */
          )}
        <Link
          href={`/ricambi/${slug}`}
          className="p-2 font-light uppercase rounded-xs"
        >
          Vedi il prodotto
        </Link>
      </div>
    </div>
  );
}
