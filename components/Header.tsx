"use client"

import React, { useState } from 'react'
import Image from "next/image";
import { BsFillCaretRightFill } from 'react-icons/bs';
import { HiBell, HiOutlineMenuAlt3 } from 'react-icons/hi';
import { HeaderProps } from '@/types';
import { RiBox3Line, RiHome5Line, RiLogoutBoxLine, RiLogoutBoxRLine, RiPlanetLine, RiShoppingBasket2Line, RiShoppingCart2Line, RiUser5Fill, RiUserCommunityLine } from 'react-icons/ri';
import { useClickOutside } from '@/hooks';
import { TiUser } from 'react-icons/ti';
import { useUser } from '@/contexts/UserContext';
import AccountSignIn from './AccountSignIn';
import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';

const Header = ({ setPage }: HeaderProps) => {
  const [showNav, isNavShown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout, loading } = useUser();

  const clickRef = useClickOutside<HTMLDivElement>(() => isNavShown(false), showNav)

  const outsideClickRef = useClickOutside<HTMLDivElement>(() => setShowMoreOptions(false), showMoreOptions);
  
  const handleLogout = async () => {
    await logout();
    setShowMoreOptions(false);
    isNavShown(false);
    setPage(0); // Redirect to home
  };

  const handleProtectedAction = (pageNumber: number) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setPage(pageNumber);
    setShowMoreOptions(false);
    isNavShown(false);
  };

  // Add this function to handle successful login
  const handleLoginSuccess = () => {
    setShowLogin(false);
    // The UserContext will automatically update and trigger re-render
  };

  if (loading) {
    return (
      <div className='h-16 w-full bg-white flex fixed top-0 font-semibold z-9999 items-center left-0'>
        <div className='w-full flex justify-center'>
          <div className='animate-pulse'>
            <Image
              height={2048}
              width={2048}
              alt='animated logo'
              src='/icons/animated-logo.gif'
              className='h-8 lg:h-12 object-contain object-center'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='h-16 w-full bg-white flex fixed top-0 font-semibold z-9999 items-center left-0'>
        <div className='w-full h-full md:w-auto flex items-center z-50 bg-white'>
            <button 
                type="button"
                className='h-full w-auto flex items-center px-3 group'
                onClick={() => {setPage(0); isNavShown(false);}}
            >
                <Image
                    priority
                    height={2048}
                    width={2048}
                    alt='ontap creatives logo'
                    src='/images/ontap-logo.png'
                    className='max-h-14 w-14 object-contain group-focus:scale-110 ease-out duration-200'
                    draggable={false}
                />
            </button>
            <button 
                type="button"
                className='md:hidden px-5 py-2 ml-auto h-full text-3xl hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                onClick={() => isNavShown(!showNav)}
            >
              {showNav ? <HiOutlineXMark /> : <HiOutlineMenuAlt3 />}
            </button>
        </div>
        
        {/* Mobile Navigation */}
        <div ref={clickRef} className={`h-[100vh] w-2/3 shadow-lg flex flex-col z-999 items-center absolute top-0 ${showNav ? 'right-0' : '-right-full'} bg-white transition-all ease-out duration-500`}>
            {user ? (
              <>
                <div className='w-full flex flex-col gap-3 items-left rounded-b-4xl bg-dark-blue p-5 shadow-lg text-white'>
                  <div className='flex items-center justify-between'>
                    <span className='flex flex-col text-left'>
                      <strong className='font-bold text-2xl'>{user.clientName}</strong>
                      <span className='text-sm text-light-blue'>{user.email}</span>
                    </span>
                    <button type="button" className='text-3xl rounded-full border pt-2 px-2.5 pb-3 relative flex items-center justify-center'>
                      <motion.span
                        animate={{
                          rotateZ: [0, 12, 12, -20, -3],
                          scale: [1, 1.1, 1.03, 1.1, 1]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: 'loop',
                          repeatDelay: 0.5
                        }}
                      >
                        <HiBell />
                      </motion.span>
                      <span className='absolute top-full -mt-3 p-0.5 px-3 rounded-full text-xs bg-blue border'>3</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='w-full flex flex-col gap-3 items-center py-5'>
                <button 
                  type="button" 
                  className='w-16 aspect-square rounded-full border items-center justify-center flex text-5xl hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                  onClick={() => {setShowLogin(true); isNavShown(false);}}
                >
                  <TiUser />
                </button>
                <span className='font-bold text-lg'>Guest User</span>
                <button 
                  type="button"
                  className='px-5 py-2 bg-light-blue hover:bg-blue focus:bg-violet text-white rounded-md ease-out duration-200'
                  onClick={() => {setShowLogin(true);isNavShown(false);}}
                >
                  Sign In / Register
                </button>
              </div>
            )}
            <div className='h-full w-full flex flex-col pt-10'>
              <button 
                type="button" 
                className='px-10 py-3 text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                onClick={() => handleProtectedAction(4)}
              >
                <RiShoppingCart2Line className='text-2xl'/>
                <span>Cart</span>
              </button>
              <button 
                type="button" 
                className='px-10 py-3 text-xl flex items-center gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                onClick={() => handleProtectedAction(6)}
              >
                <RiBox3Line className='text-2xl'/>
                <span>Orders</span>
              </button>
              <button 
                  type="button"
                  className='px-10 py-3 text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                  onClick={() => {setPage(0); isNavShown(false);}}
              >
                <RiHome5Line className='text-2xl'/>
                  Home
              </button>
              <a 
                  href="https://portal.ontap.ph/login" 
                  className='px-10 py-3 text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
              >
                <RiPlanetLine className='text-2xl'/>
                Portal Login
              </a>
              <button 
                  type="button"
                  className='px-10 py-3 text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                  onClick={() => {setPage(1); isNavShown(false);}}
              >
                <RiUserCommunityLine className='text-2xl'/>
                Affiliate Program
              </button>
              <button 
                  type="button"
                  className='px-10 py-3 text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                  onClick={() => {setPage(3); isNavShown(false);}}
              >
                <RiShoppingBasket2Line className='text-2xl'/>
                Shop
              </button>
              
              {user && (
                <button 
                  type="button"
                  className='px-10 py-3 mt-auto text-xl flex items-center w-full gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                  onClick={handleLogout}
                >
                  <RiLogoutBoxLine className='text-2xl'/>
                  Log Out
                </button>
              )}
            </div>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex h-full w-auto ml-auto z-50'>
            <button 
                type="button"
                className='h-full px-5 text-lg hover:bg-light-blue ease-out duration-200'
                onClick={() => setPage(0)}
            >
                Home
            </button>
            <a 
                href="https://portal.ontap.ph/login" 
                className='h-full px-5 text-lg hover:bg-light-blue ease-out duration-200 flex items-center justify-center'
            >Portal Login</a>
            <button 
                type="button"
                className='h-full px-5 text-lg hover:bg-light-blue ease-out duration-200'
                onClick={() => setPage(1)}
            >
                Affiliate Program
            </button>
            <button 
                type="button"
                className='h-full px-5 text-lg flex items-center gap-1 hover:bg-light-blue ease-out duration-200'
                onClick={() => setPage(3)}
            >
                Shop
                <BsFillCaretRightFill />
            </button>
            
            {user ? (
              <div className='relative flex mr-5'>
                <button 
                  type='button' 
                  className='w-max px-3 flex items-center gap-2 text-lg hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200' 
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <RiUser5Fill className='text-2xl'/> {user.clientName?.split(' ')[0] || 'Profile'}
                </button>
                {showMoreOptions && (
                  <span ref={outsideClickRef} className='min-w-40 rounded-md border border-black/30 flex flex-col absolute top-full right-0 bg-white overflow-hidden mt-2'>
                    <button 
                      type="button" 
                      className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                      onClick={() => handleProtectedAction(4)}
                    >
                      <span className='text-base'>Cart</span><RiShoppingCart2Line />
                    </button>
                    <button 
                      type="button" 
                      className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                      onClick={() => handleProtectedAction(6)}
                    >
                      <span className='text-base'>Orders</span><RiBox3Line />
                    </button>
                    <button 
                      type="button" 
                      className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                      onClick={handleLogout}
                    >
                      <span className='text-base'>Log Out</span><RiLogoutBoxRLine />
                    </button>
                  </span>
                )}
              </div>
            ) : (
              <button 
                type="button"
                className='h-full px-5 text-lg hover:bg-dark-blue hover:text-white ease-out duration-200 flex items-center gap-2'
                onClick={() => setShowLogin(true)}
              >
                <RiUser5Fill className='text-xl'/> Sign In
              </button>
            )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <AccountSignIn 
          setShowLogin={setShowLogin} 
          onSuccess={handleLoginSuccess} // Add this prop
        />
      )}
    </>
  )
}

export default Header