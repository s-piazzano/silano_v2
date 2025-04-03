"use client";

import { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Collapse from "../ui/collapse";

import Link from "next/link";
import Image from "next/image";

import Navbar from "../navbar";

// Interfaces
import { Layout } from "@/interfaces/layout";

interface hamburgerMenuProps {
  layout: Array<Layout>;
  imageUrl: string;
}
type menu = HTMLElement;

export default function HamburgerMenu({
  layout,
  imageUrl,
}: hamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  //Altezza del menu in pixel
  const HEIGHTMENU = 106;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    const setWS = Math.max(HEIGHTMENU - window.scrollY, 0);
    const menu: menu = document.getElementById("menu")!;

    if (isOpen) {
      menu.style["top"] = setWS + "px";
    }
  }, [isOpen]);

  return (
    <div className="w-[48px] h-[48px]">
      {/* HamburgerButton */}
      <button
        className=""
        aria-label="hamburger menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars3Icon className="w-full h-full text-stone-600 font-thin focus:outline-none" />
      </button>
      {/* menu container */}
      {isOpen && (
        <div
          id="menu"
          className={`fixed z-10 right-0 top-0 w-full h-screen bg-base-100 overflow-y-auto`}
        >
          <div
            className="py-4 flex flex-col mb-24"
          >
            {layout.map((x, index) => {
              /* Check DropdownMenu type */
              if (x.__typename === "ComponentDropdownMenu") {
                return (
                  <div className=" flex flex-col" key={x.id}>
                    {x.sections.map((section, index) => {
                      return (
                        <div key={index} className="pl-4 text-black">
                          <h2 className="">{section.title}</h2>
                          <div className="text-stone-600 flex flex-col space-y-4 mx-2 my-3">
                            {section.pages.data.map((page, index) => {
                              return (
                                <Link
                                  key={index}
                                  href={`/${page.attributes.slug}`}
                                  as={`/${page.attributes.slug}`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {page.attributes.title}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              if (x.__typename === "ComponentCommonLink")
                return (
                  <Link
                    key={"link-" + index}
                    href={x.url}
                    className=" my-3 pl-4 text-stone-600 font-extralight text-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    {x.linkName}
                  </Link>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
