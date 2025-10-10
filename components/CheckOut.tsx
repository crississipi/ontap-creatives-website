"use client"

import React, { useEffect, useState } from 'react'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import ContactNum from './ContactNum'
import Image from 'next/image'
import { FaHandHoldingDollar, FaTruckRampBox } from 'react-icons/fa6'
import { RiDiscountPercentFill, RiMapPin2Fill, RiStore2Line, RiTruckLine } from 'react-icons/ri'
import { AnimatePresence, motion } from 'framer-motion'

function useTimeout(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
}

interface CheckOutProps {
    setGotoCheckout: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckOut = ({setGotoCheckout}: CheckOutProps) => {
  const [modeOfPayment, setModeOfPayment] = React.useState<'cod' | 'card' | 'ewallet'>('cod');
  const [shippingMethod, setShippingMethod] = React.useState<'pickup' | 'delivery' | null>(null);
  const [showGif, setShowGif] = useState<"pickup" | "delivery" | null>(null);
  const [doubleCheck, setDoubleCheck] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);

  // Hide GIF after 3 seconds
  useTimeout(() => setShowGif(null), showGif ? 2000 : null);

  const handleClick = (method: "pickup" | "delivery") => {
    setShippingMethod(method);
    setShowGif(method);
  };

  return (
    <div className='h-full w-full flex flex-col pb-0 pl-0 pr-5 gap-5 select-none overflow-hidden z-50 pt-16'>
        <motion.div 
            initial={{x:-200, opacity:0}}
            animate={{x:0, opacity:1}}
            exit={{x:-200, opacity:0}}
            transition={{type:'spring', stiffness:100, damping:20}}
            className='flex gap-3 items-center'
        >
            <button type="button" className='text-2xl p-2 py-1 rounded-md border border-transparent hover:border-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setGotoCheckout(false)}><HiOutlineArrowNarrowLeft /></button>
            <h1 
            className='w-full text-left text-4xl font-bold'>Checkout</h1>
        </motion.div>
        <div className='h-full max-h-[95%] w-full flex gap-3 pl-20 pb-10'>
            <motion.div 
                initial={{x:-200, opacity:0}}
                animate={{x:0, opacity:1}}
                exit={{x:-200, opacity:0}}
                transition={{type:'spring', stiffness:100, damping:20, delay: 0.3}}
                className='h-full w-2/5 grid grid-cols-2 gap-3 p-5 overflow-x-hidden'
            >
                <h2 className='col-span-full font-black text-lg'>Contact Information</h2>
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>First Name</label>
                    <input type="text" placeholder='First Name' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                </span>
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Last Name</label>
                    <input type="text" placeholder='Last Name' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                </span>
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Company Name</label>
                    <input type="text" placeholder='Company Name' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                </span>
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Contact Number</label>
                    <ContactNum />
                </span>
                <span className='flex flex-col col-span-full gap-1'>
                    <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Email Address</label>
                    <input type="email" placeholder='Email Address' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                </span>
                <h2 className='col-span-full font-black text-lg mt-5'>Shipping Method</h2>
                <div className='col-span-full flex gap-3'>
                    {/* Pickup Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`h-11 max-h-11 min-w-36 rounded-md border flex items-center gap-3 transition-colors overflow-hidden duration-200 ${
                        shippingMethod === "pickup" ? `border-light-blue ${showGif === "pickup" ? 'bg-white' : 'bg-violet'} text-white` : "border-black/30"
                        }`}
                        onClick={() => handleClick("pickup")}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                        {showGif === "pickup" ? (
                            <motion.div
                            key="pickup-gif"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 w-full justify-center bg-white h-full"
                            >
                            <Image
                                height={2048}
                                width={2048}
                                alt="Store Pickup Animation"
                                src="/icons/shop-dynamic.gif"
                                className="h-10 w-10 object-cover"
                            />
                            </motion.div>
                        ) : (
                            <motion.div
                            key="pickup-static"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 px-3"
                            >
                            <RiStore2Line className="text-xl" />
                            <p className="font-extrabold text-sm">Store Pickup</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Delivery Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`h-11 max-h-11 min-w-52 rounded-md border flex items-center gap-3 transition-colors overflow-hidden duration-200 ${
                        shippingMethod === "delivery" ? `border-light-blue ${showGif === "delivery" ? 'bg-white' : 'bg-violet'} text-white` : "border-black/30"
                        }`}
                        onClick={() => handleClick("delivery")}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                        {showGif === "delivery" ? (
                            <motion.div
                            key="delivery-gif"
                            initial={{ x: -180 }}
                            animate={{ x: -180 }}
                            exit={{ x: 200 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 bg-gradient-to-l from-white via-white to-transparent min-w-[200%] h-full justify-center"
                            >
                            <Image
                                height={2048}
                                width={2048}
                                alt="Delivery Animation"
                                src="/icons/deliver-dynamic.gif"
                                className="h-11 w-11 object-cover mb-3"
                            />
                            </motion.div>
                        ) : (
                            <motion.div
                            key="delivery-static"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 px-3"
                            >
                            <RiTruckLine className="text-xl" />
                            <p className="font-extrabold text-sm">Door-to-Door Delivery</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </motion.button>
                </div>
                {shippingMethod === "delivery" && (
                    <div className='col-span-full grid grid-cols-6 gap-3'>
                        <h3 className='col-span-full font-black mt-3'>Drop-off Details</h3>
                        <span className='flex flex-col col-span-full gap-1'>
                            <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>House No., Street Name, Village</label>
                            <input type="text" placeholder='Blk. Lot, Street, Village' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                        <span className='flex flex-col col-span-3 gap-1'>
                            <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>baranggay</label>
                            <input type="text" placeholder='Baranggay' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                        <span className='flex flex-col col-span-3 gap-1'>
                            <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>City</label>
                            <input type="text" placeholder='City' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                        <span className='flex flex-col col-span-2 gap-1'>
                            <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>region</label>
                            <input type="text" placeholder='Region' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                        <span className='flex flex-col col-span-1 gap-1'>
                            <label htmlFor="" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>zip code</label>
                            <input type="text" placeholder='Zip Code' className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                        <span className='grid grid-cols-2 col-span-3 gap-1'>
                            <label htmlFor="" className='col-span-full uppercase tracking-wide text-xs font-extrabold text-dark-blue'>time availability</label>
                            <input type="time" placeholder='Company Name' className='col-span-1 px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                            <input type="time" placeholder='Company Name' className='col-span-1 px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'/>
                        </span>
                    </div>
                )}
                {shippingMethod === "pickup" && (
                    <div className='col-span-full flex flex-col gap-1 mt-3 p-3 rounded-md bg-light-blue/30 shadow-md shadow-black/10'>
                        <h4>Our Store Address</h4>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("BURNBOX PRINTING BFRV BRANCH")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='flex items-center gap-1 mb-2'
                        >
                            <RiMapPin2Fill className='text-2xl text-rose-500'/> 17 Vatican City Dr, Las Piñas, 1740 Metro Manila
                        </a>
                        <h4>Operating Hours</h4>
                        <p>Monday to Sunday, <strong>9:00 AM to 6:00 PM</strong></p>
                    </div>
                )}
                <h2 className='col-span-full font-black text-lg mt-5'>Payment Method</h2>
                <button type="button" className={`col-span-1 px-3 py-2 gap-2 rounded-md border ${modeOfPayment === 'cod' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold`} onClick={() => setModeOfPayment('cod')}>
                    Cash on Delivery
                    <FaHandHoldingDollar className={`ml-auto text-xl ${modeOfPayment === 'cod' ? 'text-white': 'text-dark-blue'}`}/>
                    <FaTruckRampBox className={`text-xl ${modeOfPayment === 'cod' ? 'text-white': 'text-dark-blue'}`}/>
                </button>
                <button type="button" className={`col-span-1 px-3 py-2 rounded-md border ${modeOfPayment === 'card' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold`} onClick={() => setModeOfPayment('card')}>Credit / Debit Card
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal Logo" className='h-7 w-auto'/>
                </button>
                <button type="button" className={`col-span-1 px-3 py-2 rounded-md border ${modeOfPayment === 'ewallet' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold`}  onClick={() => setModeOfPayment('ewallet')}>
                    E-Wallet
                    <Image
                        height={2048}
                        width={2048}
                        alt='Gcash Logo'
                        src="/icons/gcash-logo.png"
                        className='ml-auto h-7 w-16 object-cover object-center'
                    />
                    <Image
                        height={2048}
                        width={2048}
                        alt='Gcash Logo'
                        src="/icons/paymaya-logo.png"
                        className='h-7 w-auto object-contain object-center'
                    />
                </button>
            </motion.div>
            <motion.div 
                initial={{y:500, opacity:0}}
                animate={{y:0, opacity:1}}
                exit={{y:500, opacity:0}}
                transition={{type:'spring', stiffness:100, damping:20}}
            className='h-full w-1/3 border border-black/20 rounded-xl shadow-lg shadow-transparent p-5 ml-32 flex flex-col gap-3 hover:shadow-black/30 ease-out duration-200'
            >
                <h2 className='text-xl font-extrabold'>Order Summary</h2>
                <div className='w-full min-h-2/5 max-h-3/5 flex flex-col items-center overflow-x-hidden border border-black/10 rounded-lg'>
                    {Array.from({length: 3}).map((_,i) => (
                        <div key={i} className='h-24 w-full p-3 flex items-center gap-3 z-50 border-b border-black/10 last:border-0'>
                            <Image
                                height={2048}
                                width={2048}
                                alt='Item Image'
                                src={'/images/card-2/front.png'}
                                className='h-4/5 w-auto aspect-[3/2] rounded-md object-cover object-center'
                            />
                            <span className='flex flex-col w-auto'>
                                <p className='font-extrabold'>Carbon Fiber Digital Business Card</p>
                                <p className='text-xs px-2 py-1 rounded-full bg-dark-blue text-white w-max'>OnTap Logo</p>
                            </span>
                            <span className='flex flex-col ml-auto items-end justify-center'>
                                <h4 className='text-xs font-semibold text-neutral-700'>₱ <span className='text-sm'>999.00</span></h4>
                                <p className='text-sm text-neutral-700'>x <strong>99</strong></p>
                                <h3 className='text-xs text-dark-blue'>₱ <span className='text-base font-extrabold'>98,901.00</span></h3>
                            </span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col h-full w-full'>
                    <span className='flex gap-3 items-center text-sm'>
                        <span className='ml-auto w-2/5 px-3 py-2 rounded-md border border-black/30 flex items-center gap-3 hover:border-blue ease-out duration-200'>
                            <RiDiscountPercentFill className='text-2xl text-violet'/>
                            <input type="text" placeholder='VOUCHER CODE' className='w-full uppercase tracking-widest placeholder:tracking-normal'/>
                        </span>
                        <button type="button" className='px-5 py-2.5 rounded-md bg-blue text-white hover:bg-violet focus:bg-dark-blue ease-out duration-200'>Apply</button>
                    </span>
                    <div className='w-full flex flex-col gap-3 mt-10'>
                        <span className='flex items-center justify-between'>
                            <p className='font-bold text-neutral-700'>Subtotal</p>
                            <h5 className='font-black text-dark-blue'>₱ <span className='text-lg'>296,703.00</span></h5>
                        </span>
                        <span className='flex items-center justify-between'>
                            <p className='font-bold text-neutral-700'>Shipping Fee</p>
                            <h5 className='font-black text-dark-blue'>₱ <span className='text-lg'>150.00</span></h5>
                        </span>
                        <span className='flex items-center justify-between'>
                            <p className='font-bold text-neutral-700'>Discount <strong className='font-black'>(-10%)</strong></p>
                            <h5 className='font-black text-dark-blue'>-₱ <span className='text-lg'>29,670.30</span></h5>
                        </span>
                        <span className='flex items-center justify-between'>
                            <p className='font-extrabold text-neutral-700 text-lg'><strong>Total</strong></p>
                            <h5 className='font-black text-dark-blue text-xl'>₱ <span className='text-2xl'>267,182.70</span></h5>
                        </span>
                    </div>
                </div>
                <button
                type="button"
                className={`py-3 rounded-md w-full ${
                    !doubleCheck || (agreeTerms && confirmDetails)
                    ? 'bg-dark-blue text-white hover:bg-blue focus:bg-violet ease-out duration-200'
                    : 'bg-neutral-400 text-neutral-600 no-cursor'
                }`}
                disabled={doubleCheck && (!agreeTerms || !confirmDetails)}
                onClick={() => {
                    if (!doubleCheck) {
                    setDoubleCheck(true);
                    } else if (agreeTerms && confirmDetails) {
                    alert('Purchase Completed!');
                    } else {
                    alert('Please agree to the terms and confirm your details.');
                    }
                }}
                >
                Complete Purchase
                </button>

                {doubleCheck && (
                <>
                    <div className='flex items-center gap-1'>
                    <input
                        type='checkbox'
                        className='h-5 w-5'
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className='text-sm text-neutral-700'>
                        By placing your order, you agree to our{' '}
                        <strong className='underline'>Terms of Service</strong> and{' '}
                        <strong className='underline'>Privacy Policy</strong>.
                    </span>
                    </div>

                    <div className='flex items-center gap-1'>
                    <input
                        type='checkbox'
                        className='h-5 w-5'
                        checked={confirmDetails}
                        onChange={(e) => setConfirmDetails(e.target.checked)}
                    />
                    <span className='text-sm text-neutral-700'>
                        I confirm that all the information I have provided is true, complete, and accurate.
                    </span>
                    </div>
                </>
                )}
            </motion.div>
        </div>
    </div>
  )
}

export default CheckOut