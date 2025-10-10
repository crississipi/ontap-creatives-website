"use client"

import { EditProps, HeaderProps } from '@/types'
import React, { JSX, useState } from 'react'
import Image from 'next/image'
import { RiArrowLeftDoubleLine, RiCloseLargeFill, RiCoupon2Line, RiDashboardLine, RiDiscountPercentLine, RiGalleryLine, RiLogoutBoxLine, RiMenuFill, RiPaintBrushLine, RiShoppingBag4Line, RiText } from 'react-icons/ri'
import { AffiliateInfo, AffiliatesPage, Content, Customization, Dashboard, ProductPage, Promos, UserInfo, VisitorsPage } from '.'
import { LuBriefcaseBusiness } from 'react-icons/lu'
import { HiViewGridAdd } from 'react-icons/hi'
import { AnimatePresence, motion } from 'framer-motion'

const Navigations = [
    {
        icon: <RiDashboardLine />,
        name: 'Dashboard'
    },
    {
        icon: <RiShoppingBag4Line />,
        name: 'Orders'
    },
    {
        icon: <LuBriefcaseBusiness />,
        name: 'Affiliates'
    },
    {
        icon: <RiCoupon2Line />,
        name: 'Promos'
    },
];

type MainpageProps = HeaderProps & EditProps;

const AdminMainpage = ({ setPage, editable }: MainpageProps) => {
  const [minimized, isMinimized] = useState(false);
  const [page, changePage] = useState(0);
  const [child, setChild] = useState(<Promos />);
  const [tag, setTag] = useState('promos')
  const pages: Record<number, JSX.Element> = {
    0: <Dashboard />,
    1: <VisitorsPage changePage={changePage}/>,
    2: <AffiliatesPage changePage={changePage}/>,
    3: <Customization child={child} tag={tag} />,
    4: <UserInfo />,
    5: <AffiliateInfo />
  };
  const [showMore, setShowMore] = useState(false);
  const [showMoreOptions, setShowMoreOption] = useState(false);

  return (
    <div className='h-full w-full flex md:overflow-hidden relative bg-white'>
        <div className='lg:min-w-12 2xl:min-w-20 w-max h-max md:h-full shadow-lg shadow-neutral-400 flex flex-col items-center lg:py-5 absolute 2xl:relative bg-white z-100 lg:bg-inherit '>
            <>
                <Image
                    height={500}
                    width={500}
                    alt='logo image'
                    src='/images/ontap-logo.png'
                    className='hidden md:block h-10 w-10 2xl:h-16 2xl:w-16 mt-5 object-center object-contain'
                    draggable={false}
                />
                <button type="button" className={`hidden md:block p-1.5 rounded-md top-20 -right-3 absolute bg-white shadow-md text-xl z-50 ring-2 ring-transparent hover:ring-light-blue focus:ring-violet focus:text-violet ease-out duration-200`} onClick={() => isMinimized(!minimized)}>
                    <RiArrowLeftDoubleLine className={`hidden md:block ${minimized ? 'rotate-180' : ''}`}/>
                </button>
                <div className='hidden md:flex w-full flex-col mt-20 justify-center items-center relative'>
                    {Navigations.map((nav, i) => (
                        <button 
                        key={`navigation_${i}`} 
                        type="button"
                        className={`w-full flex items-center ${minimized && 'justify-center'} group hover:bg-light-blue text-dark-blue font-semibold focus:bg-violet focus:text-white ease-out duration-200`}
                        onClick={() => 
                            {i < 3 ? changePage(i) : 
                                setShowMore(!showMore); 
                                changePage(i)
                            }}
                        >
                            <span className={`text-2xl p-3 ${!minimized && 'pl-5'}`}>
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
                                onClick={() => {setChild(<Promos />); setTag('promos')}}
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
                                onClick={() => {setChild(<ProductPage />); setTag('productpage')}}
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
                                onClick={() => {setChild(<Content />); setTag('content');}}
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
                <button type="button" className='hidden md:flex items-center gap-3 mt-auto w-9/10 rounded-md bg-light-blue/50 text-dark-blue px-3 py-3 font-semibold hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200' onClick={() => setPage(0)}>
                    <RiLogoutBoxLine className='text-xl'/>
                    {!minimized && <span className='pr-5'>Log Out</span>}
                </button>
            </>
        </div>
        <div className='w-full h-full flex md:pl-5 2xl:pl-0'>
            {pages[page]}
        </div>
        <AnimatePresence mode='wait'>
            <>
                {showMoreOptions && (
                    <motion.div 
                    initial={{y: 30, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: 30, opacity: 0}}
                    transition={{
                        duration: 0.15,
                        ease: 'easeOut'
                    }}
                    className='fixed bottom-22 h-40 w-2/3 rounded-xl bg-footer-bg left-1/2 -translate-x-1/2 grid grid-cols-3 gap-1 p-2'>
                        {Array.from({length:7}).map((_,i) => (
                            <button key={i} type='button' className='col-span-1 rounded-sm border flex items-center px-2 gap-3 text-white/50 hover:border-blue hover:text-blue focus:rounded-lg focus:bg-dark-blue focus:text-white ease-out duration-300'><RiText /> Content</button>
                        ))}
                        <span className='h-5 -mt-1 w-5 rounded-sm rotate-45 absolute top-full bg-footer-bg left-1/2 -translate-1/2'></span>
                    </motion.div>
                )}
                {showMore && (
                    <motion.div 
                    initial={{y:50, scale: 0.7}}
                    animate={{y:0, scale: 1}}
                    exit={{y:50, scale: 0.7}}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                    className='fixed md:hidden z-[99] min-w-2/3 w-max left-1/2 -translate-x-1/2 h-16 bottom-3 gap-0 grid grid-cols-5 items-center rounded-xl bg-footer-bg shadow-md shadow-black/30 overflow-hidden p-1'
                    >
                        {Array.from({length: 5}).map((_,i) => (
                            <button 
                            key={`nav-${i}`} 
                            type='button' 
                            className='col-span-1 h-full flex flex-col items-center justify-evenly text-white/50 text-2xl p-1 border-x border-transparent group hover:border-blue hover:text-blue focus:rounded-lg focus:bg-dark-blue focus:text-white ease-out duration-300'
                            onClick={() => {i !== 2 ? changePage(i < 2 ? i : i - 1): setShowMoreOption(!showMoreOptions)}}
                            >
                                {i < 2 ? (
                                    <>
                                        {Navigations[i].icon}
                                        <span className='text-xs'>{Navigations[i].name}</span>
                                    </>
                                ) : i === 2 ? (
                                    <>
                                        {showMoreOptions ? 
                                        <motion.span 
                                        initial={{rotateZ: '0deg'}}
                                        animate={{rotateZ: '180deg'}}
                                        exit={{rotateZ: '0deg'}}
                                        transition={{
                                            ease:'easeOut',
                                            duration: 0.3
                                        }}
                                        className='group-hover:scale-101'
                                        >
                                            <RiCloseLargeFill/>
                                        </motion.span>
                                        : 
                                        <motion.span 
                                        initial={{rotateZ: '0deg'}}
                                        animate={{rotateZ: '180deg'}}
                                        exit={{rotateZ: '0deg'}}
                                        transition={{
                                            ease:'easeOut',
                                            duration: 0.3
                                        }}
                                        className='group-hover:scale-101'
                                        >
                                            <HiViewGridAdd/>
                                        </motion.span>
                                        }
                                        <span className='text-xs'>{showMoreOptions ? 'Close' : 'More'}</span>
                                    </>
                                ) : (
                                    <>
                                        {Navigations[i - 1].icon}
                                        <span className='text-xs'>{Navigations[i - 1].name}</span>
                                    </>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
                <button type="button" className='fixed h-12 aspect-square rounded-lg shadow-md shadow-black/20 bottom-5 right-5 flex items-center justify-center text-2xl bg-footer-bg text-white ring-2 ring-transparent hover:ring-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setShowMore(!showMore)}>
                    {showMore ? <RiCloseLargeFill /> : <RiMenuFill />}
                </button>
            </>
        </AnimatePresence>
    </div>
  )
}

export default AdminMainpage