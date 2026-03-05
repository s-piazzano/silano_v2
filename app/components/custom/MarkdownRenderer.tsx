"use client";

import { ReactElement } from "react";
import ClientOnly from "../ClientOnly";
import ImageSlideshow from "../ui/ImageSlideshow";

type Props = { markdown?: string };

export default function MarkdownRenderer({ markdown }: Props) {
  if (!markdown || typeof markdown !== "string") {
    return (
      <p className="text-red-500 italic px-4">
        ⚠️ Nessun contenuto Markdown disponibile.
      </p>
    );
  }

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^\*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, idx) => {
      if (/^\*\*[^\*]+\*\*$/.test(part)) {
        return (
          <strong key={idx} className="font-bold">
            {part.slice(2, -2).trim()}
          </strong>
        );
      }
      if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [, text, url] = match;
          return (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {text}
            </a>
          );
        }
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const elements: ReactElement[] = [];
  let lastIndex = 0;

  // Match <grid> ... </grid>
  const gridRegex = /<grid>([\s\S]*?)<\/grid>/g;
  let match: RegExpExecArray | null;

  while ((match = gridRegex.exec(markdown)) !== null) {
    const beforeGrid = markdown.slice(lastIndex, match.index).trim();
    if (beforeGrid) {
      elements.push(...renderLines(beforeGrid));
    }

    const gridContent = match[1];
    elements.push(
      <div
        key={`grid-${elements.length}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6"
      >
        {renderCards(gridContent)}
      </div>
    );

    lastIndex = gridRegex.lastIndex;
  }

  const afterGrid = markdown.slice(lastIndex).trim();
  if (afterGrid) {
    elements.push(...renderLines(afterGrid));
  }

  return <div className="markdown-content prose max-w-none">{elements}</div>;

  function renderLines(text: string) {
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    const result: ReactElement[] = [];
    let i = 0;
    while (i < lines.length) {
      const imgUrls: string[] = [];
      while (
        i < lines.length &&
        lines[i].startsWith("![") &&
        /\((.*?)\)/.test(lines[i])
      ) {
        const url = lines[i].match(/\((.*?)\)/)?.[1];
        if (url) imgUrls.push(url);
        i++;
      }
      if (imgUrls.length > 1) {
        result.push(
          <ClientOnly key={`slideshow-${i}`}>
            <ImageSlideshow images={imgUrls} />
          </ClientOnly>
        );
      } else if (imgUrls.length === 1) {
        result.push(
          <div key={`img-${i}`} className="relative w-full shadow my-4 mx-auto max-h-[374px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrls[0]}
              alt="Markdown content"
              className="w-full object-cover max-h-[374px]"
            />
          </div>
        );
      } else {
        result.push(<p key={`p-${i}`}>{parseInline(lines[i])}</p>);
        i++;
      }
    }
    return result;
  }

  function renderCards(gridContent: string) {
    const cardRegex = /<>\s*([\s\S]*?)\s*<\/>/g;
    const cards: ReactElement[] = [];
    let cardMatch: RegExpExecArray | null;

    while ((cardMatch = cardRegex.exec(gridContent)) !== null) {
      const cardText = cardMatch[1].trim();
      const cardElements = renderLines(cardText);
      cards.push(
        <div
          key={`card-${cards.length}`}
          className="bg-white shadow p-4 italic text-2xl flex flex-col justify-between"
        >
          {cardElements}
        </div>
      );
    }

    return cards;
  }
}
