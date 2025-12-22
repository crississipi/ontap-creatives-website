"use client"

import React, { JSX, useEffect, useState } from 'react'
import { About, AboutUs, AffiliateProgramPage, CartPage, ClientList, FAQs, FillUpForm, Footer, Header, Hero, OrderPage, PrivacyPolicy, ProductList, Starting, TermsConditions, UserProfile, VideoTutorial } from '.'
import { AnimatePresence, motion } from 'framer-motion'
import { BsQuestionLg } from 'react-icons/bs'
import Funnel from './Funnel'
import MobileSidebar from './MobileSidebar'
import AccountSignIn from './AccountSignIn'

const Mainpage = () => {
  const [page, setPage] = useState(0);
  const [endWarping, endWarpingNow] = useState(false);
  const [showNav, isNavShown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const SectionPage: Record<number, JSX.Element> = {
    1: <AffiliateProgramPage />,
    2: <FAQs />,
    3: <ProductList />,
    4: <CartPage />,
    5: <AboutUs />,
    6: <OrderPage />,
    7: <PrivacyPolicy/>,
    8: <TermsConditions />,
    9: <UserProfile />
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  return (
    <div className='h-auto w-full flex flex-col items-center relative overflow-x-hidden'>
        <Header 
          setPage={setPage} 
          showNav={showNav} 
          isNavShown={isNavShown}
          setShowLogin={setShowLogin}
        />
        <MobileSidebar 
          showNav={showNav} 
          isNavShown={isNavShown} 
          setPage={setPage}
          setShowLogin={setShowLogin}
        />
        <Funnel />
          {page === 0 ? (
            <>
              <AnimatePresence mode='wait'>{!endWarping && (<Starting />)}</AnimatePresence>
              <Hero endWarping={endWarping} />
              <About />
              <VideoTutorial />
              <FillUpForm />
              <Footer setPage={setPage}/>
            </>
            ) : SectionPage[page]}
          {page !== 2 && page !== 3 && page !== 6 && (
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
        
        {/* Login Modal */}
        {showLogin && (
          <AccountSignIn 
            setShowLogin={setShowLogin} 
            onSuccess={handleLoginSuccess}
          />
        )}
    </div>
  )
}

export default Mainpage