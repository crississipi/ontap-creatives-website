"use client"

import { useClickOutside } from '@/hooks';
import React, { useState } from 'react'
import { RiBallPenLine, RiDeleteBinLine, RiDragMove2Line, RiMoreFill } from 'react-icons/ri'
import Image from 'next/image';
import OrderCard from './OrderCard';

const StatusCategory = () => {
  const [moreOptions, showMoreOptions] = useState(false);

  const outsideOptions = useClickOutside<HTMLDivElement>(() => showMoreOptions(false), moreOptions);

  return (
    <div className='min-h-full h-auto min-w-100 bg-white border border-black/10 rounded-xl flex flex-col hover:border-dark-blue hover:shadow-md ease-out duration-200'>
        <div className='w-full flex items-center justify-between p-3 py-2'>
            <span className='w-full font-extrabold text-sm uppercase'>Newly Ordered</span>
            <div ref={outsideOptions} className='relative z-40'>
                <button 
                    type="button" 
                    className='p-1 text-xl rounded-full border border-transparent hover:text-violet hover:border-violet focus:bg-violet focus:text-white ease-out duration-200'
                    onClick={() => showMoreOptions(!moreOptions)}
                ><RiMoreFill /></button>
                {moreOptions && (
                    <span className='flex flex-col absolute top-full mt-1 bg-white right-1 rounded-lg border-black/20 shadow-md'>
                        <button type="button" className='px-3 py-2 flex items-center gap-2 rounded-t-lg hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 ease-out duration-200'><RiBallPenLine /> Edit</button>
                        <button type="button" className='px-3 py-2 flex items-center gap-2 rounded-b-lg hover:text-rose-500 hover:bg-neutral-100 focus:text-red-500 focus:bg-neutral-200 ease-out duration-200'><RiDeleteBinLine />Delete</button>
                    </span>
                )}
            </div>
        </div>
        <div className='h-full w-full flex flex-col overflow-x-hidden gap-2 px-1 pl-2 pb-3'>
            {Array.from({length: 5}).map((_,i) => (
                <OrderCard key={i}/>
            ))}
        </div>
    </div>
  )
}

export default StatusCategory