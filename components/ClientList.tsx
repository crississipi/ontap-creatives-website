"use client";

import React, { useState, useEffect} from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const logos = Array.from(
  { length: 15 },
  (_, i) => `/images/client-logos/sponsor-${i + 1}.png`
);

const BATCH_SIZE = 5;
const DISPLAY_DURATION = 3000; // 3 seconds visible
const TRANSITION_DURATION = 1000; // Time for entrance/exit sequences roughly

const ClientList = () => {
  const [batchIndex, setBatchIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatchIndex((prev) => (prev + 1) % Math.ceil(logos.length / BATCH_SIZE));
    }, DISPLAY_DURATION + TRANSITION_DURATION * 2); // Adjust timing as needed

    return () => clearInterval(interval);
  }, []);

  const currentLogos = logos.slice(
    batchIndex * BATCH_SIZE,
    (batchIndex + 1) * BATCH_SIZE
  );

  // If last batch is smaller, we might want to pad it or just show fewer. 
  // Since 15 / 5 = 3, it's exact.

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
        when: "afterChildren" 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(10px)", 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)", 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeInOut
      }
    },
    exit: { 
      opacity: 0, 
      filter: "blur(10px)", 
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.4,
        ease: easeInOut
      }
    }
  };

  return (
    <div className="relative h-max w-full overflow-hidden flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
            <motion.div
                key={batchIndex}
                className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {currentLogos.map((src, i) => (
                    <motion.div
                        key={`${batchIndex}-${i}`} // Unique key for each item instance
                        variants={itemVariants}
                        className="h-20 w-32 flex items-center justify-center"
                    >
                        <Image
                            height={100}
                            width={120}
                            alt={`Client Logo`}
                            src={src}
                            className="h-full w-full object-contain object-center"
                            draggable={false}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default ClientList;
