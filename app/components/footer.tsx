"use client";

import Link from "next/link";

import { Layout } from "@/interfaces/layout";
import MarkdownRenderer from "@/app/components/custom/MarkdownRenderer";

interface FooterProps {
  layout: Array<Layout>;
}

export default function Footer({ layout }: FooterProps) {
  return (
    <div className="flex flex-col bg-base-200">
      <div className="w-full px-4 md:px-16 py-12 flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between">
        {layout.map((x) => {
          if (x.__typename === "ComponentFooterCard") {
            return (
              <div key={x.id} className="flex flex-col">
                <h2 className="mb-4">{x.name}</h2>
                <MarkdownRenderer markdown={`${x.description}`} />
              </div>
            );
          }
          if (x.__typename === "ComponentMenuSection") {
            return (
              <div key={x.id} className="flex flex-col space-y-2">
                <h2 className="mb-2">{x.name}</h2>
                {x.links &&
                  x.links.map((link, index) => {
                    return (
                      <Link key={index} href={link.url} className="font-light">
                        {link.name}
                      </Link>
                    );
                  })}
              </div>
            );
          }
        })}
      </div>
      <div className="w-full h-8 text-center text-sm border-t flex items-center justify-center">
        Copyright {new Date().getFullYear()}
      </div>
    </div>
  );
}
