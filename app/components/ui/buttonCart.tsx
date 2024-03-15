import { usePathname } from "next/navigation";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function ButtonCart() {
  const pathname = usePathname();
  const searchString = "ricambi";
  return (
    <button className="snipcart-checkout w-[38px] h-[38px] ">
      {pathname.includes(searchString) && (
        <div className="flex items-start">
          <ShoppingCartIcon className=" text-forest" />
          <span className="snipcart-items-count w-4 h-4 rounded-full bg-yellow-400 text-white text-xs font-semibold -ml-4"></span>
        </div>
      )}
    </button>
  );
}
