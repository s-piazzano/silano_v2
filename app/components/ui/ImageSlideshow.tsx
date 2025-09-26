"use client"; // se usi Next 13/14 con app dir

import React, { useEffect, useState } from "react";
import Image from "next/image";

const ImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden flex justify-center my-6">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${i}`}
            fill
            className="object-contain"
            priority={i === 0} // la prima immagine viene precaricata
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSlideshow;
