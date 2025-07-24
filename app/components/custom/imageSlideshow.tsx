'use client';
import { useEffect, useRef } from 'react';

type ImageSlideshowProps = {
  images: string[]; // array di URL immagini
};

export default function ImageSlideshow({ images }: ImageSlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    let animationFrameId: number;
    let scrollAmount = 0;

    const scrollImages = () => {
      if (container) {
        scrollAmount += 1;
        if (scrollAmount >= container.scrollWidth / 2) {
          scrollAmount = 0;
        }
        container.scrollLeft = scrollAmount;
      }
      animationFrameId = requestAnimationFrame(scrollImages);
    };

    animationFrameId = requestAnimationFrame(scrollImages);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={containerRef}
        className="flex w-max whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {[...images, ...images].map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx}`}
            className="h-64 w-auto object-cover mr-2"
          />
        ))}
      </div>
    </div>
  );
}
