import React, { useEffect } from 'react'
import Image from 'next/image'

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // jump to top on mount
  }, []);
  
  return (
    <section className='h-[100vh] md:h-auto w-full flex flex-col gap-5 text-dark-blue py-16'>
        <div className='md:min-h-[100vh] h-64 w-full flex items-center justify-center relative'>
        <h1 className='z-20 md:text-9xl text-3xl tracking-wider text-white font-bold'>ABOUT US!</h1>
            <Image
                height={4096}
                width={4096}
                alt='affiliate page background'
                src='/images/about-us-bg.png'
                className='h-full w-full object-cover object-center absolute left-0'
            />
        </div>
        <h2 className='px-5 md:text-2xl md:px-20 md:mt-10'>At ONTAP CREATIVES INC., we believe first impressions last. In this digital age, we understand that business introduction often occur online before they happen face-to-face.</h2>
        <h3 className='px-5 md:text-2xl md:px-20'>That's why we've dedicated ourselves to revolutionizing the way professionals present themselves in the virtual world.</h3>
        <div className='h-32 md:h-72 w-full flex items-center justify-center my-10'>
            <Image
                height={1024}
                width={1024}
                alt='affiliate page background'
                src='/images/ontap-logo.png'
                className='h-16 md:h-24 w-full object-contain object-center'
            />
        </div>
    </section>
  );
};

export default AboutUs