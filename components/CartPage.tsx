"use client"
import React, { useState } from 'react'
import CartSlip from './CartSlip';
import VoucherRoulette from './VoucherRoullete';
import CheckOut from './CheckOut';
import { AnimatePresence, motion } from 'framer-motion';

const CartPage = () => {
  const [roulette, setRoulette] = useState(false);
  const [gotoCheckout, setGotoCheckout] = useState(false);
  return (
    <div className='h-[100vh] w-[100vw] flex items-center relative overflow-x-hidden p-3 lg:p-5 xl:p-10 gap-5 select-none overflow-hidden bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/70 before:backdrop-blur-lg'>
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
                <div className='flex flex-col w-full xl:w-6/7 h-full pt-12 lg:pt-16'>
                <motion.h1 
                    initial={{x:-200, opacity:0}}
                    animate={{x:0, opacity:1}}
                    exit={{x:-200, opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                className='w-full text-3xl text-center lg:text-4xl lg:text-left font-bold'
                >Cart
                </motion.h1>
                <motion.p
                    initial={{x:-200, opacity:0}}
                    animate={{x:0, opacity:1}}
                    exit={{x:-200, opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                    className='w-full text-center lg:text-left'
                >You have <strong className='font-extrabold'>3 items</strong> in your cart.
                </motion.p>
                <div className='w-full xl:w-[95%] lg:ml-auto h-3/5 lg:h-full max-h-[90%] flex flex-col lg:flex-row gap-3 mt-3 lg:mt-5'>
                    <motion.div 
                        initial={{x:-200, opacity:0}}
                        animate={{x:0, opacity:1}}
                        exit={{x:-200, opacity:0}}
                        transition={{type:'spring', stiffness:100, damping:20, delay: 0.3}}
                        className='h-full w-full lg:w-5/7 flex flex-col items-center border border-black/20 rounded-xl p-5 pr-0 gap-3 bg-white/50 backdrop-blur-sm'
                    >
                        <div className='hidden w-full lg:grid grid-cols-5 text-sm text-dark-blue font-extrabold uppercase border-b border-black/20 pb-3 mr-5'>
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
                        className='min-h-2/5 lg:h-full w-full lg:w-2/7 flex flex-col items-center border border-black/20 rounded-xl bg-white/50 backdrop-blur-sm'
                    >
                        <h2 className='w-full text-left text-base lg:text-xl font-bold p-3 px-5 border-b border-black/20'>Order Summary</h2>
                        <div className='h-full w-full flex flex-col p-3 lg:p-5 lg:gap-3'>
                            <div className='w-full flex justify-between text-sm lg:text-base'>
                                <span className='font-semibold'>Quantity</span>
                                <span className='font-extrabold text-base lg:text-lg text-dark-blue'>3</span>
                            </div>
                            <div className='w-full flex justify-between text-sm lg:text-base'>
                                <span className='font-semibold'>Subtotal</span>
                                <span className='font-extrabold text-base lg:text-lg text-dark-blue'><span className='text-base'>₱</span> 7,500.00</span>
                            </div>
                            <div className='w-full flex justify-between border-t border-black/20 pt-3'>
                                <span className='font-bold  text-base lg:text-xl'>Total</span>
                                <span className='font-extrabold text-lg lg:text-2xl text-dark-blue'><span className='text-base'>₱</span> 7,500.00</span>
                            </div>
                            <button type="button" className='w-full mt-auto bg-dark-blue hover:bg-violet focus:bg-violet text-white font-bold py-3 rounded-lg ease-out duration-200' onClick={() => setGotoCheckout(true)}>Proceed to Checkout</button>
                        </div>
                    </motion.div>
                </div>
                </div>
                <div className='hidden h-[95%] mt-16 w-1/7 xl:flex flex-col items-center border border-black/20'>
                {/* Adds Here */}
                </div>
            </motion.div>
        )}
        </AnimatePresence>
        
    </div>
  )
}

export default CartPage