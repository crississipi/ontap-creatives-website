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

const Header = ({ setPage }: HeaderProps) => {
  const [showNav, isNavShown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const outsideClickRef = useClickOutside<HTMLDivElement>(() => setShowMoreOptions(false), showMoreOptions);
  
  return (
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
        <div  className={`h-[100vh] w-3/4 flex flex-col z-10 items-center absolute top-0 pt-20 ${showNav ? 'right-0' : '-right-full'} bg-white transition-all ease-out duration-500`}>
            <div className='w-full flex flex-col gap-3 items-center'>
                <button type="button" className='w-16 aspect-square rounded-full border items-center justify-center flex text-5xl hover:bg-light-blue focus:bg-light-blue ease-out duration-200'><TiUser /></button>
                <span className='font-bold text-lg'>Juan Dela Cruz</span>
                <div className='w-full flex gap-3 items-center justify-center'>
                    <button type="button" className='h-16 flex px-7 gap-2 items-center text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'><RiShoppingCart2Line className='text-2xl'/> Cart</button>
                    <button type="button" className='h-16 flex px-7 gap-2 items-center text-lg hover:bg-light-blue focus:bg-light-blue ease-out duration-200'><RiBox3Line className='text-2xl'/> Orders</button>
                </div>
            </div>
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
            <button 
                type="button"
                className='mt-auto h-full max-h-16 w-full text-xl md:text-lg flex items-center justify-center px-5 py-2 gap-3 hover:bg-light-blue focus:bg-light-blue ease-out duration-200'
            >Log Out<MdLogout className='text-2xl'/></button>
        </div>
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
            <div className='relative flex mr-5'>
                <button type='button' className='w-max px-3 flex items-center gap-2 text-lg hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200' onClick={() => setShowMoreOptions(!showMoreOptions)}>
                    <RiUser5Fill className='text-2xl'/> Profile
                </button>
                {showMoreOptions && (
                    <span ref={outsideClickRef} className='min-w-40 rounded-md border border-black/30 flex flex-col absolute top-full right-0 bg-white overflow-hidden mt-2'>
                        <button 
                            type="button" 
                            className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                            onClick={() => setPage(4)}
                        >
                            
                            <span className='text-base'>Cart</span><RiShoppingCart2Line />
                        </button>
                        <button 
                            type="button" 
                            className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                            onClick={() => setPage(6)}
                        >
                            
                            <span className='text-base'>Orders</span><RiBox3Line />
                        </button>
                        <button 
                            type="button" 
                            className='px-5 py-3 text-xl flex items-center justify-between gap-3 hover:bg-dark-blue focus:bg-violet hover:text-white focus:text-white ease-out duration-200'
                            onClick={() => setPage(4)}
                        >
                            
                            <span className='text-base'>Log Out</span><RiLogoutBoxRLine />
                        </button>
                    </span>
                )}
            </div>
            
        </div>
    </div>
  )
}

export default Header