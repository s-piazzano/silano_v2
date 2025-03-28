"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import Menu from "./menu/menu";
import HamburgerMenu from "./menu/hamburgher";

import anime from "animejs";

import { Layout } from "@/interfaces/layout";

import ButtonCart from "./ui/buttonCart";

interface NavbarProps {
  imageUrl: string;
  hours: String;
  contact: String;
  layout: Array<Layout>;
}

export default function Navbar({
  imageUrl,
  hours,
  contact,
  layout,
}: NavbarProps) {
  useEffect(() => {
    var tl = anime.timeline({
      easing: "easeOutExpo",
      duration: 3000,
    });
    tl.add({
      targets: "#companyName",
      translateX: 8,
      opacity: 1,
    });
  });

  const menuStatus = (status) => {};

  return (
    <div className="w-full">
      {/* BANNER */}
      <div className=" w-full h-[32px] flex px-4 md:px-16 bg-forest justify-center md:justify-between items-center text-white text-sm">
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
      <div className="relative w-full h-[74px] bg-base-200 border-b border-gray-200 px-4 md:px-16 flex justify-between lg:justify-normal items-center ">
        {/* LOGO */}
        <Link
          href="/"
          className="w-[80px] flex flex-col items-start shrink-0"
        >
          <Image
            className="w-[45px] h-[45px]"
            src={imageUrl}
            width={96}
            height={96}
            quality={100}
            alt="logo"
            priority
          />
          <p
            id="companyName"
            className="uppercase text-xxs text-forest opacity-0 font-light -ml-2"
          >
            silano srl
          </p>
        </Link>
        <div className="w-full flex space-between">
          <Menu layout={layout} />
        </div>
        <div className="flex space-x-8 items-center lg:hidden ">
          {/* Bottone carrello - visibile solo nella sezione ricambi */}
          <ButtonCart />
          <HamburgerMenu layout={layout} imageUrl={imageUrl} />
        </div>
      </div>
    </div>
  );
}
