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
      className="scale-85 lg:scale-95 xl:scale-100 h-120 lg:min-w-[40dvw] lg:max-w-[40dvw] min-w-full max-w-full lg:-left-10 xl:left-0 flex relative perspective-distant items-center"
    >
      <div
        className={`w-54 absolute transform-3d top-1/2 -translate-y-1/2 -left-20 md:left-10 lg:-left-16 xl:left-0 2xl:left-10 rounded-lg -rotate-z-90 overflow-hidden rotate-y-65 ease-out duration-500`}
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
        className={`h-full flex items-center relative left-6 md:left-36 lg:left-10 xl:left-28 2xl:left-36 perspective-distant rotate-y-55 transform-3d ease-out duration-500`}
      >
        <span
          className={`h-4 w-4 rounded-full absolute z-50 border pulseGrow scale-80 md:scale-100`}
          style={{ animationDelay: `0.05s` }}
        ></span>
        <span
          className={`h-12 w-12 rounded-full absolute z-50 border pulseGrow left-2 scale-80 md:scale-100`}
          style={{ animationDelay: `0.1s` }}
        ></span>
        <span
          className={`h-20 w-20 rounded-full absolute z-50 border pulseGrow left-6 scale-80 md:scale-100`}
          style={{ animationDelay: `0.15s` }}
        ></span>
        <span
          className={`h-28 w-28 rounded-full absolute z-50 border pulseGrow left-10 scale-80 md:scale-100`}
          style={{ animationDelay: `0.2s` }}
        ></span>
        <span
          className={`h-36 w-36 rounded-full absolute z-50 border pulseGrow left-14 scale-80 md:scale-100`}
          style={{ animationDelay: `0.25s` }}
        ></span>
        <span
          className={`h-44 w-44 rounded-full absolute z-50 border pulseGrow left-18 scale-80 md:scale-100`}
          style={{ animationDelay: `0.3s` }}
        ></span>
        <span
          className={`h-52 w-52 rounded-full absolute z-50 border pulseGrow left-22 scale-80 md:scale-100`}
          style={{ animationDelay: `0.35s` }}
        ></span>
        <span
          className={`h-60 w-60 rounded-full absolute z-50 border pulseGrow left-26 scale-80 md:scale-100`}
          style={{ animationDelay: `0.4s` }}
        ></span>
        <span
          className={`h-68 w-68 rounded-full absolute z-50 border pulseGrow left-30 scale-80 md:scale-100`}
          style={{ animationDelay: `0.45s` }}
        ></span>
        <span
          className={`h-76 w-76 rounded-full absolute z-50 border pulseGrow left-34 scale-80 md:scale-100`}
          style={{ animationDelay: `0.5s` }}
        ></span>
        <span
          className={`h-84 w-84 rounded-full absolute z-50 border pulseGrow left-38 scale-80 md:scale-100`}
          style={{ animationDelay: `0.55s` }}
        ></span>
        <span
          className={`h-92 w-92 rounded-full absolute z-50 border pulseGrow left-42 scale-80 md:scale-100`}
          style={{ animationDelay: `0.6s` }}
        ></span>
        <span
          className={`h-100 w-100 rounded-full absolute z-50 border pulseGrow left-46 scale-80 md:scale-100`}
          style={{ animationDelay: `0.65s` }}
        ></span>
        <span
          className={`h-108 w-108 rounded-full absolute z-50 border pulseGrow left-50 scale-80 md:scale-100`}
          style={{ animationDelay: `0.7s` }}
        ></span>
        <span
          className={`h-116 w-116 rounded-full absolute z-50 border pulseGrow left-54 scale-80 md:scale-100`}
          style={{ animationDelay: `0.75s` }}
        ></span>
      </div>
      
      <span
        className={`h-[95%] aspect-2/5 rotate-y-50 border-2 border-blue absolute z-40 scale-55 -left-10 md:left-24 lg:-left-5 xl:left-12 2xl:left-22 rounded-xl lg:rounded-2xl ease-out duration-500 delay-350`}
      ></span>
      <span
        className={`h-[95%] aspect-2/5 rotate-y-50 border-2 border-blue absolute z-40 scale-65 md:left-36 lg:left-5 xl:left-20 2xl:left-32 rounded-2xl ease-out duration-500 delay-350`}
      ></span>
      <span
        className={`h-[95%] aspect-1/2 rotate-y-50 border-2 border-blue absolute z-40 scale-75 left-10 md:left-44 lg:left-14 xl:left-28 2xl:left-40 rounded-3xl ease-out duration-500 delay-350`}
      ></span>
      <span
        className={`h-[95%] aspect-1/2 rotate-y-50 border-2 border-blue absolute z-40 scale-85 left-24 md:left-56 lg:left-28 xl:left-40 2xl:left-52 rounded-3xl ease-out duration-500 delay-350`}
      ></span>
      <span
        className={`h-[95%] aspect-3/5 rotate-y-50 border-2 border-blue absolute z-60 scale-105 left-52 md:left-86 lg:left-60 xl:left-72 2xl:left-80 rounded-4xl ease-out duration-500 delay-350`}
      ></span>
      <span
        className={`h-[95%] aspect-3/5 rotate-y-50 border-2 border-blue absolute z-60 scale-120 left-70 md:left-110 lg:left-80 xl:left-90 2xl:left-100 rounded-4xl ease-out duration-500 delay-350`}
      ></span>

      <div className={`w-40 object-contain pt-5 object-center rounded-xl -mt-5 z-50 absolute left-48 md:left-78 lg:left-52 xl:left-1/2 xl:-translate-x-1/2 ease-out duration-100`}
      >
        <Image
          height={500}
          width={500}
          alt="ontap creatives cards"
          src="/images/ontapphone.png"
          className='w-full object-contain object-center rounded-lg'
          draggable={false}
        />
      </div>
    </div>
  )
}

export default OnTapAnimation