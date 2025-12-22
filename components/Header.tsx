"use client"

import React, { useState } from 'react'
import Image from "next/image";
import { BsFillCaretRightFill } from 'react-icons/bs';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { HeaderProps } from '@/types';
import { RiBox3Line, RiLogoutBoxRLine, RiShoppingCart2Line, RiUser5Fill } from 'react-icons/ri';
import { useClickOutside } from '@/hooks';
import { useUser } from '@/contexts/UserContext';
import { HiOutlineXMark } from 'react-icons/hi2';

interface ExtendedHeaderProps extends HeaderProps {
  showNav: boolean;
  isNavShown: (show: boolean) => void;
  setShowLogin: (show: boolean) => void;
}

const Header = ({ setPage, showNav, isNavShown, setShowLogin }: ExtendedHeaderProps) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { user, logout, loading } = useUser();

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
      <div className='h-16 w-full border-b border-gray-100/50 shadow-sm flex fixed top-0 font-semibold z-9999 items-center left-0 text-dark-blue bg-white/80 backdrop-blur-md transition-all duration-300 supports-backdrop-filter:bg-white/60'>
        <div className='w-full h-full md:w-auto flex items-center z-50'>
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
                    src='/images/logo.png'
                    className='max-h-20 w-20 object-contain group-hover:scale-105 transition-transform duration-300 ease-out'
                    draggable={false}
                />
            </button>
            <button 
                type="button"
                className='md:hidden px-5 py-2 ml-auto h-full text-3xl hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 text-gray-700'
                onClick={() => isNavShown(!showNav)}
            >
              {showNav ? <HiOutlineXMark /> : <HiOutlineMenuAlt3 />}
            </button>
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
                  className='w-max px-3 aspect-square flex items-center justify-center gap-2 text-lg relative hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200' 
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <RiUser5Fill className='text-2xl'/> 
                </button>
                {showMoreOptions && (
                  <span ref={outsideClickRef} className='min-w-40 rounded-md border border-black/30 flex flex-col absolute top-full right-0 bg-white overflow-hidden mt-2'>
                    <button 
                      type="button" 
                      className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                      onClick={() => handleProtectedAction(9)}
                    >
                      <span className='text-base'>Profile</span><RiUser5Fill />
                    </button>
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
    </>
  )
}

export default Header