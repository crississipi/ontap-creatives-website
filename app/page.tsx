"use client";

import { About, AboutUs, ClientList, Cookies, FAQs, FillUpForm, Footer, Header, Hero, PopUp, ProductList, Starting, VideoTutorial } from "@/components";
import { Page } from "@/components/admin";
import AffiliateProgramPage from "@/components/AffiliateProgramPage";
import { AnimatePresence, motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import { BsQuestionLg } from "react-icons/bs";

export default function Home() {
  const [page, setPage] = useState(0);
  const [endWarping, endWarpingNow] = useState(false);

  const [showCookies, setShowCookies] = useState(false);
  const [adminLogin, showAdminLogin] = useState(false);

  const SectionPage: Record<number, JSX.Element> = {
    1: <AffiliateProgramPage />,
    2: <FAQs />,
    3: <ProductList />,
    5: <AboutUs />
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        showAdminLogin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className='min-h-[100vh] h-auto w-full flex flex-col items-center relative overflow-x-hidden p-0 m-0 select-none'>
      {adminLogin ? (<Page />) : (
      <>
        <Header setPage={setPage}/>
          {page === 0 ? (
            <>
              <AnimatePresence mode='wait'>{!endWarping && (<Starting/>)}</AnimatePresence>
              <Hero endWarping={endWarping}/>
              <About />
              <VideoTutorial />
              <FillUpForm />
              <ClientList />
              <Footer setPage={setPage}/>
            </>
            ) : SectionPage[page]}
          {page !== 2 && (
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
      </>
    )}
    </main>
    
  );
}
