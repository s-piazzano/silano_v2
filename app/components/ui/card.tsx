import Image from "next/image";
import Link from "next/link";

import { LinkInt } from "@/interfaces/common";

interface CardProps {
  id: string;
  className: string;
  imageUrl: string;
  title: string;
  description: string;
  link: LinkInt;
  containerClass: string;
  titleClass?: string;
  descriptionClass?: string;
  linkClass?: string;
}

export default function Card({
  id,
  className = "",
  imageUrl = "https://silano-3r.fra1.digitaloceanspaces.com/3r/eb7b1453f0328c5136fe884112e2b89c.jpg?updated_at=2023-02-16T10:32:29.892Z",
  title,
  description,
  link,
  containerClass = "",
  titleClass = "",
  descriptionClass = "",
  linkClass = "",
}: CardProps) {
  return (
    <Link href={link.url} className="min-h-0 h-auto md:max-w-[240px] flex-1">
      <div
        id={id}
        className={`bg-neutral-100 h-full rounded-sm overflow-hidden shadow-lg flex flex-col  ${className} `}
      >
        <Image
          className="w-full h-auto md:h-[240px] object-cover"
          src={imageUrl}
          width={600}
          height={400}
          alt="image-card"
        />

        <div className={` py-4 grow ${containerClass}`}>
          <div className={`font-normal text-xl mb-2 ${titleClass}`}>{title}</div>
          <p className={`text-gray-700 font-light ${descriptionClass}`}>
            {description}
          </p>
        </div>
        <div className="`pt-4 pb-2 pl-2 ${linkClass}`">
          Scopri di più
        </div>
      </div>
    </Link>

  );
}
