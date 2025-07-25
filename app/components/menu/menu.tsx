import Link from "next/link";
import DropdownMenu from "./dropdown";
import { Layout } from "@/interfaces/layout";

import ButtonCart from "../ui/buttonCart";

interface MenuProps {
  layout: Array<Layout>;
}

export default function Menu({ layout }: MenuProps) {
  return (
    <div className="hidden w-full h-[74px] lg:flex text-stone-900 font-light uppercase text-sm tracking-widest justify-between items-center">
      <div className="flex">
        {layout.map((x, index) => {
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
                key={"link-" + index}
                href={x.url}
                className="flex items-center justify-center px-4 text-lg font-medium pointer hover:text-forest"
              >
                {x.linkName}
              </Link>
            );
        })}
      </div>
      {/* Bottone carrello - visibile solo nella sezione ricambi */}
      <ButtonCart />
    </div>
  );
}
