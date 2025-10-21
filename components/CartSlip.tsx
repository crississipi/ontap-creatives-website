"use client"

import React, { useState } from 'react'
import { HiCheck, HiMinus, HiOutlineTrash, HiPlus } from 'react-icons/hi'

const CartSlip = () => {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(false);
  return (
    <div className='h-max md:h-32 w-full p-3 gap-3 border-b border-black/10 grid grid-cols-2 md:grid-cols-5 relative'>
        <div className='col-span-full md:col-span-3 flex pr-12'>
            <span className='w-10 h-full flex items-center'>
                <button type="button" className={`w-6 aspect-square rounded-sm flex items-center justify-center border border-black/50 hover:bg-blue ${selected && 'bg-violet text-white'} ease-out duration-200`} onClick={() => setSelected(!selected)}>
                    {selected && (<HiCheck />)}
                </button>
            </span>
            <div className='h-full flex gap-3'>
                <span className='h-16 md:h-full aspect-square bg-neutral-400'></span>
                <span className='flex flex-col w-full text-left'>
                    <h2 className='text-base font-semibold mb-auto'>Product Name</h2>
                    <p className='text-neutral-700 text-sm mt-1'>Color: <strong>Default</strong></p>
                    <span className='text-neutral-700 text-sm -mt-1'>Logo Style: <strong>OnTap</strong></span>
                </span>
            </div>
            <span className='hidden h-full md:flex items-center justify-center font-extrabold text-base text-dark-blue ml-auto'>
                <p><span className='text-sm'>₱</span> 2,500.00</p>
            </span>
        </div>
        <span className='col-span-1 h-full flex items-center justify-end md:justify-center z-30 font-extrabold text-sm text-dark-blue'>
            <button type="button" className='p-1.5 rounded-md border border-black/5 hover:border-black/70 focus:bg-violet focus:text-white ease-out duration-200' onClick={() => setQty((prev) => qty > 1 ? prev - 1 : 1)}><HiMinus /></button>
            <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10))} className='w-10 text-center text-base'/>
            <button type="button" className='p-1.5 rounded-md border border-black/5 hover:border-black/70 focus:bg-violet focus:text-white ease-out duration-200' onClick={() => setQty((prev) => prev + 1)}><HiPlus /></button>
        </span>
        <span className='col-span-1 h-full flex items-center justify-end md:justify-center font-extrabold text-dark-blue'>
            <p><span className='text-sm'>₱</span> 2,500.00</p>
        </span>
            <button type="button" className='p-1 md:h-[80%] z-30 ml-auto absolute md:top-1/2 md:-translate-y-1/2 right-0 text-2xl text-rose-600 border border-rose-50 hover:bg-rose-300 focus:bg-rose-500 focus:text-white ease-out duration-200'><HiOutlineTrash /></button>
        </div>
  )
}

export default CartSlip