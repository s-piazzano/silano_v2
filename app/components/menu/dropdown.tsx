"use client";
import { useState } from "react";
import Link from "next/link";

import { Layout } from "@/interfaces/layout";

export default function DropdownMenu({ name, url, type, sections }: Layout) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link
        onClick={() => setIsHover(!isHover)}
        href={url ? url : "#"}
        className="h-[74px] flex justify-center items-center px-8 text-lg font-extralight"
      >
        {name}
      </Link>

      <div
        className={`absolute z-1000 left-0 w-full bg-base-200 bg-opacity-70 backdrop-blur-xs -mt-1 focus:outline-hidden ${
          isHover ? `block` : `hidden`
        }`}
      >
        <div className="w-full flex space-x-12 md:px-16 md:py-8">
          {/* sections */}
          {sections.map((section, indexSection) => {
            return (
              <div
                key={"section-" + indexSection}
                className="flex flex-col text-lg capitalize"
              >
                <h2 className="text-black font-light  mb-4">{section.title}</h2>
                {/* Links */}
                {section.pages.data.map((page, indexPage) => (
                  <Link
                    onClick={() => setIsHover(!isHover)}
                    key={"page-" + indexPage}
                    href={`/${page.attributes.slug}`}
                    className="font-extralight mb-3"
                    prefetch={false}
                  >
                    {page.attributes.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
