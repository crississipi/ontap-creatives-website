import React, { useMemo, useState, useEffect } from 'react'
import { RiArrowLeftLine, RiArrowRightLine, RiInformation2Line } from 'react-icons/ri'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useClickOutside } from '@/hooks';

interface EditOrderProps { 
    showOrderInfo: (orderInfo: boolean) => void;
    order?: any | null; // Using any because the structure is nested and complex
}

const EditOrder = ({ showOrderInfo, order }:EditOrderProps) => {
  const clickOutside = useClickOutside<HTMLDivElement>(() => showOrderInfo(false));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageUrls = useMemo(() => {
    if (!order?.product) return [];
    const urls = [
        order.product.imgUrl,
        order.product.frontUrl,
        order.product.backUrl,
        order.product.variableFrontImg,
        order.product.variableBackImg,
    ].filter(Boolean); // Filter out null, undefined, or empty strings
    return urls as string[];
  }, [order]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [order]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  const formattedDate = useMemo(() => {
    if (!order?.dateOrdered) return 'No date specified';
    try {
        return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.dateOrdered));
    } catch {
        return order.dateOrdered;
    }
  }, [order]);

  const totalAmount = useMemo(() => {
    // This is a placeholder logic. Real discount/fee logic would be needed.
    const subtotal = order?.subtotal ?? 0;
    // Assuming delivery fee and discount are not in the current data model
    return subtotal;
  }, [order]);

  return (
    <motion.div 
        initial={{x: 999}}
        animate={{x: 0}}
        exit={{x: 999}}
        transition={{
            duration: 0.3,
            ease: 'easeOut'
        }}
        ref={clickOutside}
        className='absolute right-0 top-0 w-[85%] md:w-2/3 lg:w-4/7 xl:w-2/3 2xl:w-1/3 h-full bg-white z-50 shadow-lg shadow-black/30 border-l border-black/10 flex flex-col'
    >
        <div className='w-full shadow-md shadow-black/30 border-b border-black/10 grid grid-cols-5'>
            <div className='col-span-full flex flex-col w-full relative'>
                <button type="button" className='absolute top-2 right-2 p-1.5 text-2xl rounded-md hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200 z-10'><RiInformation2Line /></button>
                <div className='h-60 w-full bg-neutral-200 relative flex items-center justify-center'>
                    {imageUrls.length > 1 && (
                      <button onClick={handlePrevImage} type="button" className='absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full hover:bg-light-blue/50 focus:bg-dark-blue/50 focus:text-white backdrop-blur-md ease-out duration-200 p-2 z-10'><RiArrowLeftLine/></button>
                    )}
                    <span className='w-2/3 h-full flex flex-col items-center justify-center gap-3'>
                        <Image
                            height={2048}
                            width={2048}
                            alt={order?.product?.name ?? 'Order image'}
                            src={imageUrls[currentImageIndex] ?? '/images/logo-placeholder.png'}
                            className='w-4/5 lg:w-1/2 2xl:w-2/3 aspect-[3/2] rounded-lg object-cover object-center'
                        />
                        {imageUrls.length > 1 && (
                            <span className='flex gap-2'>
                                {imageUrls.map((_,i) => (
                                    <span key={i} className={`h-2 w-2 rounded-full ${i === currentImageIndex ? 'bg-blue-500' : 'bg-white'}`}></span>
                                ))}
                            </span>
                        )}
                    </span>
                    {imageUrls.length > 1 && (
                      <button onClick={handleNextImage} type="button" className='absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full hover:bg-light-blue/50 focus:bg-dark-blue/50 focus:text-white backdrop-blur-md ease-out duration-200 p-2 z-10'><RiArrowRightLine/></button>
                    )}
                </div>
            </div>
            <span className='col-span-3 w-full flex flex-col p-3'>
                <h3 className='text-xl font-bold'>{order?.transactionID ?? 'N/A'}</h3>
                <p className='text-sm'>{order?.client?.clientName ?? 'Unknown Client'}</p>
            </span>
            <span className='col-span-2 h-full flex items-end justify-end p-2 pr-3'>
                <strong>{formattedDate}</strong>
            </span>
        </div>
        <div className='w-full h-full flex flex-col p-5 gap-3 overflow-y-auto'>   
            <span className='flex flex-col'>
                <strong className='uppercase text-xs font-extrabold text-neutral-500'>Email Address</strong>
                <p className='font-bold'>{order?.client?.email ?? 'N/A'}</p>
            </span>
            <span className='flex flex-col'>
                <strong className='uppercase text-xs font-extrabold text-neutral-500'>Contact Number</strong>
                <p className='font-bold'>{order?.client?.contactNumber ?? 'N/A'}</p>
            </span>
            <span className='flex flex-col'>
                <strong className='uppercase text-xs font-extrabold text-neutral-500'> Address</strong>
                <p className='font-bold'>{order?.client?.address ?? 'N/A'}</p>
            </span>
            <div className='w-full flex flex-col'>
                <h4 className='text-lg col-span-full text-dark-blue mb-1'>Order List</h4>
                {order?.product ? (
                    <div className='w-full grid grid-cols-20 text-sm gap-1 px-3 items-center'>
                        <span className='col-span-8'>{order.product.name}</span>
                        <span className='col-span-5 text-right text-xs font-light'>₱ <strong className='text-sm'>{(order.product.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                        <strong className='col-span-2 text-right'>{order.quantity ?? 1}</strong>
                        <span className='col-span-5 text-right text-xs'>₱ <strong className='text-base'>{(order.subtotal ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500 px-3">No product details available.</p>
                )}
                {/* Note: Delivery Fee and Discount are not in the current data model */}
                <div className='w-full grid grid-cols-10 text-sm gap-3 mt-5 px-3'>
                    <span className='col-span-6'>Delivery Fee</span>
                    <strong className='col-span-1 text-right'></strong>
                    <span className='col-span-3 text-right text-xs'>₱ <strong className='text-base'>N/A</strong></span>
                </div>
                <div className='w-full grid grid-cols-10 text-sm gap-3 px-3'>
                    <span className='col-span-6'>Discount</span>
                    <strong className='col-span-1 text-right'></strong>
                    <span className='col-span-3 text-right text-xs'>₱ <strong className='text-base'>N/A</strong></span>
                </div>
                <div className='w-full grid grid-cols-10 gap-3 mt-5 uppercase font-extrabold text-dark-blue px-3'>
                    <span className='col-span-6'>Total</span>
                    <strong className='col-span-1 text-right'></strong>
                    <span className='col-span-3 text-right text-xs font-normal'>₱ <strong className='text-lg font-extrabold'>{(totalAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></span>
                </div>
            </div>
            <div className='w-full grid grid-cols-2 gap-1 gap-x-3'>
                <h4 className='text-lg col-span-full text-dark-blue'>Payment Info</h4>
                <span className='w-full flex flex-col p-2 rounded-md border border-dark-blue'>
                    <strong className='text-xs uppercase font-extrabold text-neutral-500'>Mode</strong>
                    <span className='font-bold'>{order?.billing?.mode ?? 'N/A'}</span>
                </span>
                <span className='w-full flex flex-col p-2 rounded-md border border-dark-blue'>
                    <strong className='text-xs uppercase font-extrabold text-neutral-500'>Amount</strong>
                    <p className='font-bold text-sm'>₱ <span className='text-base'>{(order?.billing?.amount ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
                </span>
            </div>
        </div>
    </motion.div>
  )
}

export default EditOrder