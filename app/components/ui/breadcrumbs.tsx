import Link from "next/link";

import { capitalize } from "@/lib/common";

interface Crumb {
  label: string;
  link: string;
}

interface BreadcrumbsProps {
  crumbs: Array<Crumb>;
}

export default async function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <div className="flex flex-wrap md:flex-row space-x-1 text-gray-600 font-light text-sm mb-2 border-b pb-2 ">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          <Link href={crumb.link}>
            {capitalize(crumb.label?.toLowerCase())}
          </Link>{" "}
          /
        </span>
      ))}
    </div>
  );
}
