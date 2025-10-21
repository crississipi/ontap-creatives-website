"use client";

import { AnimatePresence, motion } from 'framer-motion';
import React, { JSX, useRef, useState } from 'react';
import { RiCloseLine, RiCustomerService2Fill, RiStore3Fill, RiTruckLine } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';
import Image from 'next/image';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { MdOutlineSaveAlt } from 'react-icons/md';
import { HiOutlineX } from 'react-icons/hi';
import ReceiptTemplate from './ReceiptTemplate';

  type PaymentInfo = {
    title: string;
    image: JSX.Element;
    label: string;
    digit: number;
  };
  
  interface ReceiptProps {
    orderID: string;
    customerName: string;
    items: { name: string; qty: number; price: number }[];
  }

  const payment: Record<string, PaymentInfo> = {
    "cod" : 
        { title: '', 
          image: <></>, 
          label: '', 
          digit: 0
        },
      "credit" : 
          { title: 'credit/debit', 
          image: 
            <Image 
              height={2048}
              width={2048}
              src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg' 
              alt="PayPal Logo" 
              className='h-7 w-auto object-cover'
            />, 
          label: 'Card Number', 
          digit: 19 
          },
      "ewallet" :
          { title: 'e-wallet',
            image: 
              <Image 
                height={2048}
                width={2048}
                src='/icons/gcash-logo.png' 
                alt="E-wallet Logo" 
                className='w-12 aspect-video object-cover bg-white'
              />,
            label: 'Number',
            digit: 11
          },
      "bank" : 
          { title: 'bank transfer',
            image: 
              <Image 
                height={2048}
                width={2048}
                src='/icons/bdo.png' 
                alt="Bank Logo" 
                className='h-3 w-auto object-cover'
              />,
            label: 'Account Number',
            digit: 10
          }
  }

const OrderPage: React.FC<ReceiptProps> = ({ orderID, customerName, items }) => {
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(true);
  
  const [modeOfPayment, setModeOfPayment] = useState('ewallet');

  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    if (!receiptRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = receiptRef.current.cloneNode(true) as HTMLElement;
    element.style.display = "block";

    const opt = {
        margin: 0.5,
        filename: `receipt-${orderID}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className='h-[100vh] w-full flex flex-col items-center relative overflow-x-hidden p-3 lg:p-10 lg:pt-20 lg:pr-5 gap-5 select-none lg:overflow-hidden bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/70 before:backdrop-blur-xl'>
        <motion.h1 
            initial={{x:-200, opacity:0}}
            animate={{x:0, opacity:1}}
            exit={{x:-200, opacity:0}}
            transition={{type:'spring', stiffness:100, damping:20}}
            className='w-full text-left text-2xl xl:text-4xl font-bold z-50'
        >Orders
        </motion.h1>
        <div className='w-full h-full grid grid-cols-1 lg:grid-cols-7 gap-5 z-50 relative'>
            <div className='col-span-full lg:col-span-2 flex flex-col xl:p-5 w-full xl:h-[95%] overflow-x-hidden'>
                <span className='font-extrabold text-neutral-500 text-sm uppercase'>Ongoing</span>
                {Array.from({length: 3}).map((_,i) => (
                    <button key={i} type='button' className='w-full border-b border-neutral-200 flex gap-3 p-3 hover:bg-light-blue/30 focus:bg-light-blue ease-out duration-200' onClick={() => setShowOrderInfo(true)}>
                        <span className='h-12 xl:h-14 aspect-square rounded-xl bg-blue'></span>
                        <span className='py-2 flex flex-col items-start justify-center leading-4'>
                            <h3 className='font-extrabold w-full flex items-center justify-between'>#10132025112</h3>
                            <p className='text-sm'>October 12, 2025</p>
                        </span>
                        <span className='ml-auto flex flex-col items-end leading-5 justify-center'>
                            <p className='text-[10px] px-3 rounded-full bg-blue text-white font-bold uppercase'>For Approval</p>
                            <p className='flex items-center gap-1 text-xs'>₱<strong className='font-extrabold text-base'>999.00</strong></p>
                        </span>
                    </button>
                ))}
                <span className='font-extrabold text-neutral-500 text-sm uppercase mt-5'>previous purchase</span>
                {Array.from({length: 3}).map((_,i) => (
                    <button key={i} type='button' className='w-full border-b border-neutral-200 flex gap-3 p-3 hover:bg-light-blue/30 focus:bg-light-blue ease-out duration-200' onClick={() => setShowOrderInfo(true)}>
                        <span className='h-14 aspect-square rounded-xl bg-blue'></span>
                        <span className='py-2 flex flex-col items-start justify-center leading-4'>
                            <h3 className='font-extrabold w-full flex items-center justify-between'>#10132025112</h3>
                            <p className='text-sm'>October 12, 2025</p>
                                
                        </span>
                        <span className='ml-auto flex flex-col items-end leading-5 justify-center'>
                            <p className='text-[10px] px-3 rounded-full bg-violet text-white font-bold uppercase'>Completed</p>
                            <p className='flex items-center gap-1 text-xs'>₱<strong className='font-extrabold text-base'>999.00</strong></p>
                        </span>
                    </button>
                ))}
            </div>
            <AnimatePresence mode='wait'>
                {showOrderInfo && (
                <motion.div 
                    initial={{y: 999}}
                    animate={{y: 0}}
                    exit={{y: 999}}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut'
                    }}
                    className='col-span-full lg:col-span-5 rounded-xl shadow-md shadow-black/20 bg-white lg:bg-white/50 backdrop-blur-xl p-3 lg:p-5 w-full h-full lg:max-h-[95%] overflow-hidden flex flex-col absolute lg:relative'
                >
                    <div className='w-full flex flex-row-reverse lg:flex-row items-center justify-end lg:justify-between gap-3'>
                        <button type="button" className='lg:hidden bg-neutral-50 text-rose-500 p-1 rounded-xl border border-black/20 ml-auto text-2xl hover:bg-rose-300 focus:bg-rose-500 focus:text-white ease-out duration-200' onClick={() => setShowOrderInfo(false)}><HiOutlineX /></button>
                        <span className='flex flex-col'>
                            <h2 className='capitalize font-extrabold text-xl'>order #101420252001</h2>
                            <p className='font-bold text-sm text-neutral-500'>14 Oct 2025 at 10:34 AM</p>
                        </span>
                        <button type="button" className='py-2 px-2 lg:px-3 rounded-xl border border-dark-blue flex items-center gap-2 text-dark-blue font-bold hover:bg-dark-blue hover:text-white focus:text-white focus:bg-violet ease-out duration-200' onClick={handleDownload}><MdOutlineSaveAlt className='text-xl'/> <span className='hidden lg:block'>Download E-Receipt</span></button>
                    </div>
                    <div className='h-full w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-3 overflow-x-hidden px-2 py-3'>
                        <div className='col-span-full xl:col-span-5 h-full flex flex-col gap-3 xl:overflow-hidden px-1'>
                            <div className='h-full max-h-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 overflow-hidden py-3 flex flex-col'>
                                <span className='text-xl font-bold pl-5'>Items</span>
                                <div className='h-full w-full flex flex-col overflow-x-hidden'>
                                    {Array.from({length: 3}).map((_,i) => (
                                        <div key={i} className='flex w-full p-3 items-center gap-3 border-b border-white'>
                                            <span className='h-14 xl:h-20 aspect-square rounded-xl bg-light-blue'></span>
                                            <span className='w-1/2 flex flex-col leading-5'>
                                                <h3 className='overflow-ellipsis text-nowrap w-full overflow-hidden text-sm xl:text-base'>Carbon Fiber Digital Business Card</h3>
                                                <p className='text-xs xl:text-sm'>Logo: <strong className='text-dark-blue'>OnTap</strong></p>
                                                <p className='text-xs xl:text-sm'>Color: <strong className='text-dark-blue'>Default</strong></p>
                                            </span>
                                            <span className='w-1/2 flex flex-col xl:flex-row items-end xl:items-center justify-around'>
                                                <p className='text-xs flex items-center gap-1'>₱ <strong className='text-sm xl:text-base'>999.00</strong></p>
                                                <strong className='text-sm xl:text-base'>99</strong>
                                                <p className='text-xs flex items-center gap-1'>₱ <strong className='text-base'>98,901.00</strong></p>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='h-max w-full flex flex-col lg:flex-row items-center gap-3'>
                                <div className='h-full w-full lg:w-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 overflow-x-hidden p-3'>
                                    <span className='text-base font-bold'>Recepient's Information</span>
                                    <div className='w-full flex flex-col gap-2 pt-5'>
                                        <span className='flex flex-col w-full leading-5'>
                                            <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>name</strong>
                                            <p>Juan Dela Cruz</p>
                                        </span>
                                        <span className='flex flex-col w-full leading-5'>
                                            <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>email</strong>
                                            <p>jdelacruz@gmail.com</p>
                                        </span>
                                        <span className='flex flex-col w-full leading-5'>
                                            <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>contact</strong>
                                            <p>+63 912 345 6789</p>
                                        </span>
                                        <span className='flex flex-col w-full leading-5'>
                                            <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>address</strong>
                                            <p>123 Vermiculate Street, Las Pinas City, Metro Manila, 1002</p>
                                        </span>
                                        <span className='flex flex-col w-full leading-5'>
                                            <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>time availability</strong>
                                            <strong className='uppercase'>08:00 am - 09:00 pm</strong>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className='h-max lg:h-full lg:max-h-[33vh] xl:max-h-[31vh] w-full lg:w-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 p-3 gap-3 flex flex-col xl:overflow-hidden'>
                                    <span className='text-base font-bold'>Order Tracking</span>
                                    <div className='h-max xl:h-full w-full flex flex-col xl:overflow-y-auto overflow-x-hidden pr-2'>
                                    <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                        before:h-3 before:w-3 before:bg-blue before:rounded-xs before:absolute before:z-20 before:left-0 before:top-0
                                        after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-4'>
                                    <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>today</strong>
                                    <span className='flex flex-col gap-2'>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        10:56 AM <span className='text-black font-normal'> ● Mock Up Layout Approved</span>
                                        </strong>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        09:00 AM <span className='text-black font-normal'> ● Mock Up Layout for Approval</span>
                                        </strong>
                                    </span>
                                    </span>
                                    <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                        before:h-3 before:w-3 before:bg-blue before:rounded-full before:absolute before:z-20 before:left-0 before:top-1
                                        after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-5'>
                                    <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>yesterday</strong>
                                    <span className='flex flex-col gap-2'>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        05:28 PM <span className='text-black font-normal'> ● Initial Layout Received</span>
                                        </strong>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        09:00 AM <span className='text-black font-normal'> ● Contacted by Marketing Personnel</span>
                                        </strong>
                                    </span>
                                    </span>
                                    <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                        before:h-3 before:w-3 before:bg-blue before:rounded-full before:absolute before:z-20 before:left-0 before:top-1
                                        after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-5'>
                                    <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>yesterday</strong>
                                    <span className='flex flex-col gap-2'>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        05:28 PM <span className='text-black font-normal'> ● Initial Layout Received</span>
                                        </strong>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        09:00 AM <span className='text-black font-normal'> ● Contacted by Marketing Personnel</span>
                                        </strong>
                                    </span>
                                    </span>
                                    <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                        before:h-3 before:w-3 before:bg-blue before:rounded-full before:absolute before:z-20 before:left-0 before:top-1
                                        after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-5'>
                                    <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>yesterday</strong>
                                    <span className='flex flex-col gap-2'>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        05:28 PM <span className='text-black font-normal'> ● Initial Layout Received</span>
                                        </strong>
                                        <strong className='text-sm font-extrabold text-dark-blue'>
                                        09:00 AM <span className='text-black font-normal'> ● Contacted by Marketing Personnel</span>
                                        </strong>
                                    </span>
                                    </span>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full xl:col-span-2 h-max w-full flex flex-col lg:grid lg:grid-cols-2 xl:flex xl:flex-col gap-3'>
                            <div className='rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold pl-3'>Shipping Method</span>
                                <span className='w-full p-4 flex items-center gap-2'>
                                    {true ? (
                                        <>
                                        <span className='h-12 aspect-square rounded-xl bg-dark-blue text-white items-center justify-center flex text-2xl'>
                                            <RiTruckLine />
                                        </span>
                                        <span className='w-full text-sm flex items-center justify-between'>
                                            <strong className='font-extrabold text-neutral-700'>Door-to-door Delivery</strong>
                                            <span className='text-xs flex items-center gap-1 ml-auto'>₱<strong className='text-base font-extrabold'>250.00</strong></span>
                                        </span>
                                        </>
                                    ) : (
                                        <>
                                        <span className='h-12 aspect-square rounded-xl bg-dark-blue text-white items-center justify-center flex text-2xl'>
                                            <RiStore3Fill />
                                        </span>
                                        <span className='text-sm flex flex-col'>
                                            <strong className='font-extrabold text-neutral-700'>Pick up at Store</strong>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("BURNBOX PRINTING BFRV BRANCH")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='text-xs hover:text-dark-blue focus:underline ease-out duration-200'
                                            >Check Address</a>
                                        </span>
                                        <span className='text-xs flex items-center gap-1 ml-auto'>₱<strong className='text-base font-extrabold'>0.00</strong></span>
                                        </>
                                    )}
                                </span>
                            </div>
                            <div className='rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 p-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold'>Mode of Payment</span>
                                {modeOfPayment === 'cod' ? (
                                    <span className='flex items-center justify-between w-full mt-3 py-2 px-3 text-white rounded-xl bg-dark-blue'>
                                        <span className='uppercase font-bold flex text-xs gap-2 items-center'><TbTruckDelivery className='text-2xl'/>cash on delivery</span>
                                        <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-xl'>999.00</span></p>
                                    </span>
                                ) : (
                                    <span className='flex flex-col justify-center w-full mt-3 py-2 px-3 gap-1 text-white rounded-xl bg-dark-blue'>
                                        <span className='flex items-center justify-between'>
                                            <p className='uppercase text-sm font-bold tracking-wide'>{payment[modeOfPayment].title}</p>
                                            {payment[modeOfPayment].image}
                                        </span>
                                        <span className='flex items-end justify-between gap-5'>
                                            <span className='w-full flex flex-col justify-start'>
                                                <h5 className='text-xs'>{payment[modeOfPayment].label}</h5>
                                                <span className='flex w-full items-center gap-0.5 '>
                                                    {Array.from({ length: payment[modeOfPayment].digit }).map((_,i) => (
                                                        <span key={i} className={`h-5 min-w-1 ${showBilling ? 'text-sm' : 'text-xs'} font-extrabold`}>
                                                            {showBilling ? 
                                                            modeOfPayment === 'credit' ? `${(i+1) % 5 === 0 ? ' ' : `${i%4 + 1}`}`: 
                                                            `${i%4 + 1}`
                                                            : modeOfPayment === 'credit' ? `${(i+1) % 5 === 0 ? ' ' : '●'}` : '●' 
                                                        }
                                                        </span>
                                                    ))}
                                                    <button type="button" className='ml-auto text-xl hover:text-blue focus:text-light-blue ease-out duration-200' onClick={() => setShowBilling(!showBilling)}>
                                                        {!showBilling ? 
                                                        <LuEye /> :
                                                        <LuEyeClosed />
                                                        }
                                                    </button>
                                                </span>
                                            </span>
                                            <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-xl'>999.00</span></p>
                                        </span>
                                    </span>
                                )}
                            </div>
                            <div className='col-span-full rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold pl-3'>Summary</span>
                                <div className='w-full flex flex-col mt-5'>
                                    <span className='w-full flex items-center justify-between px-5'>
                                        <strong className='font-extrabold'>Subtotal</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>98,901.00</strong></span>
                                    </span>
                                    <span className='w-full flex items-center justify-between px-5'>
                                        <strong className='font-extrabold'>Delivery Fee</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>250.00</strong></span>
                                    </span>
                                    <span className='w-full flex items-center justify-between gap-2 pb-5 px-5'>
                                        <strong className='font-extrabold'>Discount</strong>
                                        <strong className='mr-auto font-semibold text-sm'>(10% less)</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>9,890.10</strong></span>
                                    </span>
                                    <span className='w-full flex items-center justify-between py-2 px-5 bg-dark-blue text-white'>
                                        <strong className='font-extrabold'>Total</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>89,260.90</strong></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
        <div className='w-max h-max z-99 absolute bottom-10 right-10 flex flex-col items-end gap-5'>
            <AnimatePresence mode="wait">
                {showCustomerService && (
                    <motion.div 
                    initial={{
                        scale: 0, 
                        x: 75, 
                        y: 225, 
                        opacity: 0
                    }}
                    animate={{
                        scale: 1, 
                        x: 0, 
                        y: 0,
                        opacity: 1
                    }}
                    exit={{
                        scale: 0, 
                        x: 75, 
                        y:225,
                        opacity: 0
                    }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                    className='h-120 w-80 bg-white rounded-3xl border border-black/20 shadow-md shadow-black/30'
                    >

                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button 
            animate={{ scale: [1, 1.01, 1, 1.05, 1.02, 1]}}
            transition={{repeat: Infinity, duration:1, repeatType:'loop'}}
            type="button" 
            className='h-14 aspect-square rounded-full shadow-md shadow-black/30 flex items-center justify-center bg-white text-3xl text-dark-blue hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
            onClick={() => setShowCustomerService(!showCustomerService)}
            >
                {showCustomerService ? (<RiCloseLine />) : (<RiCustomerService2Fill />)}
            </motion.button>
        </div>
        <div ref={receiptRef} className="h-full w-full flex absolute z-9999" style={{display:'none'}}>
            <ReceiptTemplate orderID={'123456'} customerName={''} items={[]}/>
        </div>
    </div>
  )
}

export default OrderPage