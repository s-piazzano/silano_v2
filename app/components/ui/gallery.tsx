"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({ images }) {
  const [imageUrl, setImageUrl] = useState(
    images.data.length
      ? images.data[0].attributes.formats.small.url
      : "https://silano-3r.fra1.digitaloceanspaces.com/3r/2d8db009212b92d9f9e336072b312ce6.jpg?updated_at=2023-04-27T09:22:12.184Z"
  );

  return (
    <div className="flex flex-col w-full md:w-1/2 lg:w-[500px]">
      <Image
        src={imageUrl}
        alt="Picture of the author"
        width={800}
        height={400}
        className="cursor-pointer "
      />
      <div className="flex pt-2 overflow-y-auto">
        {images.data.map((x) => {
          return (
            <div
              key={x.id}
              className="cursor-pointer pr-2"
              onClick={() =>
                setImageUrl(
                  x.attributes.formats.small?.url
                    ? x.attributes.formats.small.url
                    : x.attributes.url
                )
              }
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
