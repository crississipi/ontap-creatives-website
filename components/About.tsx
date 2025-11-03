"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OnTapAnimation from './OnTapAnimation';
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

const About = ({editable}: EditProps) => {
  const { ref: section1Ref, isInView: section1Visible } = useInView();
  const { ref: section2Ref, isInView: section2Visible } = useInView();
  const { ref: section3Ref, isInView: section3Visible } = useInView();

  return (
    <div ref={section1Ref} className='h-auto w-full xl:w-[90%] bg-white px-5 md:px-10 flex flex-col py-16 font-bold gap-10 md:gap-20 items-center'>
        <div className='w-full flex flex-col gap-3 mr-auto'>
            {editable ? (
                <>
                    <EditableText tag="h2" className="text-2xl md:text-3xl" type='input'>
                        Elevate your networking game with our cutting-edge Smart Business Card
                    </EditableText>
                </>
            ) : (
                <motion.h2 
                    initial={{ x: "150%" }}
                    animate={{ x: section1Visible ? "0%" : "150%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className='text-2xl md:text-3xl xl:text-4xl'
                >
                    <span className='text-dark-blue'>Elevate </span> 
                    your networking game with our cutting-edge 
                    <span className='text-dark-blue'> Smart Business Card</span>
                </motion.h2>
            )}
            {editable ? (
                <>
                    <EditableText tag="p" className="text-md text-justify md:text-lg resize-none h-48" type='textarea'>
                        A smart business card is a game-changer in the digital era, revolutionizing the way we network and connect. This cutting-edge innovation seamlessly combines technology and connectivity to make you stand out from the crowd, It allows you to showcase your creativity and uniqueness, setting you apart from the competition. By effortlessly sharing your contact information, social media profiles, and portfolio with a simple tap or scan, you can effortlessly expand your network and foster meaningful relationships. These connections can open doors to new opportunities and collaborations, bringing success to your professional endeavors. In this rapidly evolving world, a smart business card is an essential tool for any ambitious individual looking to thrive in the digital landscape.
                    </EditableText>
                </>
            ) : (
                <motion.p
                    initial={{ x: "-150%" }}
                    animate={{ x: section1Visible ? "0%" : "-150%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className='text-md text-justify lg:text-lg xl:text-2xl xl:font-light'
                >
                    A smart business card is a game-changer in the digital era, revolutionizing the way we network and connect. This cutting-edge innovation seamlessly combines technology and connectivity to make you stand out from the crowd, It allows you to showcase your creativity and uniqueness, setting you apart from the competition. By effortlessly sharing your contact information, social media profiles, and portfolio with a simple tap or scan, you can effortlessly expand your network and foster meaningful relationships. These connections can open doors to new opportunities and collaborations, bringing success to your professional endeavors. In this rapidly evolving world, a smart business card is an essential tool for any ambitious individual looking to thrive in the digital landscape.
                </motion.p>
            )}
            
        </div>
        <div ref={section2Ref} className='h-auto w-4/5 md:w-full flex flex-col md:flex-row md:gap-5 xl:gap-20 items-center'>
            <OnTapAnimation />
            <motion.div 
                className='w-auto md:w-full flex flex-col gap-3 lg:ml-32'
                initial={{ x: "250%" }}
                animate={{ x: section2Visible ? "0%" : "250%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {editable ? (
                    <>
                        <EditableText tag="h3" className="text-3xl md:text-5xl" type='input'>
                            Why Choose OnTap Business card?
                        </EditableText>
                        <EditableText tag="p" className="text-base text-justify md:text-lg h-40 w-full" type='textarea'>
                            Smart business cards are a valuable tool for professionals looking to make a lasting impression. With their sleek design and innovative features, you are embracing technology, efficiency, and sustainability, all while making a memorable impact in the business world.
                        </EditableText>
                    </>
                ) : (
                    <>
                        <h3 className='text-3xl md:text-5xl'>Why Choose <span className='text-dark-blue'>OnTap Business card?</span></h3>
                        <p className='text-base text-justify md:text-lg xl:text-2xl xl:font-light'>Smart business cards are a valuable tool for professionals looking to make a lasting impression. With their sleek design and innovative features, you are embracing technology, efficiency, and sustainability, all while making a memorable impact in the business world.</p>
                    </>
                )}
                
            </motion.div> 
        </div>
        <div ref={section3Ref} className='w-full flex flex-col md:flex-row gap-10 md:gap-20 xl:gap-10 2xl:gap-20'>
            <motion.div 
                initial={{ x: "-150%" }}
                animate={{ x: section3Visible ? "0%" : "-150%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className='flex flex-col gap-3 md:gap-5 xl:flex-row h-full w-4/5 md:w-full xl:w-full items-center mx-auto'
            >
                <Image
                    height={500}
                    width={500}
                    alt='ontap creatives cards'
                    src='/images/about-img-1.png'
                    className='lg:min-h-64 md:h-auto w-3/4 lg:w-4/5 lg:h-full xl:w-1/2 2xl:w-1/3 object-cover pt-5 object-center -mt-3'
                    draggable={false}
                />
                <span className='h-full md:py-5'>
                    {editable ? (
                    <>
                        <EditableText tag="h4" className="text-dark-blue text-xl" type='input'>
                            Grow your Sphere of Influence
                        </EditableText>
                        <EditableText tag="p" className="text-base text-justify md:text-lg h-40 w-full" type='textarea'>
                            Your network is your net worth. Utilize our digital business card to connect with like-minded individuals, industry leaders, and potential collaborators. Cultivate relationships that drive success and propel your career forward.
                        </EditableText>
                    </>
                    ) : (
                    <>
                        <h4 className='text-dark-blue text-xl md:text-2xl xl:text-4xl'>Grow your Sphere of Influence</h4>
                        <p className='text-base text-justify md:text-lg xl:text-2xl xl:font-light'>Your network is your net worth. Utilize our digital business card to connect with like-minded individuals, industry leaders, and potential collaborators. Cultivate relationships that drive success and propel your career forward.</p>
                    </>
                    )}
                    
                </span>
            </motion.div>
            <motion.div 
                initial={{ x: "150%" }}
                animate={{ x: section3Visible ? "0%" : "150%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className='flex flex-col gap-3 md:gap-5 xl:flex-row h-full w-4/5 md:w-full xl:w-full items-center mx-auto'
            >
                <Image
                    height={500}
                    width={500}
                    alt='ontap creatives cards'
                    src='/images/about-img-2.png'
                    className='lg:min-h-64 md:h-auto w-3/4 lg:w-4/5 lg:h-full xl:w-1/2 2xl:w-1/3 object-cover pt-5 object-center -mt-3'
                    draggable={false}
                />
                <span className='h-full md:py-5'>
                    {editable ? (
                    <>
                        <EditableText tag="h4" className="text-dark-blue text-xl md:text-2xl" type='input'>
                            Seamless Connectivity
                        </EditableText>
                        <EditableText tag="p" className="text-base text-justify md:text-lg h-40 w-full" type='textarea'>
                            Stay linked effortlessly! Share your digital business card instantly, allowing contacts to access your professional profile, social media, and contact details with a simple click. The power of connection is just a tap away.
                        </EditableText>
                    </>
                    ) : (
                    <>
                        <h4 className='text-dark-blue text-xl md:text-2xl xl:text-4xl'>Seamless Connectivity</h4>
                        <p className='text-base text-justify md:text-lg xl:text-2xl xl:font-light'>Stay linked effortlessly! Share your digital business card instantly, allowing contacts to access your professional profile, social media, and contact details with a simple click. The power of connection is just a tap away.</p>
                    </>
                    )}
                    
                </span>
            </motion.div>
        </div>
        
    </div>
  );
};

export default About