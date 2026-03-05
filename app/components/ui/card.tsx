import Image from "next/image";
import Link from "next/link";

import { LinkInt } from "@/interfaces/common";

type GridProps = {
  key?: React.Key;
  id: string;
  image: string;
  title: string;
  description?: string;
  link?: LinkInt;
  containerClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  linkClass?: string;
};

export default function Card({
  id,
  image,
  title,
  description,
  link,
  containerClass,
  titleClass,
  descriptionClass,
  linkClass,
}: GridProps) {
  const Wrapper: React.ElementType = link?.url ? Link : "div"; // scegli il wrapper

  const wrapperProps = link?.url
    ? { id, href: link.url, className: `group min-h-0 h-auto w-full flex-1 ${containerClass}` }
    : { id, className: `group min-h-0 h-auto w-full flex-1 ${containerClass}` };

  return (
    <Wrapper {...wrapperProps}>
      <div className="relative flex flex-col w-full min-h-96 overflow-hidden shadow-lg">
        {/* Immagine */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Overlay con gradiente */}
        <div
          className="relative mt-auto inset-x-0 bottom-0 p-4
                     bg-gradient-to-t from-black/90 via-black/60 to-transparent
                     transition-all duration-300
                     group-hover:from-black/95 group-hover:via-black/70"
        >
          {/* Titolo */}
          <h3
            className={`text-white text-lg font-bold tracking-wide transition-all duration-300
                        group-hover:text-white group-hover:text-xl uppercase ${titleClass}`}
          >
            {title}
          </h3>

          {/* Descrizione */}
          {description && (
            <p
              className={`mt-1 text-sm text-gray-200 lg:line-clamp-2 group-hover:line-clamp-none
                          transition-all duration-300 ${descriptionClass}`}
            >
              {description}
            </p>
          )}

          {/* Pulsante “Scopri di più” */}
          {link?.url && (
            <span
              className={`inline-block mt-3 px-4 py-2 text-sm font-medium text-white border border-white rounded
                          transition-all duration-300
                          sm:inline-block md:inline-block lg:hidden group-hover:inline-block
                          ${linkClass}`}
            >
              Scopri di più
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
