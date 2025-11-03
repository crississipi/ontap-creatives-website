"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { RiDragMove2Line } from 'react-icons/ri'
import { useClickOutside } from '@/hooks';

const OrderCard = () => {
  const [moveOptions, showMoveOptions] = useState(false);
  const outsideMoveOptions = useClickOutside<HTMLDivElement>(() => showMoveOptions(false), moveOptions);
  
  return (
    <div className='relative'>
        <button type="button" className='w-full border border-black/10 flex flex-col p-0.5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'>
            <div className='w-full flex flex-col gap-1 h-full items-center justify-center py-3 relative bg-white'>
                <Image
                    height={2048}
                    width={2048}
                    alt='Order Image'
                    src='/images/card-3/front.png'
                    className='w-2/3 aspect-[3/2] rounded-lg overflow-hidden object-cover object-center'
                    draggable={false}
                />
                <span className='absolute text-[10px] uppercase text-black font-extrabold top-1 left-1 px-3 py-0.5 rounded-full bg-rose-500/20 backdrop-blur-xs'>Due Today</span>
            </div>
            <span className='flex items-center justify-between py-2 gap-3 pr-3 pl-1'>
                <p className='flex flex-col items-start leading-4 w-full overflow-hidden overflow-ellipsis'>
                    <strong className='text-sm'>Client Name</strong>
                    <span className='text-xs font-semibold text-black/50'>11.03.25 10:54 AM</span>
                </p>
                <strong className='text-xs flex font-normal items-center gap-1'>₱<span className='text-base font-extrabold'> 43,979.70</span></strong>
            </span>
        </button>
        <div ref={outsideMoveOptions} className='absolute top-2 right-2'>
            <button 
                type="button" 
                className='p-0.5 w-full flex items-center gap-2 text-xl text-black/20 hover:text-blue rounded-full border border-transparent hover:border-blue focus:text-dark-blue focus:border-dark-blue ease-out duration-200'
                onClick={() => showMoveOptions(!moveOptions)}
            ><RiDragMove2Line /></button>
            {moveOptions && (
                <span className='absolute bg-white border border-black/20 shadow-md top-8 flex flex-col right-0 rounded-lg ml-1 overflow-hidden'>
                    <span className='text-[11px] uppercase text-white text-nowrap font-extrabold p-1 px-2 pt-2 w-full bg-dark-blue'>Move To</span>
                    <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Qoute Items</button>
                    <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>For Approval</button>
                    <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Printing</button>
                    <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Production</button>
                    <button type="button" className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'>Delivery</button>
                </span>
            )}
        </div>
    </div>
  )
}

export default OrderCard