"use client"
import React, { useState, useEffect } from 'react'
import CartSlip from './CartSlip';
import VoucherRoulette from './VoucherRoullete';
import CheckOut from './CheckOut';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Toast from './Toast';
import { useToast } from '@/hooks/useToast';
import { inPeso } from '@/lib/utils';

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

interface User {
  clientID: number;
  clientName: string;
  email: string;
  contactNumber: string;
  address: string;
}

const CartPage = () => {
  const [roulette, setRoulette] = useState(false);
  const [gotoCheckout, setGotoCheckout] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState<number[]>([]);
  const { toast, showToast } = useToast();

  // Fetch user session on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        } else {
          showToast('error', 'Please log in to view your cart');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
        showToast('error', 'Failed to authenticate user');
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  // Fetch cart items when user is available
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://ontap-creatives-website.vercel.app/api/cart/client/${user.clientID}`);
        const data = await response.json();
        
        if (data.cartItems) {
          setCartItems(data.cartItems);
        } else {
          showToast('error', 'Failed to load cart items');
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        showToast('error', 'Network error. Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  // Calculate totals for SELECTED ITEMS ONLY
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartID));
  const totalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = inPeso(selectedCartItems.reduce((sum, item) => sum + item.subtotal, 0))
  const total = subtotal;

  // Handle item selection
  const handleItemSelect = (cartID: number) => {
    setSelectedItems(prev => 
      prev.includes(cartID) 
        ? prev.filter(id => id !== cartID)
        : [...prev, cartID]
    );
  };

  // Handle select all / deselect all
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(cartItems.map(item => item.cartID));
    }
  };

  // Handle quantity update with optimistic updates
  const handleQuantityUpdate = async (cartID: number, newQuantity: number) => {
    if (!user) {
      showToast('error', 'Please log in to update cart');
      return;
    }

    try {
      const item = cartItems.find(item => item.cartID === cartID);
      if (!item) return;

      const newSubtotal = item.product.price * newQuantity;
      
      // Optimistic update
      setCartItems(prev => 
        prev.map(item => 
          item.cartID === cartID 
            ? { ...item, quantity: newQuantity, subtotal: newSubtotal }
            : item
        )
      );

      const response = await fetch('https://ontap-creatives-website.vercel.app/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartID,
          quantity: newQuantity,
          subtotal: newSubtotal
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quantity');
      }
      
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showToast('error', 'Failed to update quantity');
      
      // Revert optimistic update on error
      setCartItems(prev => prev);
    }
  };

  // Handle single item removal
  const handleRemoveItem = async (cartID: number) => {
    if (!user) {
      showToast('error', 'Please log in to remove items');
      return;
    }

    try {
      // Optimistic update
      setCartItems(prev => prev.filter(item => item.cartID !== cartID));
      setSelectedItems(prev => prev.filter(id => id !== cartID));

      const response = await fetch(`https://ontap-creatives-website.vercel.app/api/cart/item/${cartID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove item');
      }

      showToast('success', 'Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      showToast('error', 'Failed to remove item from cart');
      
      // Revert optimistic update on error by refetching cart
      if (user) {
        const response = await fetch(`https://ontap-creatives-website.vercel.app/api/cart/${user.clientID}`);
        const data = await response.json();
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
      }
    }
  };

  // Handle multiple items removal with confirmation
  const handleRemoveMultipleItems = (cartIDs: number[]) => {
    setItemsToRemove(cartIDs);
    setShowRemoveConfirmation(true);
  };

  // Confirm and remove multiple items
  const confirmRemoveMultipleItems = async () => {
    if (!user || itemsToRemove.length === 0) {
      setShowRemoveConfirmation(false);
      return;
    }

    try {
      // Optimistic update
      setCartItems(prev => prev.filter(item => !itemsToRemove.includes(item.cartID)));
      setSelectedItems(prev => prev.filter(id => !itemsToRemove.includes(id)));

      // Remove items one by one from the backend
      const removePromises = itemsToRemove.map(cartID =>
        fetch(`https://ontap-creatives-website.vercel.app/api/cart/item/${cartID}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(removePromises);

      // Check if any removals failed
      const failedRemovals = results.filter(result => result.status === 'rejected' || !result.value.ok);
      
      if (failedRemovals.length > 0) {
        throw new Error(`Failed to remove ${failedRemovals.length} items`);
      }

      showToast('success', `${itemsToRemove.length} items removed from cart`);
    } catch (error) {
      console.error('Failed to remove items:', error);
      showToast('error', 'Failed to remove some items from cart');
      
      // Revert optimistic update on error by refetching cart
      if (user) {
        const response = await fetch(`https://ontap-creatives-website.vercel.app/api/cart/${user.clientID}`);
        const data = await response.json();
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
      }
    } finally {
      setShowRemoveConfirmation(false);
      setItemsToRemove([]);
    }
  };

  // Cancel removal
  const cancelRemoveMultipleItems = () => {
    setShowRemoveConfirmation(false);
    setItemsToRemove([]);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!user) {
      showToast('error', 'Please log in to proceed to checkout');
      return;
    }

    if (selectedItems.length === 0 && cartItems.length > 0) {
      showToast('info', 'Please select items to checkout');
      return;
    }

    if (cartItems.length === 0) {
      showToast('info', 'Your cart is empty');
      return;
    }
    setGotoCheckout(true);
  };

  if (authLoading || loading) {
    return (
      <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-t from-violet via-light-blue to-white'>
        <Image
          height={2048}
          width={2048}
          alt='animated logo'
          src='/icons/animated-logo.gif'
          className='h-20 object-contain object-center'
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-t from-violet via-light-blue to-white'>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your cart</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-violet text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='h-[100vh] w-[100vw] flex items-center relative overflow-x-hidden p-3 lg:p-5 xl:p-10 gap-5 select-none overflow-hidden bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/70 before:backdrop-blur-lg'>
        {roulette && (<VoucherRoulette setRoulette={setRoulette} />)}
        
        {/* Remove Confirmation Modal */}
        {showRemoveConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999 ">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Remove {itemsToRemove.length} Item{itemsToRemove.length > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove {itemsToRemove.length} selected item{itemsToRemove.length > 1 ? 's' : ''} from your cart? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelRemoveMultipleItems}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveMultipleItems}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove {itemsToRemove.length} Item{itemsToRemove.length > 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
        {gotoCheckout ? (
            <motion.div
                key="checkout-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full h-full z-50"
            >
                <CheckOut 
                  setGotoCheckout={setGotoCheckout} 
                  selectedItems={selectedItems} 
                  cartItems={cartItems}
                  user={user}
                />
            </motion.div>
        ) : (
            <motion.div
                key="cart-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className='h-full w-full flex items-center relative z-50 gap-5'
            >
                <div className='flex flex-col w-full 2xl:w-6/7 h-full pt-12 lg:pt-16'>
                <motion.h1 
                    initial={{x:-200, opacity:0}}
                    animate={{x:0, opacity:1}}
                    exit={{x:-200, opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                className='w-full text-3xl text-center lg:text-4xl lg:text-left font-bold'
                >Cart
                </motion.h1>
                <motion.p
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    transition={{type:'spring', stiffness:100, damping:20}}
                    className='w-full text-center lg:text-left'
                >
                  Welcome back, <strong className='font-extrabold'>{user.clientName}</strong>! You have <strong className='font-extrabold'>{cartItems.length} items</strong> in your cart.
                </motion.p>
                
                <div className='h-auto w-max flex items-center 2xl:ml-20 mt-10'>
                  {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                    <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{type:'spring', stiffness:100, damping:20, duration: 0.05}}
                        className="flex gap-2"
                    >
                        <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-4 py-2 text-xs uppercase font-extrabold bg-light-blue hover:bg-blue text-dark-blue rounded-lg transition-colors "
                        >
                        {selectedItems.length === cartItems.length ? 'Deselect All' : 'Select All'}
                        </button>
                        
                        <button
                        type="button"
                        onClick={() => handleRemoveMultipleItems(selectedItems)}
                        className="px-4 py-2 text-xs uppercase font-extrabold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                        Remove Selected ({selectedItems.length})
                        </button>
                    </motion.div>
                    )}

                    {/* Select All Button (when no items are selected) */}
                    {cartItems.length > 0 && selectedItems.length === 0 && (
                    <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{type:'spring', stiffness:100, damping:20, duration: 0.05}}
                    >
                        <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-4 py-2 text-xs uppercase font-extrabold bg-light-blue hover:bg-blue text-dark-blue rounded-lg transition-colors"
                        >
                        Select All
                        </button>
                    </motion.div>
                    )}
                </div>

                <div className='w-full 2xl:w-[95%] lg:ml-auto h-full lg:h-full max-h-[90%] flex flex-col lg:flex-row gap-3 mt-3 overflow-hidden'>
                    <motion.div 
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        transition={{type:'spring', stiffness:100, damping:20, delay: 0.3}}
                        className='h-full w-full lg:w-5/7 flex flex-col items-center border border-black/20 rounded-xl p-5 pr-0 gap-3 bg-white/50 backdrop-blur-sm overflow-hidden'
                    >
                        {cartItems.length > 0 ? (
                            <>
                            <div className='hidden w-full lg:grid grid-cols-6 text-sm text-dark-blue font-extrabold uppercase border-b border-black/20 pb-3 mr-5'>
                                <span className='pl-5 col-span-4'>Product</span>
                                <span className='text-center col-span-1'>Quantity</span>
                                <span className='text-center col-span-1'>Total</span>
                            </div>
                            <div className='h-full w-full flex flex-col overflow-x-hidden pr-3'>
                                {cartItems.map((item) => (
                                    <CartSlip 
                                        key={item.cartID}
                                        item={item}
                                        selected={selectedItems.includes(item.cartID)}
                                        onSelect={() => handleItemSelect(item.cartID)}
                                        onQuantityUpdate={(newQuantity) => handleQuantityUpdate(item.cartID, newQuantity)}
                                        onRemove={() => handleRemoveItem(item.cartID)}
                                    />
                                ))}
                            </div>
                            </>
                        ) : (
                            <div className='h-full w-full flex flex-col items-center justify-center overflow-x-hidden pr-3'>
                                <Image
                                    height={2048}
                                    width={2048}
                                    alt='empty box animation'
                                    src='/icons/empty-box.gif'
                                    className='h-40 aspect-square object-center object-contain'
                                />
                                <span className='font-bold text-neutral-500 px-5 py-3 rounded-lg border-2 border-neutral-300 bg-neutral-100 relative
                                                before:h-5 before:w-5 before:absolute before:bg-neutral-100 before:top-full before:left-3 before:rotate-z-45 before:border-2 before:border-transparent before:border-b-neutral-300 before:border-r-neutral-300 before:-mt-2.5
                                '>
                                    You have no items in your cart.
                                </span>
                            </div>
                        )}
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
                                <span className='font-semibold'>Selected Items</span>
                                <span className='font-extrabold text-base lg:text-lg text-dark-blue'>{selectedItems.length}</span>
                            </div>
                            <div className='w-full flex justify-between text-sm lg:text-base'>
                                <span className='font-semibold'>Total Quantity</span>
                                <span className='font-extrabold text-base lg:text-lg text-dark-blue'>{totalQuantity}</span>
                            </div>
                            <div className='w-full flex justify-between text-sm lg:text-base'>
                                <span className='font-semibold'>Subtotal</span>
                                <span className='font-extrabold text-base lg:text-lg text-dark-blue'><span className='text-base'>₱</span> {subtotal}</span>
                            </div>
                            <div className='w-full flex justify-between border-t border-black/20 pt-3'>
                                <span className='font-bold text-base lg:text-xl'>Total</span>
                                <span className='font-extrabold text-lg lg:text-2xl text-dark-blue'><span className='text-base'>₱</span> {total}</span>
                            </div>
                            <button 
                              type="button" 
                              className='w-full mt-auto bg-dark-blue hover:bg-violet focus:bg-violet text-white font-bold py-3 rounded-lg ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                              onClick={handleProceedToCheckout}
                              disabled={selectedItems.length === 0}
                            >
                              {selectedItems.length === 0 ? 'Select Items to Checkout' : `Proceed to Checkout (${selectedItems.length})`}
                            </button>
                        </div>
                    </motion.div>
                </div>
                </div>
                <div className='hidden h-[95%] mt-16 w-1/7 xl:flex flex-col items-center border border-black/20'>
                {/* Ads Here */}
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Toast Component */}
        {toast.show && (
          <Toast 
            icon={toast.icon}
            message={toast.message}
          />
        )}
    </div>
  )
}

export default CartPage