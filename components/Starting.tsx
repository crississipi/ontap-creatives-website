import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Starting = () => {
  return (
    <motion.div 
        exit={{opacity: 0}}
        transition={{
            duration: 0.7,
            ease: 'linear'
        }}
        className="fixed w-[100vw] h-[100vh] z-40 top-0 left-0 bg-transparent overflow-hidden flex items-center justify-center"
    >
        <motion.div
            initial={{x: 0, scale: 1}}
            animate={{x:-1800, scale:2}}
            transition={{
                duration: 1,
                ease: 'linear',
                delay: 2
            }}
            className='absolute scale-110 md:scale-100 w-full md:w-2/3 aspect-square top-2/5 md:top-2/3 md:-translate-y-1/3 z-30 md:left-0 md:right-auto right-1/4'
        >
            <motion.div 
                initial={{x:-999, y: -999}}
                animate={{x: 0, y: 0}}
                transition={{
                    duration: 1,
                    ease: 'easeOut',
                    delay: 0.7
                }}
                className='w-full h-full'
            >
                <Image
                    height={2048}
                    width={2048}
                    alt='animate hand image'
                    src='/images/animate-hand-1.png'
                    className='object-contain object-center'
                    draggable={false}
                />
            </motion.div>
        </motion.div>
        <motion.div
            initial={{x: 0, scale: 1}}
            animate={{x:1800, scale:2}}
            transition={{
                duration: 1,
                ease: 'linear',
                delay: 2
            }}
            className='absolute scale-105 md:scale-100 w-full md:w-2/3 aspect-square top-2/5 md:top-2/3 md:-translate-y-1/3 z-20 left-1/3 md:left-2/5'
        >
            <motion.div 
                initial={{x:999, y: 999}}
                animate={{x: 0, y: 0}}
                transition={{
                    duration: 1,
                    ease: 'easeOut',
                }}
                className='w-full h-full'
            >
                <Image
                    height={2048}
                    width={2048}
                    alt='animate hand image'
                    src='/images/animate-hand-2.png'
                    className='object-contain object-center'
                    draggable={false}
                />
            </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default Starting