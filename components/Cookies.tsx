"use client";

import React, { useEffect, useRef, useState } from 'react'
import { HiCheck } from 'react-icons/hi';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CookiesProps {
  setShowCookies: (cookies: boolean) => void;
}

const Cookies = ({ setShowCookies }: CookiesProps) => {
  const [enableEmail, setEnableEmail] = useState(false);
  const [email, setEmail] = useState('');
  const cookiesRef = useRef<HTMLDivElement>(null);

  const preventScroll = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (!cookiesRef.current) return;

    cookiesRef.current.scrollTo(0, 0);
    cookiesRef.current.addEventListener("wheel", preventScroll, { passive: false });
    cookiesRef.current.addEventListener("touchmove", preventScroll, { passive: false });
  }, []);

  function accepted() {
    if (!cookiesRef.current) return;

    if (enableEmail && email !== '') {
      cookiesRef.current.removeEventListener("wheel", preventScroll);
      cookiesRef.current.removeEventListener("touchmove", preventScroll);
      setShowCookies(false);
    } else if (!enableEmail) {
      cookiesRef.current.removeEventListener("wheel", preventScroll);
      cookiesRef.current.removeEventListener("touchmove", preventScroll);
      setShowCookies(false);
    }
  }
  
  return (
    <div 
      ref={cookiesRef} 
      className='h-full w-full fixed z-99999 bg-black/30 flex flex-col items-center pt-10 gap-5 select-none'
    >
        <motion.div 
          initial={{ y: -500 }}
          animate={{ y: 0 }}
          exit={{ y: -500 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
          className='h-auto w-1/3 rounded-lg bg-white overflow-hidden py-3 shadow-md shadow-black/50 flex flex-col gap-3'
        >
            <span className='max-h-20 w-full flex gap-3 items-center px-5'>
                <span className='h-16 aspect-square overflow-hidden'>
                    <Image
                    height={500}
                    width={500}
                    src='/icons/cookie.gif'
                    alt='cookie animation'
                    className='max-h-full w-20 object-center object-contain'
                    unoptimized
                    draggable={false}
                  />
                </span>
                <h1 className='text-xl'>Our website uses cookies</h1>
            </span>
            <p className='px-5'>We use cookies to enhance your browsing experience and analyze our traffic. This enables us to know where and how to improve our system to deliver better and more efficient service. By continuing to use our site, you consent to our use of cookies.</p>
            <div className='h-min flex flex-col gap-3 items-stretch rounded-lg border border-light-blue p-3 mx-5'>
              <div className='flex gap-3'>
                <button type='button' className='h-6 w-6 rounded-sm border border-blue items-center justify-center flex text-xl' onClick={() => setEnableEmail(!enableEmail)}>
                  {enableEmail && (<HiCheck />)}
                </button>
                <p>I want to receive latest news, offers, and promos.</p>
              </div>
              {enableEmail && (
                <span className='px-5 py-3 border-b border-light-blue items-stretch w-full'>
                  <input type="email" required={enableEmail} className='items-stretch w-full h-full outline-none' placeholder='Email Address' onChange={(e) => setEmail(e.currentTarget.value)} value={email}/>
                </span>
              )}
            </div>
            <div className='w-full flex mb-2 justify-end px-5'>
              <button 
                type="button" 
                className='w-1/3 py-3 px-5 text-left rounded-md bg-light-blue text-dark-blue font-semibold hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                onClick={accepted}
              >I Accept All Cookies</button>
            </div>
        </motion.div>
    </div>
  )
}

export default Cookies