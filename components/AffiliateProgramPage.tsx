"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion';


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
    <div className='h-auto w-full flex flex-col'>
        <div ref={section1Ref} className='h-full md:h-[100vh] w-full relative flex items-center pl-5 py-10 md:py-0 overflow-hidden'>
            <Image
                height={4096}
                width={4096}
                alt='affiliate page background'
                src='/images/affiliate-bg.png'
                className='h-full w-full object-cover object-center absolute top-1/2 left-1/2 -translate-1/2'
            />
            <motion.span 
                className='z-20 text-white flex flex-col w-2/3 md:w-1/2 gap-5 mt-16'
                initial={{ x: '-150%' }}
                animate={section1Visible ? { x: '0%' } : {}}
                transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    delay: 0.3
                }}
            >
                <h1 className='text-4xl md:text-7xl md:pl-20 font-bold uppercase'>Affiliate Program</h1>
                <p className='text-lg leading-6 md:pl-20 md:text-2xl md:leading-normal'>We are excited to present our Affiliate Program for cutting-edge Smart Business Card. This program is designed to create a mutually beneficial partnership, allowing reseller to Tap into a growing market and offer innovative smart business card service to their clients.</p>
            </motion.span>
            <div className='h-2/3 aspect-square top-1/2 mt-6 -ml-3 left-4/7 absolute -translate-y-1/2 flex items-center justify-center perspective-distant'>
                <span className='h-16 w-16 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.5s" }}></span>
                <span className='h-24 w-24 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.55s" }}></span>
                <span className='h-32 w-32 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.6s" }}></span>
                <span className='h-40 w-40 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.65s" }}></span>
                <span className='h-48 w-48 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.7s" }}></span>
                <span className='h-56 w-56 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.75s" }}></span>
                <span className='h-64 w-64 rounded-full absolute top-1/2 left-1/2 -translate-1/2 waterEffect' style={{ animationDelay: "0.8s" }}></span>
            </div>
            <motion.span 
                ref={section3Ref}
                initial={{marginTop: '100px', scale: 1.1}}
                animate={{marginTop: section3Visible ? '50px' : '100px', scale: section3Visible ?  1 : 1.5}}
                transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.3
                }}
                className='w-60 md:w-80 aspect-square scale-275 -ml-5 md:-ml-20 left-3/4 md:left-5/7 top-5/6 md:top-6/7 absolute md:-translate-y-1/3'
            >
                <Image
                    height={4096}
                    width={4096}
                    alt='affiliate page background'
                    src='/images/hand.png'
                    className='h-full w-full z-40 object-contain object-center'
                />
            </motion.span>
        </div>
        <div ref={section2Ref} className='h-max w-full flex flex-col items-center py-10 z-10 md:py-20'>
            <motion.h2 
                className='text-3xl font-bold text-dark-blue pb-10 w-full text-center md:text-4xl'
                initial={{y: '150%'}}
                animate={{y: section2Visible ? '0%' : '150%'}}
                transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    delay: 0.3
                }}
            >How to Apply for OnTap's <span className='text-blue'>Affiliate Program?</span></motion.h2>
            <span className='-z-10 py-10 border-t-2 border-dark-blue w-9/10 text-center text-dark-blue flex flex-col'>
                <h3 className='mb-10 font-bold md:text-xl' >To know more of our Affiliate Program, please get in touch with us for further information.</h3>
                <h4 className='text-black text-2xl font-bold mb-5 md:text-3xl'>SALES TEAM</h4>
                <p className='font-bold text-xl md:text-2xl'>+63 9177008364</p>
                <p className='font-bold text-xl md:text-2xl'>+63 9764183188</p>
                <p className='font-bold text-xl mb-10 md:text-2xl'>+63 9764183189</p>
                <p className='text-blue mb-5 md:text-xl'>Click/Download the application form here.</p>
                <h5 className='mb-3 font-bold md:text-lg'>Kindly send your application to our email</h5>
                <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='font-bold md:text-lg'
                >ontapcreatives@gmail.com</a>
            </span>
        </div>
        <div className='h-max md:h-[100vh] w-full flex flex-col relative px-10 py-5 md:overflow-hidden'>
            <Image
                height={4096}
                width={4096}
                alt='affiliate page background'
                src='/images/join-team-bg.png'
                className='h-full md:h-auto w-full object-cover md:object-contain object-center absolute top-1/2 left-1/2 -translate-1/2'
            />
            <h2 className='z-10 w-full text-3xl font-bold text-dark-blue text-center md:text-7xl md:mt-10'>JOIN OUR TEAM</h2>
            <h3 className='z-10 md:my-auto text-2xl ml-32 md:mx-auto my-14 font-bold text-dark-blue md:leading-18 md:text-6xl md:w-1/3'>BECOME AN AFFILIATE MEMBER TODAY</h3>
        </div>
    </div>
  );
};

export default AffiliateProgramPage