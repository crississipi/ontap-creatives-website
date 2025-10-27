"use client"

import React, { useState } from 'react'
import { HiCheck, HiMinus, HiPlus } from 'react-icons/hi'
import Image from 'next/image'

interface CartItem {
  cartID: number;
  productID: number;
  clientID: number;
  quantity: number;
  subtotal: number;
  logo: string;
  status: string;
  dateAdded: string;
  product: {
    name: string;
    price: number;
    customPrice: number;
    imgUrl?: string;
    frontUrl?: string;
  };
}

interface CartSlipProps {
  item: CartItem;
  selected: boolean;
  onSelect: () => void;
  onQuantityUpdate: (newQuantity: number) => void;
  onRemove: () => void;
}

const CartSlip = ({ item, selected, onSelect, onQuantityUpdate, onRemove }: CartSlipProps) => {
  const [qty, setQty] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const officialPrice = item.logo === 'OnTap' ? item.product.price : item.product.customPrice;

  // Debounced quantity change handler
  const handleQuantityChange = (newQty: number) => {
    if (isUpdating) return;
    
    // Validate minimum quantity
    if (newQty < 1) return;
    
    setIsUpdating(true);
    
    // Update quantity immediately for responsive UI
    setQty(newQty);
    onQuantityUpdate(newQty);
    
    // Set timeout to prevent spam clicking (300ms buffer)
    setTimeout(() => {
      setIsUpdating(false);
    }, 700);
  };

  // Input change handler with debouncing
  const handleInputChange = (value: string) => {
    if (isUpdating) return;
    
    const newQty = parseInt(value, 10);
    
    if (isNaN(newQty) || newQty < 1) return;
    
    setIsUpdating(true);
    setQty(newQty);
    
    // Set timeout to prevent rapid input changes
    setTimeout(() => {
      setIsUpdating(false);
    }, 500); // Slightly longer for input to account for typing
  };

  function inPeso(num: number, locale = 'en-US') {
    return num.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return (
    <>
      <div className='h-max md:min-h-32 md:max-h-32 w-full py-3 lg:p-3 gap-3 border-b border-black/10 grid grid-cols-2 md:grid-cols-6 relative'>
        <div className='col-span-full md:col-span-4 flex xl:pr-12'>
          <span className='w-10 h-full flex items-center'>
            <button 
              type="button" 
              className={`w-6 aspect-square rounded-sm flex items-center justify-center border border-black/50 hover:bg-blue ${selected && 'bg-violet text-white'} ease-out duration-200`} 
              onClick={onSelect}
            >
              {selected && (<HiCheck />)}
            </button>
          </span>
          <div className='h-full flex gap-3'>
            <span className='h-16 md:h-full min-w-24 max-w-24 bg-neutral-400 flex'>
              {item.product.imgUrl ? (
                <Image
                  src={item.product.imgUrl}
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : 
              item.product.frontUrl ? (
                <span className='w-full aspect-[3/2] rounded-md overflow-hidden flex items-center justify-center my-auto'>
                    <Image
                    src={item.product.frontUrl}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                    draggable={false}
                    />
                </span>
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}
            </span>
            <span className='flex flex-col w-full text-left'>
              <h2 className='text-base font-semibold mb-auto'>{item.product.name}</h2>
              <p className='text-neutral-700 text-sm mt-1'>Price: <strong>{item.product.price === 0 ? 'Upon Inquiry' : `₱${inPeso(officialPrice)}`}</strong></p>
              <span className='text-neutral-700 text-sm -mt-1 truncate'>Logo: <strong>{item.logo}</strong></span>
            </span>
          </div>
        </div>
        <span className='col-span-1 h-full relative flex items-center justify-end md:justify-center z-30 font-extrabold text-sm text-dark-blue'>
            {isUpdating && (
                <div className="w-5 h-5 border-2 border-dark-blue border-t-transparent rounded-full animate-spin absolute top-1/2 left-1/2 -translate-1/2"></div>
            )}
            <button 
                type="button" 
                className='p-1.5 rounded-md border border-black/5 hover:border-black/70 focus:bg-violet focus:text-white ease-out duration-200 disabled:opacity-50' 
                onClick={() => handleQuantityChange(qty - 1)}
                disabled={isUpdating || qty <= 1}
            >
                <HiMinus />
            </button>
            <input 
                type="number" 
                value={qty} 
                onChange={(e) => handleInputChange(e.target.value)} 
                className={`w-10 text-center text-base ${isUpdating && 'text-neutral-500'}`}
                min="1"
                disabled={isUpdating}
            />
            <button 
                type="button" 
                className='p-1.5 rounded-md border border-black/5 hover:border-black/70 focus:bg-violet focus:text-white ease-out duration-200 disabled:opacity-50' 
                onClick={() => handleQuantityChange(qty + 1)}
                disabled={isUpdating}
            >
                <HiPlus />
            </button>
            
        </span>
        <span className='col-span-1 h-full flex items-center justify-end md:justify-center font-extrabold text-dark-blue pr-5'>
          <p><span className='text-sm'>₱</span> {inPeso(officialPrice * qty)}</p>
        </span>
      </div>
    </>
  )
}

export default CartSlip