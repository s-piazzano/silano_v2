"use client";

import { useState, useEffect } from "react";
import { Bars2Icon } from "@heroicons/react/24/outline";
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

export default function HamburgerMenu({
  layout,
  imageUrl,
}: hamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  /*  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];

    if (isOpen) {
      html.classList.add("lock-scroll");
    } else {
      html.classList.remove("lock-scroll");
    }
    return (): void => {
      html.classList.remove("lock-scroll");
    };
  }, [isOpen]); */

  return (
    <div className="">
      {/* HamburgerButton */}
      <button
        className=""
        aria-label="hamburger menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars2Icon className="w-[42px] h-[42px]  text-stone-600 font-thin focus:outline-none" />
      </button>
      {/* menu container */}
      {isOpen && (
        <div className="fixed z-[1000] left-0 top-0 w-full h-screen bg-base-200 flex flex-col  text-lg overflow-y-auto">
          {/* BANNER */}
          <div className=" w-full h-[32px] flex px-4 md:px-16 bg-forest justify-center md:justify-between items-center text-white text-sm font-thin">
            <h6 className="hidden md:block"></h6>
            <div className="flex divide-x">
              <a
                target="_blank"
                rel="noreferrer"
                className="px-2"
                href="tel:+390161930380"
              >
                Tel: 0161 930380
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                className="px-2"
                href="https://wa.me/+393929898074"
              >
                Whatsapp: 392 989 8074
              </a>
            </div>
          </div>
          {/* MENU */}
          <div className="relative w-full h-[74px] bg-base-200 border-b border-gray-200 px-4 md:px-16 flex justify-between items-center ">
            {/* LOGO */}
            <Link
              href="/"
              className="w-[65px] flex flex-col items-center  mr-6 -ml-1"
            >
              <Image
                className="w-[45px] h-[45px] mt-[7px]"
                src={imageUrl}
                width={96}
                height={96}
                quality={100}
                alt="logo"
              />
              <p className="w-full uppercase text-xxs text-forest font-light ml-[25px] -mt-[7px]">
                silano srl
              </p>
            </Link>
            {/* HAMBURGER MENU BUTTON */}
            <button
              className="-mt-[6px]"
              aria-label="hamburger menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Bars2Icon className="w-[42px] h-[42px]  text-stone-600 font-thin focus:outline-none" />
            </button>
          </div>
          {layout.map((x) => {
            /* Check DropdownMenu type */
            if (x.__typename === "ComponentDropdownMenu") {
              return (
                <Collapse
                  className="px-4"
                  key="x.id"
                  title={x.name.toUpperCase()}
                >
                  <div className=" flex flex-col ">
                    {x.sections.map((section, index) => {
                      return (
                        <div key={index} className="pl-2 pt-2 text-black ">
                          <h2 className="">{section.title}</h2>
                          <div className="text-stone-600 flex flex-col space-y-4 mx-2 my-4">
                            {section.pages.data.map((page, index) => {
                              return (
                                <Link
                                  key={index}
                                  href={page.attributes.slug}
                                  as={page.attributes.slug}
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
                </Collapse>
              );
            }
            if (x.__typename === "ComponentCommonLink")
              return (
                <Link
                  key={"link-" + x.id}
                  href={x.url}
                  className="py-4 pl-4 text-stone-600 uppercase font-extralight"
                  onClick={()=>setIsOpen(false)}
                >
                  {x.linkName}
                </Link>
              );
          })}
        </div>
      )}
    </div>
  );
}
