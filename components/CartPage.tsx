"use client"
import React, { useState } from 'react'
import CartSlip from './CartSlip';
import { HiMiniChevronRight } from 'react-icons/hi2';
import Image from 'next/image';
import { HiCheck } from 'react-icons/hi';
import VoucherRoulette from './VoucherRoullete';
import CheckOut from './CheckOut';
import { AnimatePresence, motion } from 'framer-motion';

const CartPage = () => {
  const [showVoucher, setShowVoucher] = useState(false);
  const [roulette, setRoulette] = useState(false);
  const [gotoCheckout, setGotoCheckout] = useState(false);
  return (
    <div className='h-[100vh] w-full flex items-center relative overflow-x-hidden p-10 pr-5 gap-5 select-none overflow-hidden bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/70 before:backdrop-blur-md'>
        {roulette && (<VoucherRoulette setRoulette={setRoulette} />)}
        <AnimatePresence mode="wait">
        {gotoCheckout ? (
            <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full h-full z-50"
            >
                <CheckOut setGotoCheckout={setGotoCheckout}/>
            </motion.div>
        ) : (
            <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className='h-full w-full flex items-center relative z-50 gap-5'
            >
                <div className='flex flex-col w-6/7 h-full pt-16'>
                <motion.h1 
                    initial={{x:-200, opacity:0}}
                    animate={{x:0, opacity:1}}
                    exit={{x:-200, opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                className='w-full text-left text-4xl font-bold'
                >Cart
                </motion.h1>
                <motion.p
                    initial={{x:-200, opacity:0}}
                    animate={{x:0, opacity:1}}
                    exit={{x:-200, opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                >You have <strong className='font-extrabold'>3 items</strong> in your cart.
                </motion.p>
                <div className='w-[95%] ml-auto h-full max-h-[90%] flex gap-3 mt-5'>
                    <motion.div 
                        initial={{x:-200, opacity:0}}
                        animate={{x:0, opacity:1}}
                        exit={{x:-200, opacity:0}}
                        transition={{type:'spring', stiffness:100, damping:20, delay: 0.3}}
                        className='h-full w-5/7 flex flex-col items-center border border-black/20 rounded-xl p-5 pr-0 gap-3 bg-white/50 backdrop-blur-sm'
                    >
                        <div className='w-full grid grid-cols-5 text-sm text-dark-blue font-extrabold uppercase border-b border-black/20 pb-3 mr-5'>
                            <span className='pl-5 col-span-2'>Product</span>
                            <span className='text-center col-span-1'>Price</span>
                            <span className='text-center col-span-1'>Quantity</span>
                            <span className='text-center col-span-1'>Total</span>
                        </div>
                        <div className='h-full w-full flex flex-col overflow-x-hidden pr-3'>
                            {Array.from({length: 10}).map((_, i) => (
                                <CartSlip key={i}/>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{y:500, opacity:0}}
                        animate={{y:0, opacity:1}}
                        exit={{y:500, opacity:0}}
                        transition={{type:'spring', stiffness:100, damping:20}}
                        className='h-full w-2/7 flex flex-col items-center border border-black/20 rounded-xl bg-white/50 backdrop-blur-sm'
                    >
                        <h2 className='w-full text-left text-xl font-bold p-3 px-5 border-b border-black/20'>Order Summary</h2>
                        <div className='h-full w-full flex flex-col p-5 gap-3'>
                            <div className='w-full flex justify-between'>
                                <span className='font-semibold'>Total Items</span>
                                <span className='font-extrabold text-lg text-dark-blue'>3</span>
                            </div>
                            <div className='w-full flex justify-between'>
                                <span className='font-semibold'>Subtotal</span>
                                <span className='font-extrabold text-lg text-dark-blue'><span className='text-base'>₱</span> 7,500.00</span>
                            </div>
                            <button type='button' className='w-full flex justify-between'>
                                <span className='font-semibold flex items-center gap-1' onClick={() => setShowVoucher(!showVoucher)}>Discount <HiMiniChevronRight className={`${showVoucher && 'rotate-z-90'} ease-out duration-200`}/></span>
                                <span className='font-extrabold text-lg text-black/40'><span className='text-base'>₱</span> 0.00</span>
                            </button>
                            {showVoucher && (
                                <div className='h-max w-full flex flex-col rounded-md bg-blue p-3 py-2 pb-3 text-white'>
                                    <p className='font-semibold'>Select Voucher</p>
                                    <span className='w-full relative'>
                                        <input type="text" placeholder='Enter voucher code' className='w-full border border-white/20 rounded-md p-2 text-sm hover:border-white/70 focus:border-white ease-out duration-200'/>
                                        <button type="button" className='rounded-md p-1 text-xl border border-emerald-400 hover:bg-emerald-500 focus:bg-emerald-300 absolute top-1/2 right-1 -translate-y-1/2'><HiCheck /></button>
                                    </span>
                                    <span className='w-full flex items-center mt-5'>First time user? Try
                                        <button 
                                            type="button" 
                                            className='ml-auto flex gap-2 items-center text-lg px-3 py-2 rounded-md border border-white/30 bg-black/20 hover:bg-black/40 focus:bg-black/60 focus:border-black font-extrabold ease-out duration-200 mt-1'
                                            onClick={() => setRoulette(true)}
                                        >
                                            <Image
                                                priority
                                                height={2048} 
                                                width={2048}
                                                alt='voucher roullete'
                                                src={'/icons/roulette.png'}
                                                className='h-6 w-6 object-contain object-center'
                                            />
                                            <strong className='font-extrabold'>Spin-a-Wheel</strong>
                                        </button>
                                    </span>
                                </div>
                            )}
                            <div className='w-full flex justify-between border-t border-black/20 pt-3'>
                                <span className='font-bold text-xl'>Total</span>
                                <span className='font-extrabold text-2xl text-dark-blue'><span className='text-base'>₱</span> 7,650.00</span>
                            </div>
                            <button type="button" className='w-full mt-auto bg-dark-blue hover:bg-violet focus:bg-violet text-white font-bold py-3 rounded-md ease-out duration-200' onClick={() => setGotoCheckout(true)}>Proceed to Checkout</button>
                        </div>
                    </motion.div>
                </div>
                </div>
                <div className='h-[95%] mt-16 w-1/7 flex flex-col items-center border border-black/20'>
                {/* Adds Here */}
                </div>
            </motion.div>
        )}
        </AnimatePresence>
        
    </div>
  )
}

export default CartPage