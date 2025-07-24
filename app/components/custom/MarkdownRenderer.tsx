"use client";

import React from "react";
import ClientOnly from "../ClientOnly";
import ImageSlideshow from "../ui/ImageSlideshow";

type Props = {
  markdown?: string; // può essere undefined
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
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-bold text-lg my-2">
          {line.slice(2, -2)}
        </p>
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
          <div key={i} className="flex justify-start">
            <ClientOnly> <ImageSlideshow images={[img1, img2]} /></ClientOnly>

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
            className="w-full max-w-2xl rounded-xl shadow"
          />
        );
      }
    } else if (line.length > 0) {
      const parts = line.split(/(\*\*[^\*]+\*\*)/g); // divide il testo mantenendo i bold

      const parsed = parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        } else {
          return <span key={idx}>{part}</span>;
        }
      });

      elements.push(
        <p key={i} className="text-base my-2 text-gray-800">{parsed}</p>
      );
    }

    i++;
  }

  return <div className="text-left">{elements}</div>;
};

export default MarkdownRenderer;
