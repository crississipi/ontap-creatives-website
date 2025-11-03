"use client";

import React, { useState } from 'react';
import { RiAddLine, RiExportFill, RiSearchLine } from 'react-icons/ri';
import StatusCategory from './StatusCategory';
import { useClickOutside } from '@/hooks';
import { AnimatePresence, motion } from 'framer-motion';

type SortKey =
  | "refid"
  | "name"
  | "email"
  | "contact"
  | "orders"
  | "amount"
  | "dateOrdered";

type SortState = {
  [key in SortKey]: boolean;
};

interface VisitorProps {
    changePage: (newPage: number) => void;
}

const SearchFilters = [""];

const VisitorsPage = ({ changePage }: VisitorProps) => {
  const [addProcess, showAddProcess] = useState(false);
  const [placeAfterOptions, showPlaceAfterOptions] = useState(false);
  const [placeBeforeOptions, showPlaceBeforeOptions] = useState(false);

  const outsideAfterOptions = useClickOutside<HTMLDivElement>(() => showPlaceAfterOptions(false), placeAfterOptions);
  const outsideBeforeOptions = useClickOutside<HTMLDivElement>(() => showPlaceBeforeOptions(false), placeBeforeOptions);
  const outsideProcessPage = useClickOutside<HTMLDivElement>(() => showAddProcess(false), addProcess);

  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 gap-3 pb-5 flex flex-col relative'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Orders</h1>
            <div className='flex gap-3 text-sm md:text-base'>
                <div className='flex gap-2 px-3 border border-violet items-center rounded-md w-60 md:w-80 text-violet'>
                    <RiSearchLine className='text-xl'/>
                    <input type="text" placeholder='Search...' className='outline-none w-full h-full text-black placeholder:text-violet'/>
                </div>
                <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-3 text-xl hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill /></button>
            </div>
        </div>
        <span className='w-full flex items-center justify-end pr-5 mt-2'>
            <button 
                type="button" 
                className='flex items-center gap-1 px-3 py-2 rounded-md bg-blue text-white hover:bg-violet focus:bg-dark-blue hover:text-white focus:text-white ease-out duration-200'
                onClick={() => showAddProcess(!addProcess)}
            ><RiAddLine className='text-xl'/>New Process</button>
        </span>
        <div className='max-w-[89vw] w-full h-full flex md:overflow-hidden'>
            <div className='min-w-full w-auto h-full flex flex-nowrap gap-3 overflow-y-hidden horizontal-scroll pb-3'>
                <StatusCategory />
                <StatusCategory />
                <StatusCategory />
                <StatusCategory />
                <StatusCategory />
                <StatusCategory />
            </div>
        </div>
        <AnimatePresence mode="wait">
            {addProcess && (
            <div className='fixed w-full h-full z-50 bg-black/30 top-0 left-0 flex items-center justify-center'>
                <motion.div 
                    initial={{scale: 0.7, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.7, opacity: 0}}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                    ref={outsideProcessPage} 
                    className='w-1/4 h-max rounded-xl bg-white shadow-md shadow-black/20 p-5 flex flex-col gap-5'
                >
                    <h3 className='text-xl'>New Process</h3>
                    <span className='mt-10'>
                        <label htmlFor="processName" className='text-sm'>Process Name</label>
                        <input 
                            type="text" 
                            name="processName"
                            className='w-full p-3 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200'
                        />
                    </span>
                    <div className='w-full grid grid-cols-2 gap-3 gap-y-0'>
                        <span className='col-span-full font-bold text-violet'>Place Process</span>
                        <span>
                            <label htmlFor="processName" className='text-sm'>After</label>
                            <div className='relative w-full'>
                                <input 
                                    type="text" 
                                    name="processName"
                                    className='w-full p-3 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200'
                                    onMouseDown={() => showPlaceAfterOptions(true)}
                                />
                                {placeAfterOptions && (
                                    <span ref={outsideAfterOptions} className='w-full absolute top-full mt-1 left-0 bg-white rounded-md border border-black/20 flex flex-col overflow-hidden'>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Newly Ordered</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Qouted</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>For Approval</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Printing</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Delivery</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Delivered</button>
                                    </span>
                                )}
                            </div>
                        </span>
                        <span>
                            <label htmlFor="processName" className='text-sm'>Before</label>
                            <div className='relative w-full'>
                                <input 
                                    type="text" 
                                    name="processName"
                                    className='w-full p-3 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200'
                                    onMouseDown={() => showPlaceBeforeOptions(true)}
                                />
                                {placeBeforeOptions && (
                                    <span ref={outsideBeforeOptions} className='w-full absolute top-full mt-1 left-0 bg-white rounded-md border border-black/20 flex flex-col overflow-hidden'>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Newly Ordered</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Qouted</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>For Approval</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Printing</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Delivery</button>
                                        <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Delivered</button>
                                    </span>
                                )}
                            </div>
                        </span>
                    </div>
                    <div className='w-full flex flex-col gap-3'>
                        <h3>Notify me when</h3>
                        <div className='w-full flex flex-col gap-2'>
                            <span className='w-full flex gap-2'>
                                <input type="checkbox"/>
                                <p>Admin had changed order status.</p>
                            </span>
                            <span className='w-full flex gap-2'>
                                <input type="checkbox" />
                                <p>Admin edit properties.</p>
                            </span>
                            <span className='w-full flex gap-2'>
                                <input type="checkbox" />
                                <p>Admin removed item/s.</p>
                            </span>
                            <span className='w-full flex gap-2'>
                                <input type="checkbox" />
                                <p>Order is nearing deadline.</p>
                            </span>
                        </div>
                    </div>
                    <button type="button" className='py-3 rounded-lg bg-blue text-white mt-10 hover:bg-dark-blue focus:bg-violet ease-out duration-200'>Add Process</button>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    </div>
  )
}

export default VisitorsPage