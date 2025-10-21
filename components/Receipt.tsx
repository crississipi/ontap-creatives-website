"use client";

import React, { JSX, useRef, useState } from "react";
import Image from "next/image";
import { RiMapPin2Fill, RiStore3Fill, RiTruckLine } from "react-icons/ri";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";

interface ReceiptProps {
  orderID: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
}

  type PaymentInfo = {
    title: string;
    image: JSX.Element;
    label: string;
    digit: number;
  };

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
                className='w-16 aspect-video object-cover absolute right-3'
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

const Receipt: React.FC<ReceiptProps> = ({ orderID, customerName, items }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const [showBilling, setShowBilling] = useState(false);
  const [modeOfPayment, setModeOfPayment] = useState('ewallet');

  const handleDownload = async () => {
    const element = receiptRef.current;
    if (!element) return;

    // ✅ Dynamically import html2pdf only in the browser
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0.5,
      filename: `receipt-${orderID}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a6", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col gap-4 p-4 select-none w-full h-max relative">
      <div ref={receiptRef} className='h-max w-full top-0 left-0 bg-white flex flex-col'>
        <div className='h-max w-full bg-white flex justify-center'>
          <div className='bg-white w-full h-max flex flex-col items-center justify-center gap-5 relative'>
            <div className="flex flex-col md:w-2/3 xl:w-1/2 2xl:w-1/3 w-full border border-black/10">
              <span className="flex items-center w-full gap-3 p-5">
                <a href="https://ontap.ph">
                  <Image
                    height={2048}
                    width={2048}
                    alt='website logo'
                    src='/images/ontap-logo.png'
                    className='w-20 aspect-square object-contain object-center'
                    draggable={false}
                  />
                </a>
                <span className="ml-auto flex flex-col items-end text-sm font-bold text-dark-blue">
                  <a href="mailto:ontapcreatives@gmail.com">ontapcreatives@gmail.com</a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("BURNBOX PRINTING BFRV BRANCH")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex items-start justify-end gap-1 w-2/3 text-right leading-4'
                  >
                    17 Vatican City Dr, Las Piñas, 1740 Metro Manila
                  </a>
                  <a href="https://ontap.ph" className="uppercase hover:text-dark-blue focus:text-violet ease-out duration-200">On Tap Creatives </a>
                </span>
              </span>
              <span className="w-full flex items-center justify-around pb-5 border-b border-black/10 text-dark-blue">
                <a href="tel:+639177008364" className='font-bold text-sm hover:text-dark-blue focus:text-violet ease-out duration-200'>+63 9177008364</a>•
                <a href="tel:+639764183188" className='font-bold text-sm hover:text-dark-blue focus:text-violet ease-out duration-200'>+63 9764183188</a>•
                <a href="tel:+639764183189" className='font-bold text-sm hover:text-dark-blue focus:text-violet ease-out duration-200'>+63 9764183189</a>
              </span>
              <div className="w-full p-5 gap-5 flex flex-col items-center border-b border-black/10">
                <span className="w-full flex items-center justify-between">
                  <h2 className="text-xl font-bold">Order #10132025112</h2>
                  <span className="flex flex-col items-end text-xs text-neutral-500 font-semibold uppercase">
                    <strong>October 16, 2025</strong>
                    <strong>Thursday • 10:59:20 AM</strong>
                  </span>
                </span>
                <div className="w-full grid grid-cols-2 gap-5 gap-x-2">
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Client Name</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">Juan Dela Cruz</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Company</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">Juan Dela Cruz</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Contact number</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">Juan Dela Cruz</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Email Address</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">Juan Dela Cruz</span>
                  </span>
                  <span className="col-span-full flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Delivery Address</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">Blk 123 Lot 14 Madrigal Street, Las Pinas, Metro Manila, 1103</span>
                  </span>
                </div>
              </div>
              <div className="h-max p-5 gap-3 flex flex-col">
                  <span className='text-base font-bold'>Order Tracking</span>
                    <div className='h-full w-full grid grid-cols-1 md:grid-cols-2 pr-2'>
                      <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                    before:h-3 before:w-3 before:bg-blue before:rounded-xs before:absolute before:z-20 before:left-0 before:top-0
                                    after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-4'>
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>today</strong>
                        <span className='flex flex-col gap-1'>
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
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>yesterday</strong>
                        <span className='flex flex-col gap-0'>
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
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>yesterday</strong>
                        <span className='flex flex-col gap-0'>
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
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>yesterday</strong>
                        <span className='flex flex-col gap-0'>
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
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>yesterday</strong>
                        <span className='flex flex-col gap-0'>
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
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>yesterday</strong>
                        <span className='flex flex-col gap-0'>
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
            <div className="flex flex-col md:w-2/3 xl:w-1/2 2xl:w-1/3 w-full gap-5 relative">
              <div className="h-max w-full border border-black/10 flex flex-col p-5">
                <h2 className="text-xl text-dark-blue font-bold">Items</h2>
                <div className='h-full w-full flex flex-col overflow-x-hidden'>
                  {Array.from({length: 3}).map((_,i) => (
                    <div key={i} className='flex w-full py-3 items-center gap-3 border-b border-white'>
                      <span className='h-20 aspect-square rounded-md bg-light-blue'></span>
                      <span className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className='overflow-ellipsis text-nowrap w-full overflow-hidden'>Carbon Fiber Digital Business Card</h3>
                        <p className='text-xs font-bold uppercase mt-auto'>Logo: <strong className='text-dark-blue font-bold'>OnTap</strong></p>
                        <p className='text-xs font-bold uppercase mb-2'>Color: <strong className='text-dark-blue font-bold'>Default</strong></p>
                      </span>
                      <span className='w-1/2 flex flex-col items-end justify-around'>
                        <p className='text-xs flex items-center gap-1 text-neutral-500'>₱ <strong className='text-base'>999.00</strong></p>
                        <strong className="text-neutral-500">99</strong>
                        <p className='text-xs flex items-center gap-1 text-dark-blue'>₱ <strong className='text-base'>98,901.00</strong></p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full grid grid-cols-2 items-start gap-3">
                <div className="col-span-1 h-full w-full border border-black/10 flex flex-col p-3 justify-between">
                  <span className='text-base font-bold'>Shipping Method</span>
                  <span className='w-full pt-3 flex items-center gap-2'>
                    {true ? (
                    <>
                      <span className='h-12 aspect-square rounded-lg bg-dark-blue text-white items-center justify-center flex text-2xl'>
                        <RiTruckLine />
                      </span>
                      <span className='w-full text-sm flex flex-col md:flex-row items-center justify-between'>
                        <strong className='font-extrabold text-neutral-700 leading-3 md:leading-normal'>Door-to-door Delivery</strong>
                        <span className='text-xs flex items-center gap-1 ml-auto'>₱<strong className='text-base font-extrabold'>250.00</strong></span>
                      </span>
                    </>
                    ) : (
                    <>
                      <span className='h-12 aspect-square rounded-lg bg-dark-blue text-white items-center justify-center flex text-2xl'>
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
                <div className="col-span-1 w-full border border-black/10 flex flex-col">
                  <span className="flex w-full justify-between items-center relative p-3">
                    <span className='text-base font-bold'>Mode of Payment</span>
                    {payment[modeOfPayment].image}
                  </span>
                    {modeOfPayment === 'cod' ? (
                      <span className='flex items-center justify-between w-full mt-3 py-2 px-3 text-white rounded-md bg-dark-blue'>
                        <span className='uppercase font-bold flex text-xs gap-2 items-center'><TbTruckDelivery className='text-2xl'/>cash on delivery</span>
                          <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-lg'>999.00</span></p>
                        </span>
                    ) : (
                      <span className='flex flex-col justify-center w-full bg-dark-blue text-white p-3 pb-1 md:pb-3'>
                          <span className='flex items-center justify-between'>
                            <p className='uppercase text-xs md:text-sm font-bold tracking-wide'>{payment[modeOfPayment].title}</p>
                          </span>
                          <span className='flex flex-col md:flex-row items-end justify-between'>
                            <span className='w-full flex flex-col justify-start'>
                              <span className='flex w-full items-center gap-0.5 '>
                                <strong className="font-extrabold text-sm md:text-base"><span className="text-xs">+63</span> 912 345 6789</strong>
                              </span>
                            </span>
                            <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-lg'>999.00</span></p>
                        </span>
                      </span>
                    )}
                </div>
              </div>
              <div className="w-full h-full border border-black/10 flex flex-col pt-3">
                                            <span className='text-base font-bold pl-3'>Summary</span>
                            <div className='w-full flex flex-col mt-5'>
                                <span className='w-full flex items-center justify-between px-5'>
                                    <strong className='font-extrabold'>Subtotal</strong>
                                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>98,901.00</strong></span>
                                </span>
                                <span className='w-full flex items-center justify-between px-5'>
                                    <strong className='font-extrabold'>Delivery Fee</strong>
                                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>250.00</strong></span>
                                </span>
                                <span className='w-full flex items-center justify-between gap-2 pb-5 px-5'>
                                    <strong className='font-extrabold'>Discount</strong>
                                    <strong className='mr-auto font-semibold text-sm'>(10% less)</strong>
                                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>9,890.10</strong></span>
                                </span>
                                <span className='w-full flex items-center justify-between py-2 px-5 bg-dark-blue text-white'>
                                    <strong className='font-extrabold'>Total</strong>
                                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>89,260.90</strong></span>
                                </span>
                            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;