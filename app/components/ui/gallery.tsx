"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import ImageZoom from "../custom/imageZoom";

const DEFAULT_IMAGE =
  "https://silano-3r.fra1.digitaloceanspaces.com/3r/689fcb145515c189ba09482d4a33ebde.webp";

export default function Gallery({ images }) {
  const [image, setImage] = useState(images.data[0]);

  return (
    <div className="flex flex-col w-full lg:w-[600px] max-h-3/6">
      <ImageZoom image={image}></ImageZoom>

      <div className="flex pt-2 overflow-y-auto border-b pb-2">
        {images.data.map((x) => {
          return (
            <div
              key={x.id}
              className="cursor-pointer pr-2"
              onClick={() => setImage(x)}
            >
              <Image
                src={
                  x.attributes.formats.small?.url
                    ? x.attributes.formats.small.url
                    : x.attributes.url
                }
                alt="Ricambio usato"
                width={100}
                height={45}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
