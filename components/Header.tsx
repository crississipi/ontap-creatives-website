"use client"

import React, { useState } from 'react'
import Image from "next/image";
import { BsFillCaretRightFill } from 'react-icons/bs';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

interface HeaderProps {
    setPage: (page: number) => void;
};

const Header = ({ setPage }: HeaderProps) => {
  const [showNav, isNavShown] = useState(false);
  return (
    <div className='h-16 w-full bg-white flex fixed top-0 font-semibold z-50 items-center left-0'>
        <div className='w-full h-full md:w-auto flex items-center z-50 bg-white'>
            <button 
                type="button"
                className='h-full w-auto flex items-center px-3 group'
                onClick={() => setPage(0)}
            >
                <Image
                    priority
                    height={2048}
                    width={2048}
                    alt='ontap creatives logo'
                    src='/images/ontap-logo.png'
                    className='max-h-14 w-14 object-contain group-focus:scale-110 ease-out duration-200'
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
        <div className={`h-[90vh] w-full flex flex-col items-center absolute ${showNav ? 'top-full' : '-top-999'} left-0 bg-white transition-all ease-out duration-500`}>
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
        </div>
        <div className='hidden md:flex h-full w-auto ml-auto'>
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
        </div>
    </div>
  )
}

export default Header