"use client"

import React, { JSX, useEffect, useState } from 'react'
import { About, AboutUs, AffiliateProgramPage, CartPage, ClientList, Cookies, FAQs, FillUpForm, Footer, Header, Hero, OrderPage, ProductList, Starting, VideoTutorial } from '.'
import { AnimatePresence, motion } from 'framer-motion'
import { BsQuestionLg } from 'react-icons/bs'
import { EditProps } from '@/types'

const Mainpage = ({ editable }: EditProps) => {
  const [page, setPage] = useState(0);
  const [endWarping, endWarpingNow] = useState(false);

  const [showCookies, setShowCookies] = useState(false);

  const SectionPage: Record<number, JSX.Element> = {
    1: <AffiliateProgramPage editable={editable}/>,
    2: <FAQs editable={editable}/>,
    3: <ProductList editable={editable}/>,
    4: <CartPage />,
    5: <AboutUs editable={editable}/>,
    6: <OrderPage orderID={''} customerName={''} items={[]} />
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const timer = setTimeout(() => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      endWarpingNow(true);
      setShowCookies(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-auto w-full flex flex-col items-center relative overflow-x-hidden'>
        <Header setPage={setPage}/>
          {page === 0 ? (
            <>
              <AnimatePresence mode='wait'>{!endWarping && (<Starting />)}</AnimatePresence>
              <Hero endWarping={endWarping} editable={editable}/>
              <About editable={editable}/>
              <VideoTutorial editable={editable}/>
              <FillUpForm />
              <ClientList editable={editable}/>
              <Footer setPage={setPage}/>
            </>
            ) : SectionPage[page]}
          {page !== 2 && page !== 3 && (
            <motion.button 
              type="button" 
              animate={{x:[20, 5, 20]}}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className={`fixed z-9999 right-0 top-3/4 flex items-center text-blue gap-2 md:text-lg font-bold bg-white p-1 md:p-1.5 pr-5 rounded-l-full shadow-md shadow-gray-700`}
              onClick={() => setPage(2)}
            >
              <span 
                className="h-8 w-8 md:h-10 md:w-10 bg-dark-blue rounded-full flex items-center justify-center text-xl md:text-3xl hover:scale-105 text-white ease-out duration-200"
              ><BsQuestionLg /></span>
              FAQs
            </motion.button>
          )}
          {showCookies && <AnimatePresence><Cookies setShowCookies={setShowCookies}/></AnimatePresence>}
    </div>
  )
}

export default Mainpage