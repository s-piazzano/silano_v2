"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import ImageZoom from "../custom/imageZoom";

const DEFAULT_IMAGE =
  "https://silano-3r.fra1.digitaloceanspaces.com/3r/689fcb145515c189ba09482d4a33ebde.webp";

export default function Gallery({ images }) {
  // Defensive check for images and images.data
  const imageData = images?.data || [];
  const [image, setImage] = useState(imageData[0] || null);

  // Aggiorna l'immagine selezionata se le props cambiano
  useEffect(() => {
    if (imageData.length > 0) {
      setImage(imageData[0]);
    } else {
      setImage(null);
    }
  }, [images]);

  return (
    <div className="flex flex-col md:flex-row w-full max-h-[70vh]">
      <div className="flex md:flex-col mt-3 md:mt-0 overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2 order-last md:order-first scrollbar-hide">
        {imageData.map((x) => {
          const isSelected = image?.id === x.id;
          return (
            <button
              key={x.id}
              type="button"
              className={`cursor-pointer pr-2 mb-2 flex-none transition-all focus:outline-none ${
                isSelected ? "ring-2 ring-forest rounded-lg overflow-hidden translate-y-[-2px]" : "opacity-60 hover:opacity-100"
              }`}
              onClick={() => setImage(x)}
            >
              <Image
                src={
                  x.attributes?.formats?.small?.url
                    ? x.attributes.formats.small.url
                    : x.attributes?.url || DEFAULT_IMAGE
                }
                alt="Miniatura ricambio"
                width={100}
                height={60}
                className="object-cover rounded-md"
              />
            </button>
          );
        })}
      </div>
      <div className="w-full flex justify-center items-center max-h-[500px]">
        {image ? (
          <ImageZoom image={image} />
        ) : (
          <div className="relative w-full aspect-video md:aspect-square max-h-[500px] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center">
             <Image
                src={DEFAULT_IMAGE}
                alt="Immagine non disponibile"
                fill
                className="object-contain p-8 opacity-50"
              />
          </div>
        )}
      </div>
    </div>
  );
}
