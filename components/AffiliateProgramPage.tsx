"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AffiliateApplicationForm from "./AffiliateApplicationForm";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

const AffiliateProgramPage = () => {
  const { ref: section1Ref, isInView: section1Visible } = useInView();
  const { ref: section2Ref, isInView: section2Visible } = useInView();
  const { ref: section3Ref, isInView: section3Visible } = useInView();

  return (
    <div className="h-auto w-full flex flex-col">
      <div
        ref={section1Ref}
        className="h-full md:h-screen w-full relative flex items-center pl-5 py-10 md:py-0 overflow-hidden bg-linear-to-tr from-violet via-dark-blue to-blue"
      >
        <Image
          height={4096}
          width={4096}
          alt="affiliate page background"
          src="/images/affiliate-bg.png"
          className="h-full w-full object-cover object-center absolute top-1/2 left-1/2 -translate-1/2"
          draggable={false}
        />
        <motion.span
          className="z-20 text-white flex flex-col w-2/3 md:w-1/2 gap-5 mt-16"
          initial={{ x: "-150%" }}
          animate={section1Visible ? { x: "0%" } : {}}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.3,
          }}
        >
          <h1
            className="text-4xl font-bold uppercase 
                        md:text-7xl 
                        lg:pl-20"
          >
            Affiliate Program
          </h1>
          <p
            className="text-lg leading-6 lg:pl-20 
                        md:text-2xl md:leading-normal"
          >
            We are excited to present our Affiliate Program for cutting-edge
            Smart Business Card. This program is designed to create a mutually
            beneficial partnership, allowing reseller to Tap into a growing
            market and offer innovative smart business card service to their
            clients.
          </p>
        </motion.span>
        <div className="h-2/3 aspect-square top-1/2 mt-4 -ml-7 md:mt-6 md:-ml-3 left-4/7 lg:left-1/2 lg:ml-0 2xl:ml-32 absolute -translate-y-1/2 flex items-center justify-center perspective-distant">
          <span
            className="h-16 w-16 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.5s" }}
          ></span>
          <span
            className="h-24 w-24 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.55s" }}
          ></span>
          <span
            className="h-32 w-32 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.6s" }}
          ></span>
          <span
            className="h-40 w-40 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.65s" }}
          ></span>
          <span
            className="h-48 w-48 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.7s" }}
          ></span>
          <span
            className="h-56 w-56 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.75s" }}
          ></span>
          <span
            className="h-64 w-64 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect"
            style={{ animationDelay: "0.8s" }}
          ></span>
        </div>
        <motion.span
          ref={section3Ref}
          initial={{ marginTop: "100px", scale: 1.1 }}
          animate={{
            marginTop: section3Visible ? "50px" : "100px",
            scale: section3Visible ? 1 : 1.5,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.3,
          }}
          className="w-60 lg:w-80 aspect-square scale-275 md:scale-350 -ml-10 absolute left-3/4 top-5/6 md:left-5/6 md:ml-0 md:top-3/4 lg:left-7/10 lg:top-[93%] lg:-translate-y-1/3"
        >
          <Image
            height={4096}
            width={4096}
            alt="affiliate page background"
            src="/images/hand.png"
            className="h-full w-full z-40 object-contain object-center"
            draggable={false}
          />
        </motion.span>
      </div>

      <div ref={section2Ref} className="min-h-screen lg:h-dvh w-full z-10">
        <AffiliateApplicationForm />
      </div>
    </div>
  );
};

export default AffiliateProgramPage;
