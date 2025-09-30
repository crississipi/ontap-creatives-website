"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

function useInView(threshold = 1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return { ref, isInView };
}

const OnTapAnimation = () => {
  const { ref: section1Ref, isInView: section1Visible } = useInView();

  return (
    <div
      ref={section1Ref}
      className="scale-85 lg:scale-95 xl:scale-100 h-120 w-full flex relative perspective-distant items-center"
    >
      <div
        className={`w-54 absolute transform-3d ${
          section1Visible ? "md:right-[55%] lg:right-0 lg:left-5 xl:left-[5%] right-70/100" : "left-1/2 -translate-1/2"
        } top-1/2 -translate-y-1/2 rounded-lg -rotate-z-90 overflow-hidden rotate-y-65 ease-out duration-500`}
      >
        <Image
          height={500}
          width={500}
          alt="ontap creatives cards"
          src="/images/card-2/front.png"
          className="w-full object-contain object-center"
          draggable={false}
        />
      </div>
      <div
        className={`h-full ${
          section1Visible ? "min-w-42 max-w-42" : "min-w-0 max-w-0 mx-auto overflow-hidden"
        } flex items-center relative ml-5 md:-ml-3 lg:ml-24 xl:ml-24 2xl:ml-44 perspective-distant rotate-y-55 transform-3d ease-out duration-500`}
      >
        <span
          className={`h-4 w-4 rounded-full absolute z-50 border pulseGrow scale-80 md:scale-100`}
          style={{ animationDelay: `0.05s` }}
        ></span>
        <span
          className={`h-12 w-12 rounded-full absolute z-50 border pulseGrow left-4 scale-80 md:scale-100`}
          style={{ animationDelay: `0.08s` }}
        ></span>
        <span
          className={`h-20 w-20 rounded-full absolute z-50 border pulseGrow left-8 scale-80 md:scale-100`}
          style={{ animationDelay: `0.11s` }}
        ></span>
        <span
          className={`h-28 w-28 rounded-full absolute z-50 border pulseGrow left-12 scale-80 md:scale-100`}
          style={{ animationDelay: `0.14s` }}
        ></span>
        <span
          className={`h-36 w-36 rounded-full absolute z-50 border pulseGrow left-16 scale-80 md:scale-100`}
          style={{ animationDelay: `0.17s` }}
        ></span>
        <span
          className={`h-44 w-44 rounded-full absolute z-50 border pulseGrow left-20 scale-80 md:scale-100`}
          style={{ animationDelay: `0.2s` }}
        ></span>
        <span
          className={`h-52 w-52 rounded-full absolute z-50 border pulseGrow left-24 scale-80 md:scale-100`}
          style={{ animationDelay: `0.23s` }}
        ></span>
        <span
          className={`h-60 w-60 rounded-full absolute z-50 border pulseGrow left-28 scale-80 md:scale-100`}
          style={{ animationDelay: `0.26s` }}
        ></span>
        <span
          className={`h-68 w-68 rounded-full absolute z-50 border pulseGrow left-32 scale-80 md:scale-100`}
          style={{ animationDelay: `0.29s` }}
        ></span>
        <span
          className={`h-76 w-76 rounded-full absolute z-50 border pulseGrow left-36 scale-80 md:scale-100`}
          style={{ animationDelay: `0.32s` }}
        ></span>
        <span
          className={`h-84 w-84 rounded-full absolute z-50 border pulseGrow left-40 scale-80 md:scale-100`}
          style={{ animationDelay: `0.35s` }}
        ></span>
        <span
          className={`h-92 w-92 rounded-full absolute z-50 border pulseGrow left-44 scale-80 md:scale-100`}
          style={{ animationDelay: `0.38s` }}
        ></span>
        <span
          className={`h-100 w-100 rounded-full absolute z-50 border pulseGrow left-48 scale-80 md:scale-100`}
          style={{ animationDelay: `0.41s` }}
        ></span>
      </div>
      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[50%] rotate-y-50 border-2 border-blue absolute ${
          section1Visible
            ? "md:left-[70%] lg:left-[60%] md:scale-115 left-[60%] scale-115 z-60"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30 z-30"
        } rounded-4xl ease-out duration-500 delay-100`}
      ></span>

      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[50%] rotate-y-50 border-2 border-blue absolute ${
          section1Visible
            ? "md:left-[55%] lg:left-[50%] md:scale-105 left-[45%] scale-105 z-60"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30 z-30"
        } rounded-4xl ease-out duration-500 delay-150`}
      ></span>

      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[40%] rotate-y-50 border-2 border-blue absolute z-40 ${
          section1Visible
            ? "md:left-[25%] lg:left-[35%] md:scale-85 left-[25%] scale-85"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30"
        } rounded-4xl ease-out duration-500 delay-200`}
      ></span>

      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[40%] rotate-y-50 border-2 border-blue absolute z-40 ${
          section1Visible
            ? "md:left-[14%] lg:left-[25%] md:scale-75 left-[15%] scale-75"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30"
        } rounded-4xl ease-out duration-500 delay-250`}
      ></span>

      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[30%] rotate-y-50 border-2 border-blue absolute z-40 ${
          section1Visible
            ? "left-[5%] lg:left-[20%] md:left-4 md:scale-65 scale-65"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30"
        } rounded-3xl ease-out duration-500 delay-300`}
      ></span>

      <span
        className={`h-[95%] w-[60%] lg:h-[90%] lg:w-[30%] rotate-y-50 border-2 border-blue absolute z-40 ${
          section1Visible
            ? "md:-left-[5%] lg:left-[15%] md:scale-55 -left-5 scale-55"
            : "left-1/2 -translate-x-1/2 md:scale-50 scale-30"
        } rounded-2xl ease-out duration-500 delay-350`}
      ></span>

      <div className={`w-40 object-contain pt-5 object-center rounded-lg -mt-5 z-50 absolute ${
            section1Visible ? "right-1/4 md:-right-3 lg:right-1/5 xl:right-1/5 2xl:right-1/3" : "mx-auto md:mx-0 right-1/2 translate-x-1/2"
          } ease-out duration-100`}
      >
        <Image
          height={500}
          width={500}
          alt="ontap creatives cards"
          src="/images/ontapphone.png"
          className={`w-full object-contain object-center rounded-lg`}
          draggable={false}
        />
      </div>
    </div>
  )
}

export default OnTapAnimation