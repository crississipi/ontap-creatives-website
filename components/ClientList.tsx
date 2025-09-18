"use client";

import React, { useState, useRef, useEffect} from "react";
import Image from "next/image";

const logos = Array.from(
  { length: 15 },
  (_, i) => `/images/client-logos/sponsor-${i + 1}.png`
);

type MarqueeRowProps = {
  images: string[];
  direction?: "left" | "right";
};

const MarqueeRow: React.FC<MarqueeRowProps> = ({ images, direction = "left" }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const itemWidth = 120; // px
  const gap = 40; // px
  const step = itemWidth + gap;

  const visibleItems = Array.from({ length: images.length }, (_, i) => {
    const index = (startIndex + i) % images.length;
    return images[index];
  });

  useEffect(() => {
    let offset = 0;
    let frame: number;

    const tick = () => {
      if (trackRef.current) {
        offset += direction === "left" ? -1 : 1;
        trackRef.current.style.transform = `translateX(${offset}px)`;

        if (direction === "left" && Math.abs(offset) > step) {
          offset += step;
          setStartIndex((prev) => (prev + 1) % images.length);
        } else if (direction === "right" && offset > step) {
          offset -= step;
          setStartIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [direction, images.length, step]);

  return (
    <div className="relative h-28 w-full overflow-hidden mx-auto">
      <div
        ref={trackRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 flex h-full items-center"
        style={{ gap }}
      >
        {visibleItems.map((src, i) => (
          <div
            key={i}
            className="h-20 flex items-center justify-center"
            style={{ width: itemWidth }}
          >
            <Image
              height={itemWidth}
              width={itemWidth}
              alt={`Client Logo ${i}`}
              src={src}
              className="h-full object-contain object-center"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// helper to slice ranges with wrap-around
const sliceRange = (arr: string[], start: number, end: number) => {
  if (end >= start) {
    return arr.slice(start, end);
  }
  return [...arr.slice(start), ...arr.slice(0, end)];
};

const ClientList = () => {
  return (
    <>
        <div className="relative h-auto w-full overflow-hidden bg-light-blue flex flex-col">
            <MarqueeRow images={logos.slice(0, 15)} direction="left" />
        </div>
    </>
  );
};

export default ClientList;
