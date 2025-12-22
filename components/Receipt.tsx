"use client";

import React, { JSX, useRef } from "react";
import Image from "next/image";
import { RiStore3Fill, RiTruckLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

interface ReceiptProps {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: {
    imgUrl: string;
    frontImg: string;
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    logo: string;
  }[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
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

const Receipt: React.FC<ReceiptProps> = ({ 
  orderID, 
  customerName, 
  companyName, 
  contactNumber, 
  email, 
  deliveryAddress, 
  items, 
  shippingMethod, 
  shippingFee, 
  paymentMethod, 
  discount, 
  subtotal, 
  total, 
  orderDate 
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      })
    };
  };

  const formattedDate = formatDate(orderDate);

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 select-none w-full h-max relative mt-20">
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
                  <h2 className="text-xl font-bold">Order #{orderID}</h2>
                  <span className="flex flex-col items-end text-xs text-neutral-500 font-semibold uppercase">
                    <strong>{formattedDate.fullDate}</strong>
                    <strong>{formattedDate.weekday} • {formattedDate.time}</strong>
                  </span>
                </span>
                <div className="w-full grid grid-cols-2 gap-5 gap-x-2">
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Client Name</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">{customerName}</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Company</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">{companyName || 'N/A'}</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Contact number</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">{contactNumber}</span>
                  </span>
                  <span className="flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">Email Address</p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">{email}</span>
                  </span>
                  <span className="col-span-full flex flex-col w-full">
                    <p className="text-xs uppercase font-bold text-neutral-400">
                      {shippingMethod === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                    </p>
                    <span className="px-3 py-2 rounded-md bg-neutral-50 font-bold">{deliveryAddress}</span>
                  </span>
                </div>
              </div>
              
              {/* Order Tracking Section - You can implement actual tracking logic later */}
              <div className="h-max p-5 gap-3 flex flex-col">
                  <span className='text-base font-bold'>Order Tracking</span>
                    <div className='h-full w-full grid grid-cols-1 md:grid-cols-2 pr-2'>
                      <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                    before:h-3 before:w-3 before:bg-blue before:rounded-xs before:absolute before:z-20 before:left-0 before:top-0
                                    after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-4'>
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>today</strong>
                        <span className='flex flex-col gap-1'>
                          <strong className='text-sm font-extrabold text-dark-blue'>
                                    {formattedDate.time} <span className='text-black font-normal'> ● Order Placed Successfully</span>
                          </strong>
                          <strong className='text-sm font-extrabold text-dark-blue'>
                                    09:00 AM <span className='text-black font-normal'> ● Payment Confirmed</span>
                          </strong>
                        </span>
                      </span>
                      <span className='h-max w-full flex flex-col pl-5 py-3 relative 
                                    before:h-3 before:w-3 before:bg-blue before:rounded-full before:absolute before:z-20 before:left-0 before:top-1
                                    after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-5'>
                        <strong className='uppercase font-extrabold text-xs text-neutral-500 -mt-3'>next steps</strong>
                        <span className='flex flex-col gap-0'>
                          <strong className='text-sm font-extrabold text-dark-blue'>
                                    Processing <span className='text-black font-normal'> ● Order Being Processed</span>
                          </strong>
                          <strong className='text-sm font-extrabold text-dark-blue'>
                                    Pending <span className='text-black font-normal'> ● Ready for {shippingMethod === 'delivery' ? 'Delivery' : 'Pickup'}</span>
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
                  {items.map((item, index) => (
                    <div key={index} className='flex w-full py-3 items-center gap-3 border-b border-white'>
                      <span className='h-20 aspect-square rounded-md bg-light-blue flex items-center justify-center text-xs text-gray-600'>
                        <img src={item.frontImg || item.imgUrl} alt="product image" className="w-full aspect-3/2 rounded-md overflow-hidden"/>
                      </span>
                      <span className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className='overflow-ellipsis text-nowrap w-full overflow-hidden font-bold'>{item.name}</h3>
                        <p className='text-xs font-bold uppercase mt-auto'>Logo: <strong className='text-dark-blue font-bold'>{item.logo}</strong></p>
                      </span>
                      <span className='w-1/2 flex flex-col items-end justify-around'>
                        <p className='text-xs flex items-center gap-1 text-neutral-500'>₱ <strong className='text-base'>{formatCurrency(item.price)}</strong></p>
                        <strong className="text-neutral-500">{item.qty}</strong>
                        <p className='text-xs flex items-center gap-1 text-dark-blue'>₱ <strong className='text-base font-extrabold'>{formatCurrency(item.subtotal)}</strong></p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full grid grid-cols-2 items-start gap-3">
                <div className="col-span-1 h-full w-full border border-black/10 flex flex-col p-3 justify-between">
                  <span className='text-base font-bold'>Shipping Method</span>
                  <span className='w-full pt-3 flex items-center gap-2'>
                    {shippingMethod === 'delivery' ? (
                    <>
                      <span className='h-12 aspect-square rounded-lg bg-dark-blue text-white items-center justify-center flex text-2xl'>
                        <RiTruckLine />
                      </span>
                      <span className='w-full text-sm flex flex-col md:flex-row items-center justify-between'>
                        <strong className='font-extrabold text-neutral-700 leading-3 md:leading-normal'>Door-to-door Delivery</strong>
                        <span className='text-xs flex items-center gap-1 ml-auto'>₱<strong className='text-base font-extrabold'>{formatCurrency(shippingFee)}</strong></span>
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
                    {payment[paymentMethod]?.image || <></>}
                  </span>
                    {paymentMethod === 'cod' ? (
                      <span className='flex items-center justify-between w-full mt-3 py-2 px-3 text-white rounded-md bg-dark-blue'>
                        <span className='uppercase font-bold flex text-xs gap-2 items-center'><TbTruckDelivery className='text-2xl'/>cash on delivery</span>
                          <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-lg'>{formatCurrency(total)}</span></p>
                        </span>
                    ) : (
                      <span className='flex flex-col justify-center w-full bg-dark-blue text-white p-3 pb-1 md:pb-3'>
                          <span className='flex items-center justify-between'>
                            <p className='uppercase text-xs md:text-sm font-bold tracking-wide'>{payment[paymentMethod]?.title || paymentMethod}</p>
                          </span>
                          <span className='flex flex-col md:flex-row items-end justify-between'>
                            <span className='w-full flex flex-col justify-start'>
                              <span className='flex w-full items-center gap-0.5 '>
                                <strong className="font-extrabold text-sm md:text-base">{paymentMethod.toUpperCase()} Payment</strong>
                              </span>
                            </span>
                            <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-lg'>{formatCurrency(total)}</span></p>
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
                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>{formatCurrency(subtotal)}</strong></span>
                  </span>
                  <span className='w-full flex items-center justify-between px-5'>
                    <strong className='font-extrabold'>Delivery Fee</strong>
                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>{formatCurrency(shippingFee)}</strong></span>
                  </span>
                  {discount > 0 && (
                    <span className='w-full flex items-center justify-between gap-2 pb-5 px-5'>
                      <strong className='font-extrabold'>Discount</strong>
                      <strong className='mr-auto font-semibold text-sm'>
                        ({Math.round((discount / subtotal) * 100)}% less)
                      </strong>
                      <span className='text-sm flex items-center gap-1'>-₱<strong className='font-extrabold text-lg'>{formatCurrency(discount)}</strong></span>
                    </span>
                  )}
                  <span className='w-full flex items-center justify-between py-2 px-5 bg-dark-blue text-white'>
                    <strong className='font-extrabold'>Total</strong>
                    <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-lg'>{formatCurrency(total)}</strong></span>
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