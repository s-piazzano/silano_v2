"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Layout } from "@/interfaces/layout";

export default function DropdownMenu({ name, url, type, sections }: Layout) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  // Handle hover with delay to prevent accidental closes
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      ref={dropdownRef}
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <Link
        href={url || "#"}
        className="h-[74px] flex justify-center items-center px-8 text-lg font-extralight hover:text-primary transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => {
          // Only prevent default if there are dropdown items
          if (sections?.length > 0) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {name}
      </Link>

      {isOpen && sections?.length > 0 && (
        <div className="absolute left-0 right-0 w-full bg-base-200 shadow-lg z-50">
        <div className="mx-auto px-16 py-6 w-full">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2">
            {sections.map((section, indexSection) => (
              <div 
                key={`section-${indexSection}`}
                className="flex-shrink-0"
                style={{ width: '280px' }}
              >
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  {section.title}
                </h3>
                <div className="flex flex-col space-y-2">
                  {section.pages.data.map((page, indexPage) => (
                    <Link
                      key={`page-${indexPage}`}
                      href={`/${page.attributes.slug}`}
                      className="py-1 hover:text-primary capitalize text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {page.attributes.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}