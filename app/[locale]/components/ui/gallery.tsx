"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import ImageZoom from "../custom/imageZoom";

const DEFAULT_IMAGE =
  "https://silano-3r.fra1.digitaloceanspaces.com/3r/689fcb145515c189ba09482d4a33ebde.webp";

export default function Gallery({ images }) {
  const [image, setImage] = useState(images.data[0]);

  return (
    <div className="flex flex-col md:flex-row  w-full max-h-4/6">
      <div className="flex md:flex-col mt-3 md:mt-0 overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2 order-last md:order-first">
        {images.data.map((x) => {
          return (
            <div
              key={x.id}
              className="cursor-pointer pr-2 flex-none"
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
      <div className="w-full flex justify-start max-h-[500px]">
        <ImageZoom image={image}></ImageZoom>
      </div>
    </div>
  );
}
