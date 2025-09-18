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
    <div ref={section1Ref} className='scale-80 md:scale-100 h-full w-full flex relative perspective-distant items-center'>
        <div className={`w-48 md:w-54 absolute transform-3d ${section1Visible ? 'md:right-3/5 right-65/100' : 'right-2/10'} top-1/2 -translate-y-1/2 rounded-lg -rotate-z-90 overflow-hidden rotate-y-65 ease-out duration-500`}>
            <Image
                height={500}
                width={500}
                alt='ontap creatives cards'
                src='/images/card-cover.png'
                className='w-full object-contain object-center'
                draggable={false}
            />
        </div>
        <div className={`h-full ${section1Visible ? 'min-w-42 max-w-42' : 'min-w-0 max-w-0 overflow-hidden'} flex items-center relative ml-7 perspective-distant transform-3d ease-out duration-500`}>
            <span className='h-4 w-4 rounded-full absolute left-4 md:-left-5 pulseGrow scale-80 md:scale-100'></span>
            <span className='h-12 w-12 rounded-full absolute left-5 md:-left-4 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.05s" }}></span>
            <span className='h-20 w-20 rounded-full absolute left-6 md:-left-3 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.1s" }}></span>
            <span className='h-28 w-28 rounded-full absolute left-7 md:-left-2 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.1.5s" }}></span>
            <span className='h-36 w-36 rounded-full absolute left-8 md:-left-1 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.2s" }}></span>
            <span className='h-42 w-42 rounded-full absolute left-9 md:left-0 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.25s" }}></span>
            <span className='h-50 w-50 rounded-full absolute left-10 md:left-1 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.3s" }}></span>
            <span className='h-58 w-58 rounded-full absolute left-11 md:left-2 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.35s" }}></span>
            <span className='h-64 w-64 rounded-full absolute left-12 md:left-3 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.4s" }}></span>
            <span className='h-72 w-72 rounded-full absolute left-13 md:left-4 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.45s" }}></span>
            <span className='h-80 w-80 rounded-full absolute left-14 md:left-5 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.5s" }}></span>
            <span className='h-88 w-88 rounded-full absolute left-15 md:left-6 pulseGrow scale-80 md:scale-100' style={{ animationDelay: "0.55s" }}></span>
        </div>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute ${section1Visible ? 'md:left-9/10 md:scale-115 left-3/5 scale-115 z-60' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30 z-30'} rounded-4xl ease-out duration-500 delay-100`}></span>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute ${section1Visible ? 'md:left-5/7 md:scale-105 left-1/2 scale-105 z-60' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30 z-30'} rounded-4xl ease-out duration-500 delay-150`}></span>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute z-40 ${section1Visible ? 'md:left-1/3 md:scale-85 left-2/7 scale-85' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30'} rounded-4xl ease-out duration-500 delay-200`}>
        </span>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute z-40 ${section1Visible ? 'md:left-1/7 md:scale-75 left-1/6 scale-75' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30'} rounded-4xl ease-out duration-500 delay-250`}>
        </span>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute z-40 ${section1Visible ? 'left-1/20 md:-left-2 md:scale-65 scale-65' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30'} rounded-3xl ease-out duration-500 delay-300`}>
        </span>
        <span className={`h-full w-1/2 md:w-3/4 rotate-y-50 border-2 border-blue absolute z-40 ${section1Visible ? 'md:-left-1/5 md:scale-55 -left-5 scale-55' : 'left-1/2 -translate-x-1/2 md:scale-50 scale-30'} rounded-2xl ease-out duration-500 delay-350`}>
        </span>
        <Image
            height={500}
            width={500}
            alt='ontap creatives cards'
            src='/images/ontapphone.png'
            className={`w-32 md:w-40 object-contain pt-5 object-center rounded-lg -mt-5 z-50 ${section1Visible ? 'right-1/2' : 'mx-auto md:mx-0 right-0'} ease-out duration-75`}
            draggable={false}
        />
    </div>
  )
}

export default OnTapAnimation