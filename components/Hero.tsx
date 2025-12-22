"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const cardUrls = [
  {
    frontimg: "/images/card-1/front.png",
    backimg: "/images/card-1/back.png",
  },
  {
    frontimg: "/images/card-2/front.png",
    backimg: "/images/card-2/back.png",
  },
  {
    frontimg: "/images/card-3/front.png",
    backimg: "/images/card-3/back.png",
  },
  {
    frontimg: "/images/card-4/front-card.png",
    backimg: "/images/card-4/back-card.png",
  },
];

const heroDetails = [
  {
    name: "Interactive Design",
    text: "Impress your contacts with a modern and interactive layout.",
  },
  {
    name: "Contactless Sharing",
    text: "Simply tap and share your details effortlessly.",
  },
  {
    name: "Custom Branding",
    text: "Tailor the card to reflect your unique brand identity.",
  },
  {
    name: "Multi-platform Compatibility",
    text: "Access your digital card on various devices for seamless networking.",
  },

  {
    name: "Online Presence",
    text: "Enhancing digital visibility across diverse online platforms.",
  },
  {
    name: "Real-time Update",
    text: "Keep your contacts informed with instant update.",
  },
];

function useInView(threshold = 0.1) {
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

interface StartingProps {
  endWarping: boolean;
}

type HeroProps = StartingProps;

const Hero = ({ endWarping }: HeroProps) => {
  const [card, nextCard] = useState(0);
  const { ref: heroRef, isInView: heroVisible } = useInView();

  useEffect(() => {
    const interval = setInterval(() => {
      nextCard((prev) => (prev + 1) % cardUrls.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="h-auto min-h-dvh md:min-h-screen w-full relative flex flex-col select-none text-white pt-20 md:pt-10 items-center overflow-hidden"
    >
      <div className="z-30 flex flex-col items-center pt-5 w-full px-4">
        <motion.div
          initial={{ scale: 0, filter: "blur(2px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: endWarping ? 0 : 2.5,
          }}
          className="w-full flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl mt-5 md:mt-5 text-blue font-bold text-center">
            Smart Business Card
          </h1>
          <p className="mt-3 mb-3 text-sm md:text-lg font-light tracking-widest w-full md:w-max text-center">
            DIGITAL TREND. INNOVATIONS. SEAMLESS CONNECTIONS
          </p>
          <h2 className="text-sm md:text-base text-center px-3 mt-5 lg:text-2xl w-full md:w-4/5 lg:w-3/5 font-normal leading-relaxed">
            Turn every interaction into an opportunity for growth. Embrace the
            future of networking with our Digital Business Card - your key to a
            world of endless possibilities
          </h2>
        </motion.div>
        <div className="hidden md:grid md:grid-cols-2 lg:hidden md:my-10 md:gap-10 relative perspective-[1000px] w-full max-w-6xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 0 : 3,
            }}
            className="col-span-1 h-5/6 aspect-3/2 z-50 rounded-xl perspective-[1000px] mx-auto"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0 : 3,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  border-2 border-neutral-50 rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-neutral-100/50">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-1/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-1/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0 : 3,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md border-2 border-neutral-50 rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-1/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-1/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 0.5 : 3.2,
            }}
            className="col-span-1 h-5/6 aspect-3/2 z-50 rounded-xl perspective-[1000px] mx-auto"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0.5 : 3.2,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-2/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-2/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0.5 : 3.2,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5  before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-2/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-2/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 1 : 3.4,
            }}
            className="col-span-1 h-5/6 aspect-3/2 z-50 rounded-xl perspective-[1000px] mx-auto"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1 : 3.4,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-3/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-3/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1 : 3.4,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-3/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-3/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 1.5 : 3.6,
            }}
            className="col-span-1 h-5/6 aspect-3/2 z-50 rounded-xl perspective-[1000px] mx-auto relative"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1.5 : 3.6,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-4/back-card.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1.5 : 3.6,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-4/front-card.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="hidden h-70 w-9/10 lg:grid lg:grid-cols-4 md:my-18 relative perspective-[1000px]">
          <motion.div
            initial={{ scale: 0, x: 0, y: -200 }}
            animate={{ scale: 1, x: -750, y: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 0 : 3,
            }}
            className="absolute w-72 lg:w-64 aspect-3/2 top-1/2 -translate-1/2 left-1/2 z-50 rounded-xl perspective-[1000px] lg:ml-66 xl:ml-60 2xl:ml-24"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0 : 3,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-neutral-100/50">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-1/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-1/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0 : 3,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md border-2 border-neutral-50 rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-1/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-1/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 0, y: -200 }}
            animate={{ scale: 1, x: -250, y: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 0.5 : 3.2,
            }}
            className="absolute w-72 lg:w-64 aspect-3/2 top-1/2 -translate-1/2 left-1/2 z-50 rounded-xl perspective-[1000px] lg:ml-18 xl:ml-18 2xl:ml-8"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0.5 : 3.2,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-2/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-2/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 0.5 : 3.2,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5  before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-2/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-2/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 0, y: -200 }}
            animate={{ scale: 1, x: 250, y: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 1 : 3.4,
            }}
            className="absolute w-72 lg:w-64 aspect-3/2 top-1/2 -translate-1/2 left-1/2 z-50 rounded-xl perspective-[1000px] lg:-ml-30 xl:-ml-26 2xl:-ml-8"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1 : 3.4,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-3/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-3/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1 : 3.4,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-3/back.png"
                    alt="Back"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-3/front.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 0, y: -200 }}
            animate={{ scale: 1, x: 750, y: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              delay: endWarping ? 1.5 : 3.6,
            }}
            className="absolute w-72 lg:w-64 aspect-3/2 top-1/2 -translate-1/2 left-1/2 z-50 rounded-xl perspective-[1000px] lg:-ml-78 xl:-ml-70 2xl:-ml-24"
          >
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1.5 : 3.6,
              }}
              className="h-full w-full overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl before:h-full before:w-full before:absolute before:z-50 before:bg-black/20">
                <div className="absolute inset-0 rotate-y-180">
                  <Image
                    src="/images/card-4/back-card.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                rotateX: "180deg",
                rotateY: "-90deg",
                rotateZ: "-35deg",
              }}
              animate={{
                rotateX: "10deg",
                rotateY: "25deg",
                rotateZ: "-5deg",
              }}
              transition={{
                duration: 1,
                ease: "linear",
                delay: endWarping ? 1.5 : 3.6,
              }}
              className="h-full w-full rounded-xl absolute top-1/5 left-1/5 before:h-66/100 before:w-full before:absolute before:-z-20 before:top-5 before:-left-5 before:bg-black/30 before:rounded-tl-lg"
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card-4/front-card.png"
                    alt="Front"
                    fill
                    className="object-cover rounded-xl shadow-lg backface-hidden"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 4,
          }}
          className="md:hidden flex items-center justify-center h-max w-full overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {cardUrls.map(
              (val, i) =>
                i === card && (
                  <motion.div
                    key={i}
                    className="h-80 w-full flex items-center justify-center relative"
                    initial={{ x: 999 }}
                    animate={{ x: 0 }}
                    exit={{ x: -999 }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                    }}
                  >
                    <div className="absolute w-3/5 aspect-3/2 top-1/2 mt-10 -translate-1/2 left-1/2 z-50 rounded-xl perspective-[1000px]">
                      <motion.div
                        initial={{
                          rotateZ: "0deg",
                          top: "0px",
                        }}
                        animate={{
                          rotateZ: "20deg",
                          top: "-15px",
                        }}
                        exit={{
                          rotateZ: "0deg",
                          top: "0px",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                          delay: 0.9,
                        }}
                        className="h-full w-full rounded-xl absolute top-0"
                      >
                        <div className="relative w-full h-full transition-transform duration-700 transform-3d  rounded-2xl">
                          <div className="absolute inset-0 rotate-y-180">
                            <Image
                              src={val.frontimg}
                              alt="Front"
                              fill
                              className="object-cover rounded-xl shadow-lg backface-hidden"
                              draggable={false}
                            />
                          </div>
                          {val.frontimg !== "/images/card-4/front-card.png" && (
                            <div className="absolute inset-0">
                              <Image
                                src={val.backimg}
                                alt="Back"
                                fill
                                className="object-cover rounded-xl shadow-lg backface-hidden"
                                draggable={false}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{
                          rotateX: "0deg",
                          rotateY: "0deg",
                          rotateZ: "0deg",
                          top: "0px",
                          left: "0px",
                        }}
                        animate={{
                          rotateX: "40deg",
                          rotateY: "5deg",
                          rotateZ: "-20deg",
                          top: "-120px",
                          left: "20px",
                        }}
                        exit={{
                          rotateX: "0deg",
                          rotateY: "0deg",
                          rotateZ: "0deg",
                          top: "0px",
                          left: "0px",
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                          delay: 0.7,
                        }}
                        className="h-full w-full rounded-xl absolute"
                      >
                        <motion.span
                          initial={{
                            rotateX: "0deg",
                            rotateY: "0deg",
                            rotateZ: "0deg",
                            top: "0px",
                            left: "0px",
                          }}
                          animate={{
                            rotateX: "5deg",
                            rotateY: "-50deg",
                            rotateZ: "-15deg",
                            top: "68px",
                            left: "-20px",
                          }}
                          exit={{
                            rotateX: "0deg",
                            rotateY: "0deg",
                            rotateZ: "0deg",
                            top: "0px",
                            left: "0px",
                          }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                            delay: 0.7,
                          }}
                          className="h-2/3 w-66/100 absolute -z-20 top-0 left-0 bg-black/20 rounded-xl ease-linear"
                        ></motion.span>
                        <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                          {val.frontimg !== "/images/card-4/front-card.png" && (
                            <div className="absolute inset-0 rotate-y-180">
                              <Image
                                src={val.backimg}
                                alt="Back"
                                fill
                                className="object-cover rounded-xl shadow-lg backface-hidden"
                                draggable={false}
                              />
                            </div>
                          )}
                          <div className="absolute inset-0">
                            <Image
                              src={val.frontimg}
                              alt="Front"
                              fill
                              className="object-cover rounded-xl shadow-lg backface-hidden"
                              draggable={false}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 4,
          }}
          className="md:hidden flex w-full items-center justify-center gap-1 mt-5"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`${
                i === card ? "scale-150 mx-1 bg-white" : "scale-100 bg-white/50"
              } h-2 w-2 rounded-full ease-in-out duration-200`}
            ></span>
          ))}
        </motion.div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-3 lg:gap-5 px-5 pt-5">
          {heroDetails.map((details, i) => (
            <motion.span
              key={i}
              className="flex flex-col gap-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs"
              initial={{ filter: "blur(10px)", scale: 0 }}
              animate={{
                filter: heroVisible ? "blur(0px)" : "blur(10px)",
                scale: heroVisible ? 1 : 0.7,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: endWarping ? i / 4 : 3 + i / 4,
              }}
            >
              <h3 className="text-blue text-lg">{details.name}</h3>
              <p className="leading-5 text-base">{details.text}</p>
            </motion.span>
          ))}
        </div>
      </div>
      <motion.a
        initial={{ y: 50, backgroundPosition: "0% 50%" }}
        animate={{
          y: 0,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: endWarping ? 0 : 7,
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: endWarping ? 0.5 : 7.5,
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        whileTap={{
          scale: 0.98,
          transition: {
            duration: 0.1,
          },
        }}
        href="https://portal.ontap.ph/login"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb, #3b82f6, #60a5fa)",
          backgroundSize: "200% 100%",
        }}
        className="mt-auto py-3 px-12 mb-0.5 text-nowrap w-min rounded-xl shadow-lg z-20 text-white font-semibold text-lg tracking-wider hover:brightness-110 focus:brightness-110 ease-out duration-200"
      >
        LOGIN
      </motion.a>
    </div>
  );
};

export default Hero;
