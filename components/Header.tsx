"use client"

import React, { useState } from 'react'
import Image from "next/image";
import { BsFillCaretRightFill } from 'react-icons/bs';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { HeaderProps } from '@/types';
import { RiBox3Line, RiLogoutBoxRLine, RiShoppingCart2Line, RiUser5Fill } from 'react-icons/ri';
import { useClickOutside } from '@/hooks';
import { TiUser } from 'react-icons/ti';
import { MdLogout } from 'react-icons/md';
import { useUser } from '@/contexts/UserContext';
import AccountSignIn from './AccountSignIn';

const Header = ({ setPage }: HeaderProps) => {
  const [showNav, isNavShown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
              className='h-12 object-contain object-center'
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
                <HiOutlineMenuAlt3 />
            </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`h-[100vh] w-3/4 flex flex-col z-10 items-center absolute top-0 pt-20 ${showNav ? 'right-0' : '-right-full'} bg-white transition-all ease-out duration-500`}>
            {user ? (
              <>
                <div className='w-full flex flex-col gap-3 items-center'>
                  <button type="button" className='w-16 aspect-square rounded-full border items-center justify-center flex text-5xl hover:bg-light-blue focus:bg-light-blue ease-out duration-200'>
                    <TiUser />
                  </button>
                  <span className='font-bold text-lg'>{user.clientName || user.email}</span>
                  <div className='w-full flex gap-3 items-center justify-center'>
                    <button 
                      type="button" 
                      className='h-16 flex px-7 gap-2 items-center text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                      onClick={() => handleProtectedAction(4)}
                    >
                      <RiShoppingCart2Line className='text-2xl'/> Cart
                    </button>
                    <button 
                      type="button" 
                      className='h-16 flex px-7 gap-2 items-center text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                      onClick={() => handleProtectedAction(6)}
                    >
                      <RiBox3Line className='text-2xl'/> Orders
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
            
            <button 
                type="button"
                className='h-full max-h-16 px-3 w-full text-xl md:text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                onClick={() => {setPage(0); isNavShown(false);}}
            >
                Home
            </button>
            <a 
                href="https://portal.ontap.ph/login" 
                className='h-full max-h-16 px-3 w-full text-xl flex items-center justify-center md:text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
            >Portal Login</a>
            <button 
                type="button"
                className='h-full max-h-16 px-3 w-full text-xl md:text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                onClick={() => {setPage(1); isNavShown(false);}}
            >
                Affiliate Program
            </button>
            <button 
                type="button"
                className='h-full max-h-16 w-full text-xl md:text-lg flex items-center justify-center gap-1 hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                onClick={() => {setPage(3); isNavShown(false);}}
            >
                Shop
                <BsFillCaretRightFill />
            </button>
            
            {user && (
              <button 
                type="button"
                className='mt-auto h-full max-h-16 w-full text-xl md:text-lg flex items-center justify-center px-5 py-2 gap-3 hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
                onClick={handleLogout}
              >
                Log Out<MdLogout className='text-2xl'/>
              </button>
            )}
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