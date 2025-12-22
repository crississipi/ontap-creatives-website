"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OnTapAnimation from './OnTapAnimation';

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

const About = () => {
  const { ref: section1Ref, isInView: section1Visible } = useInView();
  const { ref: section2Ref, isInView: section2Visible } = useInView();

  return (
    <div ref={section1Ref} className='my-20 min-h-[85vh] h-max lg:h-[85vh] w-full xl:w-full z-99 shadow-2xl bg-white flex flex-col lg:flex-row px-5 md:px-12 py-10 md:py-12 gap-8 lg:gap-12 overflow-hidden relative'>
                    <Image
                height={4096}
                width={4096}
                alt="ontap creatives logo"
                src='/images/waves.png'
                className='absolute w-full md:w-3/5 2xl:w-1/2 h-max z-1 left-0 bottom-0 -mb-48 2xl:top-1/2 object-contain'
            />
        <div className='h-full w-full lg:w-1/2 flex flex-col gap-6 relative'>
            <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: section1Visible ? 1 : 0, x: section1Visible ? 0 : -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='text-2xl md:text-4xl xl:text-5xl font-bold leading-tight z-10 text-dark-blue'
            >
                <span className='text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>Elevate</span> Your Networking with{' '}
                <span className='text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>Smart Business Cards</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: section1Visible ? 1 : 0, x: section1Visible ? 0 : -50 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className='text-base md:text-lg xl:text-xl font-normal text-gray-700 leading-relaxed z-10'
            >
                Transform how you connect in the digital era. Share your contact info, social profiles, and portfolio instantly with a simple tap. Stand out, build meaningful relationships, and unlock new opportunities effortlessly.
            </motion.p>
            <motion.div 
                className='flex flex-col gap-4 mt-4 z-10'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: section1Visible ? 1 : 0, y: section1Visible ? 0 : 30 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
                <h3 className='text-2xl md:text-3xl xl:text-4xl font-bold text-dark-blue'>
                    Why Choose <span className='text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>OnTap?</span>
                </h3>
                <p className='text-base md:text-lg xl:text-xl font-normal text-gray-700 leading-relaxed'>
                    Sleek design meets innovative technology. Embrace efficiency, sustainability, and make a lasting impression that sets you apart.
                </p>
            </motion.div> 
        </div>
        <div ref={section2Ref} className='w-full lg:w-1/2 h-full relative flex items-center justify-end'>
            <OnTapAnimation />
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: section2Visible ? 1 : 0, y: section2Visible ? 0 : 30 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                className='absolute left-0 bottom-0 -mb-5 w-max md:w-[75%] lg:w-[70%] z-50 bg-light-blue/10 backdrop-blur-xs rounded-2xl border border-blue/50 p-3 lg:p-4 shadow-md'
            >
                <h4 className='text-base md:text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>Expand Your Network</h4>
                <p className='text-sm md:text-base font-normal text-gray-700 leading-snug'>
                    Connect with industry leaders and collaborators. <span className='hidden lg:block'> Your network is your net worth, grow it strategically.</span>
                </p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: section2Visible ? 1 : 0, y: section2Visible ? 0 : -30 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                className='absolute right-0 top-0 -mt-5 w-max md:w-[75%] lg:w-[70%] bg-violet/10 backdrop-blur-xs rounded-2xl border border-violet/50 p-3 lg:p-4 shadow-md'
            >
                <h4 className='text-base md:text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>Instant Connectivity</h4>
                <p className='text-sm md:text-base font-normal text-gray-700 leading-snug'>
                    Share your digital card instantly. <span className='hidden lg:block'>One tap gives contacts access to your profile, socials, and details.</span>
                </p>
            </motion.div>
        </div>
    </div>
  );
};

export default About