import Link from "next/link";
import DropdownMenu from "./dropdown";
import { Layout } from "@/interfaces/layout";

interface MenuProps {
  layout: Array<Layout>;
}

export default function Menu({ layout }: MenuProps) {
  return (
    <div className="hidden w-full h-[74px] lg:flex text-stone-900 font-light uppercase text-sm tracking-widest">
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
  );
}
