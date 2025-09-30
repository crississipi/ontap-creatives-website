"use client";

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import { EditProps } from '@/types';
import { EditableText } from '.';

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

const VideoTutorial = ({editable}: EditProps) => {
  const { ref: videoTutorialRef, isInView: videoTutorialVisible } = useInView();

  return (
    <div ref={videoTutorialRef} className='h-auto w-full flex flex-col items-center gap-10 py-10 md:py-20 relative'>
        <Image
            height={1000}
            width={1000}
            alt='ontap creatives cards'
            src='/images/video-tutorial-bg.png'
            className='h-full w-full object-cover object-center absolute top-1/2 left-1/2 -translate-1/2'
            draggable={false}
        />
        {editable ? (
          <EditableText tag="h2" className='w-4/5 text-center text-3xl md:text-5xl z-20 text-white font-bold md:w-1/2 md:leading-12' type='textarea'>
            Watch the Video Tutorial on How to Use OnTap Business Card
          </EditableText>
        ) : (
          <h2 className='w-4/5 text-center text-3xl md:text-5xl z-20 text-white font-bold md:w-1/2 md:leading-12'>Watch the Video Tutorial on How to Use OnTap Business Card</h2>
        )}
        <motion.div
          className='w-full min-h-80 bg-gray-400 z-20 md:w-9/10 lg:w-1/2 aspect-video md:rounded-md'
          initial={{scale: 0.8}}
          animate={{scale: videoTutorialVisible ? 1 : 0.8}}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: 0.3
          }}
        >

        </motion.div>
    </div>
  );
};

export default VideoTutorial