"use client"

import React, { useState } from 'react'
import { HiCheck, HiMinus, HiOutlineTrash, HiPlus } from 'react-icons/hi'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Debounced quantity change handler
  const handleQuantityChange = (newQty: number) => {
    if (isUpdating) return;
    
    // Validate minimum quantity
    if (newQty < 1) return;
    
    setIsUpdating(true);
    
    // Update quantity immediately for responsive UI
    setQty(newQty);
    
    // Set timeout to prevent spam clicking (300ms buffer)
    setTimeout(() => {
      setIsUpdating(false);
    }, 300);
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

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    onRemove();
    setShowDeleteModal(false);
  };

  const cancelRemove = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className='h-max md:h-32 w-full p-3 gap-3 border-b border-black/10 grid grid-cols-2 md:grid-cols-6 relative'>
        <div className='col-span-full md:col-span-4 flex pr-12'>
          <span className='w-10 h-full flex items-center'>
            {/** this button act as checkbox */}
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
              <p className='text-neutral-700 text-sm mt-1'>Price: <strong>{item.product.price === 0 ? 'Upon Inquiry' : `₱${item.product.price.toFixed(2)}`}</strong></p>
              <span className='text-neutral-700 text-sm -mt-1 truncate'>Logo: <strong>{item.logo}</strong></span>
            </span>
          </div>
          <span className='hidden h-full md:flex items-center justify-center font-extrabold text-base text-dark-blue ml-auto'>
            <p><span className='text-sm'>₱</span> {item.product.price.toFixed(2)}</p>
          </span>
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
        <span className='col-span-1 h-full flex items-center justify-end md:justify-center font-extrabold text-dark-blue'>
          <p><span className='text-sm'>₱</span> {item.subtotal.toFixed(2)}</p>
        </span>
        <button 
          type="button" 
          className='p-1 md:h-[80%] z-30 ml-auto absolute md:top-1/2 md:-translate-y-1/2 right-0 text-2xl text-rose-600 border border-rose-50 hover:bg-rose-300 focus:bg-rose-500 focus:text-white ease-out duration-200'
          onClick={handleRemoveClick}
        >
          <HiOutlineTrash />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={cancelRemove}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Remove Item
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <strong>"{item.product.name}"</strong> from your cart?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={cancelRemove}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
                  onClick={confirmRemove}
                >
                  <HiOutlineTrash />
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CartSlip