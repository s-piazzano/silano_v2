"use client";

import React from "react";
import ClientOnly from "../ClientOnly";
import ImageSlideshow from "../ui/ImageSlideshow";

type Props = {
  markdown?: string;
};

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
  if (!markdown || typeof markdown !== "string") {
    return (
      <p className="text-red-500 italic px-4">
        ⚠️ Nessun contenuto Markdown disponibile.
      </p>
    );
  }

  const lines = markdown.split("\n");
  const elements: React.ReactElement[] = [];

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^\*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, idx) => {
      // Bold: **text**
      if (/^\*\*[^\*]+\*\*$/.test(part)) {
        return (
          <strong key={idx} className="font-bold">
            {part.slice(2, -2).trim()}
          </strong>
        );
      }

      // Link: [text](url)
      if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [_, text, url] = match;
          const isDownload = url.endsWith(".pdf");

          return (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download={isDownload}
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

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-4xl font-bold my-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-semibold my-3">
          {line.slice(3)}
        </h2>
      );
    } else if (
      line.startsWith("![") &&
      i + 1 < lines.length &&
      lines[i + 1].trim().startsWith("![")
    ) {
      const img1 = line.match(/\((.*?)\)/)?.[1];
      const img2 = lines[i + 1].trim().match(/\((.*?)\)/)?.[1];
      if (img1 && img2) {
        elements.push(
          <div key={i} className="flex justify-start my-4">
            <ClientOnly>
              <ImageSlideshow images={[img1, img2]} />
            </ClientOnly>
          </div>
        );
        i++;
      }
    } else if (line.startsWith("![") && /\((.*?)\)/.test(line)) {
      const url = line.match(/\((.*?)\)/)?.[1];
      if (url) {
        elements.push(
          <img
            key={i}
            src={url}
            alt="markdown image"
            className="w-full max-w-2xl rounded-xl shadow my-4"
          />
        );
      }
    } else if (line.length > 0) {
      elements.push(
        <p key={i} className="text-base my-2 text-gray-800">
          {parseInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className="text-left">{elements}</div>;
};

export default MarkdownRenderer;
