import React from "react";
import Image from "next/image";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const DEFAULT_IMAGE =
  "https://silano-3r.fra1.digitaloceanspaces.com/3r/689fcb145515c189ba09482d4a33ebde.webp";

const ImageZoom = ({ image }) => {
  // Preferisce il formato small per l'anteprima, altrimenti l'originale, altrimenti il default
  const imageUrl = image?.attributes?.formats?.small?.url || image?.attributes?.url || DEFAULT_IMAGE;
  
  // Per lo zoom usa sempre la risoluzione massima disponibile
  const largeImage = image?.attributes?.url || DEFAULT_IMAGE;

  return (
    <div className="w-full flex justify-center items-center">
      <Zoom zoomImg={{ src: largeImage }}>
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl cursor-zoom-in">
          <Image
            src={imageUrl}
            width={800}
            height={600}
            className="w-full h-auto max-h-[500px]"
            style={{ objectFit: "contain" }}
            alt="product image"
            priority={true}
          />
        </div>
      </Zoom>
    </div>
  );
};

export default ImageZoom;
