import React, { useState, useRef } from "react";
import Image from "next/image";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const DEFAULT_IMAGE =
  "https://silano-3r.fra1.digitaloceanspaces.com/3r/689fcb145515c189ba09482d4a33ebde.webp";

const ImageZoom = ({ image }) => {
  const imageUrl = image?.attributes?.formats?.small?.url
    ? image?.attributes?.formats?.small?.url
    : DEFAULT_IMAGE;
  const largeImage = image?.attributes?.url
    ? image?.attributes?.url
    : DEFAULT_IMAGE;

  return (
    <div className="">
      <Zoom  zoomImg={{ src: largeImage }}>
        {" "}
      
        <Image
          src={imageUrl}
          width={800}
          height={400}
          className="max-h-[500px]"
          style={{ objectFit: "contain" }}
          alt="product image"
        />
    
      </Zoom>
    </div>
  );
};

export default ImageZoom;
