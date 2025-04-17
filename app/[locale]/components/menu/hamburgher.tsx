"use client";

import { useState, useEffect, useCallback } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Layout } from "@/interfaces/layout";

interface HamburgerMenuProps {
  layout: Array<Layout>;
  imageUrl: string;
}

export default function HamburgerMenu({ layout, imageUrl }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = "hamburger-menu";

  // Gestione dello scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Gestione della tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.getElementById(menuId)?.focus();
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);


  const renderLinks = useCallback(() => {
    if (!layout?.length) return null;

    return layout.map((item, index) => { // Aggiungi index come fallback
      // Controllo sicurezza per ID mancante
      const safeId = item.id || `fallback-${index}`;

      if (item.__typename === "ComponentDropdownMenu") {
        return (
          <section key={`dropdown-${safeId}`} className="">
            {item.sections?.map((section, sectionIndex) => {
              const sectionId = section.id || `section-${sectionIndex}`;
              return (
                <div key={`section-${sectionId}`} className="pl-4 py-3">
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
          </section>
        );
      }

      if (item.__typename === "ComponentCommonLink") {
        return (
          <Link
            key={`link-${safeId}`} // Usa safeId invece di item.id
            href={item.url || "#"}
            className="my-2 pl-4 text-gray-600 font-light text-lg hover:text-primary transition-colors block py-2"
            onClick={() => setIsOpen(false)}
            aria-label={`Vai a ${item.linkName}`}
          >
            {item.linkName}
          </Link>
        );
      }

      return null;
    });
  }, [layout]);


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
      >
        <Bars3Icon className="w-8 h-8 text-gray-700" />
      </button>

      <div
        id={menuId}
        className={`fixed inset-0 z-50 bg-white transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="w-8 h-8" /> {/* Spazio vuoto per bilanciare il layout */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Chiudi menu"
          >
            <XMarkIcon className="w-8 h-8 text-gray-700" />
          </button>
        </div>

        <nav className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-6">{renderLinks()}</div>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </div>
  );
}