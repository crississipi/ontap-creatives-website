"use client"

import { HeaderProps } from '@/types'
import React, { JSX, useState } from 'react'
import Image from 'next/image'
import { RiArrowLeftDoubleLine, RiDashboardLine, RiDiscountPercentLine, RiGalleryLine, RiLogoutBoxLine, RiPaintBrushLine, RiText, RiUserSettingsLine } from 'react-icons/ri'
import Dashboard from './Dashboard'
import VisitorsPage from './InquiriesPage'
import Customization from './Customization'

const Navigations = [
    {
        icon: <RiDashboardLine />,
        name: 'Dashboard'
    },
    {
        icon: <RiUserSettingsLine />,
        name: 'Inquiries'
    },
    {
        icon: <RiPaintBrushLine />,
        name: 'Customization'
    },
];

const Mainpage = ({ setPage }: HeaderProps) => {
  const [minimized, isMinimized] = useState(false);
  const [page, changePage] = useState(0);
  const pages: Record<number, JSX.Element> = {
    0: <Dashboard />,
    1: <VisitorsPage />,
    2: <Customization />
  };
  const [showMore, setShowMore] = useState(false);

  return (
    <div className='h-full w-full flex overflow-hidden'>
        <div className='min-w-20 w-max h-full shadow-lg shadow-neutral-400 flex flex-col items-center py-5 relative transition-all ease-out duration-200'>
            <Image
                height={500}
                width={500}
                alt='logo image'
                src='/images/ontap-logo.png'
                className='h-14 w-14 object-center object-contain'
            />
            <button type="button" className='p-1.5 rounded-md top-24 -right-3 absolute bg-white shadow-md text-xl z-50 ring-2 ring-transparent hover:ring-light-blue focus:ring-violet focus:text-violet ease-out duration-200' onClick={() => isMinimized(!minimized)}><RiArrowLeftDoubleLine className={`${minimized ? 'rotate-180' : ''}`}/></button>
            <div className='w-full flex flex-col mt-20 justify-center items-center relative'>
                {Navigations.map((nav, i) => (
                    <button 
                    key={`navigation_${i}`} 
                    type="button"
                    className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                    onClick={() => {i < 2 ? changePage(i) : setShowMore(!showMore); changePage(i)}}
                    >
                        <span className={`text-xl p-3 ${!minimized && 'pl-5'}`}>
                            {nav.icon}
                        </span>
                        {!minimized && (
                            <span className='pr-10 mr-auto'>
                                {nav.name}
                            </span>
                        )}
                        
                    </button>
                ))}
                {showMore && (
                    <div className='w-full flex flex-col absolute top-full bg-light-blue/50'>
                        <button 
                            type="button"
                            className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                        >
                            <span className={`text-xl p-3 ${!minimized && 'pl-5'}`}>
                                <RiDiscountPercentLine />
                            </span>
                            {!minimized && (
                                <span className='pr-10 mr-auto'>
                                    Promos
                                </span>
                            )}
                        </button>
                        <button 
                            type="button"
                            className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                        >
                            <span className={`text-xl p-3 ${!minimized && 'pl-5'}`}>
                                <RiGalleryLine />
                            </span>
                            {!minimized && (
                                <span className='pr-10 mr-auto'>
                                    Products
                                </span>
                            )}
                        </button>
                        <button 
                            type="button"
                            className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                        >
                            <span className={`text-xl p-3 ${!minimized && 'pl-5'}`}>
                                <RiText />
                            </span>
                            {!minimized && (
                                <span className='pr-10 mr-auto'>
                                    Content
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>
            <button type="button" className='flex items-center gap-3 mt-auto w-9/10 rounded-md bg-light-blue/50 text-dark-blue px-3 py-3  font-semibold hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'>
                <RiLogoutBoxLine className='text-xl'/>
                {!minimized && <span className='pr-5'>Log Out</span>}
            </button>
        </div>
        <div className='w-full h-full'>
            {pages[page]}
        </div>
    </div>
  )
}

export default Mainpage