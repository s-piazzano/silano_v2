import Link from "next/link";
import DropdownMenu from "./dropdown";
import { Layout } from "@/interfaces/layout";
import { usePathname } from "next/navigation";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface MenuProps {
  layout: Array<Layout>;
}

export default function Menu({ layout }: MenuProps) {
  const pathname = usePathname();
  const searchString = "ricambi";
  return (
    <div className="hidden w-full h-[74px] lg:flex text-stone-900 font-light uppercase text-sm tracking-widest justify-between">
      <div className="flex">
        {layout.map((x: any) => {
          /* Dropdown Menu */
          if (x.__typename === "ComponentDropdownMenu")
            return (
              <DropdownMenu
                key={x.id}
                name={x.name}
                url={x.url}
                type={x.type}
                sections={x.sections}
              />
            );
          if (x.__typename === "ComponentCommonLink")
            return (
              <Link
                key={"link-" + x.id}
                href={x.url}
                className="flex items-center justify-center px-4 text-lg font-extralight"
              >
                {x.linkName}
              </Link>
            );
        })}
      </div>
      {/* Bottone carrello - visibile solo nella sezione ricambi */}
      <button className="snipcart-checkout h-full ">
        {pathname.includes(searchString) && (
          <div className="flex items-start">
            <ShoppingCartIcon className="h-8 w-8 text-forest" />
            <span className="snipcart-items-count w-4 h-4 rounded-full bg-yellow-400 text-white text-xs font-semibold -ml-4"></span>
          </div>
        )}
      </button>
    </div>
  );
}
