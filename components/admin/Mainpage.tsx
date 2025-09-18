"use client"

import { HeaderProps } from '@/types'
import React, { JSX, useState } from 'react'
import Image from 'next/image'
import { RiArrowLeftDoubleLine, RiDashboardLine, RiLogoutBoxLine, RiPaintBrushLine, RiUserSettingsLine } from 'react-icons/ri'
import Dashboard from './Dashboard'

const Navigations = [
    {
        icon: <RiDashboardLine />,
        name: 'Dashboard'
    },
    {
        icon: <RiUserSettingsLine />,
        name: 'Visitors'
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
    0: <Dashboard />
  }
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
            <button type="button" className='p-1.5 rounded-md top-24 -right-3 absolute bg-white shadow-md text-xl ring-2 ring-transparent hover:ring-light-blue focus:ring-violet focus:text-violet ease-out duration-200' onClick={() => isMinimized(!minimized)}><RiArrowLeftDoubleLine className={`${minimized ? 'rotate-180' : ''}`}/></button>
            <div className='w-full flex flex-col mt-20 justify-center items-center'>
                {Navigations.map((nav, i) => (
                    <button 
                    key={`navigation_${i}`} 
                    type="button"
                    className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                    onClick={() => changePage(i)}
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