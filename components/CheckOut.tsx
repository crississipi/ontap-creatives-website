"use client"

import React, { useEffect, useState } from 'react'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import Image from 'next/image'
import { FaHandHoldingDollar, FaTruckRampBox } from 'react-icons/fa6'
import { RiMapPin2Fill, RiStore2Line, RiTruckLine } from 'react-icons/ri'
import { AnimatePresence, motion } from 'framer-motion'
import VoucherRoulette from './VoucherRoullete'
import ReceiptClient from './ReceiptClient'
import { useToast } from '@/hooks/useToast'
import Toast from './Toast';

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

interface Voucher {
  id: number;
  label: string;
  rarity?: string;
  discount?: number;
  expiration?: string;
  isUsed?: boolean;
}

interface CheckOutProps {
  setGotoCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: number[];
  cartItems: CartItem[];
  user: User | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  house: string;
  barangay: string;
  city: string;
  region: string;
  zipCode: string;
  timeFrom: string;
  timeTo: string;
}

interface FormErrors {
  [key: string]: string;
}

function useTimeout(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
}

function inPeso(num: number, locale = 'en-US') {
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const CheckOut = ({setGotoCheckout, selectedItems, cartItems, user}: CheckOutProps) => {
  const [modeOfPayment, setModeOfPayment] = React.useState<'cod' | 'card' | 'ewallet' | 'bank'>('cod');
  const [shippingMethod, setShippingMethod] = React.useState<'pickup' | 'delivery' | null>(null);
  const [showGif, setShowGif] = useState<"pickup" | "delivery" | null>(null);
  const [doubleCheck, setDoubleCheck] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [filteredCartItems, setFilteredCartItems] = useState<CartItem[]>([]);
  const [wonVouchers, setWonVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast, showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // NEW STATE FOR RECEIPT
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderTransactionId, setOrderTransactionId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    contactNumber: '',
    email: user?.email || '',
    house: '',
    barangay: '',
    city: '',
    region: '',
    zipCode: '',
    timeFrom: '',
    timeTo: ''
  });

  // Filter cart items based on selected items
  useEffect(() => {
    if (selectedItems.length > 0) {
      const filtered = cartItems.filter(item => selectedItems.includes(item.cartID));
      setFilteredCartItems(filtered);
    } else {
      setFilteredCartItems(cartItems);
    }
  }, [selectedItems, cartItems]);

  // Fetch user's vouchers on component mount
  useEffect(() => {
    const fetchVouchers = async () => {
      if (user?.clientID) {
        try {
          const response = await fetch(`/api/voucher?clientID=${user.clientID}`);
          if (response.ok) {
            const data = await response.json();
            if (data.vouchers) {
              const validVouchers = data.vouchers
                .filter((v: any) => v.voucherLabel !== 'Better Luck Next Time' && !v.isUsed)
                .map((v: any) => ({
                  id: v.voucherID,
                  label: v.voucherLabel,
                  discount: v.discount,
                  expiration: v.expiration,
                  isUsed: v.isUsed
                }));
              setWonVouchers(validVouchers);
            }
          }
        } catch (error) {
          showToast('error', 'Failed to fetch vouchers.');
        }
      }
    };

    fetchVouchers();
  }, [user]);

  // Calculate order totals with discount
  const subtotal = filteredCartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = shippingMethod === 'delivery' ? 150 : 0;
  const discount = selectedVoucher ? (subtotal * (selectedVoucher.discount || 0) / 100) : 0;
  const total = subtotal + shippingFee - discount;
  const totalQuantity = filteredCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Hide GIF after 3 seconds
  useTimeout(() => setShowGif(null), showGif ? 2000 : null);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Contact information validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }

    // Shipping method validation
    if (!shippingMethod) errors.shippingMethod = 'Shipping method is required';

    // Delivery address validation
    if (shippingMethod === 'delivery') {
      if (!formData.house.trim()) errors.house = 'House number and street are required';
      if (!formData.barangay.trim()) errors.barangay = 'Barangay is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.region.trim()) errors.region = 'Region is required';
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
      if (!formData.timeFrom) errors.timeFrom = 'Start time is required';
      if (!formData.timeTo) errors.timeTo = 'End time is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if purchase button should be disabled
  const isPurchaseDisabled = (): boolean => {
    if (filteredCartItems.length === 0) return true;
    if (!doubleCheck) return false;
    if (!agreeTerms || !confirmDetails) return true;
    if (isSubmitting) return true;
    return false;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClick = (method: "pickup" | "delivery") => {
    setShippingMethod(method);
    setShowGif(method);
    
    // Clear shipping-related errors when method changes
    if (formErrors.shippingMethod) {
      setFormErrors(prev => ({
        ...prev,
        shippingMethod: ''
      }));
    }
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleVoucherDeselect = () => {
    setSelectedVoucher(null);
  };

  const handleNewVoucherWon = (newVoucher: Voucher) => {
    if (newVoucher.label !== 'Better Luck Next Time') {
      const convertedVoucher: Voucher = {
        id: Number(newVoucher.id),
        label: newVoucher.label,
        discount: newVoucher.discount || getDiscountFromLabel(newVoucher.label),
        expiration: newVoucher.expiration
      };
      setWonVouchers(prev => [...prev, convertedVoucher]);
    }
  };

  const getDiscountFromLabel = (label: string): number => {
    if (label.includes('5%')) return 5;
    if (label.includes('10%')) return 10;
    if (label.includes('15%')) return 15;
    if (label.includes('20%')) return 20;
    return 0;
  };

  const handleCompletePurchase = async () => {
    // Validate form
    if (!validateForm()) {
        showToast('info', 'Please fill in all required fields correctly.');
        return;
    }

    if (!doubleCheck) {
        setDoubleCheck(true);
        return;
    }

    if (!agreeTerms || !confirmDetails) {
        showToast('info', 'Please agree to the terms and confirm your details.');
        return;
    }

    setIsSubmitting(true);

    if (isProcessing || isSubmitting) {
        showToast('info', 'Order is already being processed. Please wait.');
        return;
    }

    setIsProcessing(true);
    setIsSubmitting(true);

    try {
        const orderData = {
        contactInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            contactNumber: formData.contactNumber,
            email: formData.email
        },
        shippingInfo: {
            method: shippingMethod!,
            address: shippingMethod === 'delivery' ? {
            house: formData.house,
            barangay: formData.barangay,
            city: formData.city,
            region: formData.region,
            zipCode: formData.zipCode
            } : undefined,
            timeAvailability: shippingMethod === 'delivery' ? {
            from: formData.timeFrom,
            to: formData.timeTo
            } : undefined
        },
        paymentInfo: {
            method: modeOfPayment,
            referenceNo: modeOfPayment !== 'cod' ? `PAY-${Date.now()}` : undefined
        },
        items: filteredCartItems,
        voucher: selectedVoucher ? {
            id: selectedVoucher.id,
            discount: selectedVoucher.discount || 0
        } : undefined,
        totals: {
            subtotal,
            shippingFee,
            discount,
            total // ✅ Make sure total is included
        },
        clientTimestamp: Date.now(),
        clientId: user?.clientID,
        };

        console.log('🔍 Sending order data:', orderData);

        const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
        });

        const result = await response.json();

        console.log('🔍 Order response:', { status: response.status, data: result });

        if (response.ok) {
        setOrderTransactionId(result.transactionId);
        setShowReceipt(true);
        showToast('success', 'Order placed successfully! Receipt displayed.');
        } else {
        // ✅ IMPROVED: Show specific error message from server
        const errorMessage = result.error || result.details?.[0] || 'Failed to place order. Please try again.';
        showToast('error', 'Server Error. Please try again.');
        }
      } catch (error) {
    console.error('Order placement error:', error);
        // If there's a conflict error, refresh the cart
        if (error instanceof Error && (
        error.message.includes('already ordered') || 
        error.message.includes('refresh your cart')
        )) {
        // Refresh the page to get updated cart data
        window.location.reload();
        } else {
        showToast('error', 'Network error. Please check your connection and try again.');
        }
    } finally {
        setIsSubmitting(false);
        setIsProcessing(false);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setGotoCheckout(false); // Close checkout and go back to previous page
  };

  const formatExpiration = (expiration: string) => {
    return new Date(expiration).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // If showing receipt, render ReceiptClient instead of checkout form
  if (showReceipt && orderTransactionId) {
    return (
      <div className="fixed inset-0 h-full w-full z-50 bg-white overflow-x-hidden">
        <ReceiptClient orderID={orderTransactionId} />
        <button
          onClick={handleCloseReceipt}
          className="fixed left-5 top-5 z-50 rounded-lg px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition"
        >
          Close Receipt
        </button>
      </div>
    );
  }

  return (
    <div className='h-full lg:h-full w-full flex flex-col pb-0 lg:px-5 gap-5 select-none overflow-hidden fixed inset-0 z-50 bg-white pt-20'>
        {toast.show && (
            <Toast 
            icon={toast.icon}
            message={toast.message}
            />
        )}
        {showVoucher && (
          <VoucherRoulette 
            setRoulette={setShowVoucher} 
            onVoucherWon={handleNewVoucherWon}
          />
        )}
        <motion.div 
            initial={{x:-200, opacity:0}}
            animate={{x:0, opacity:1}}
            exit={{x:-200, opacity:0}}
            transition={{type:'spring', stiffness:100, damping:20}}
            className='flex gap-3 items-center'
        >
            <button type="button" className='ml-3 text-2xl p-2 py-1 rounded-md border border-transparent hover:border-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setGotoCheckout(false)}><HiOutlineArrowNarrowLeft /></button>
            <h1 className='w-full text-left text-4xl font-bold'>Checkout</h1>
        </motion.div>
        <div className='h-max lg:h-full lg:max-h-[95%] w-full grid grid-cols-1 lg:flex lg:flex-row gap-3 px-5 lg:pr-0 lg:pl-20 pb-10 overflow-x-hidden'>
            <motion.div 
                initial={{x:-200, opacity:0}}
                animate={{x:0, opacity:1}}
                exit={{x:-200, opacity:0}}
                transition={{type:'spring', stiffness:100, damping:20, delay: 0.3}}
                className='h-full w-full lg:w-2/5 grid grid-cols-2 gap-3 p-0 lg:overflow-x-hidden'
            >
                <h2 className='col-span-full font-black text-lg'>Contact Information</h2>
                
                {/* First Name */}
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="firstName" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>First Name *</label>
                    <input 
                        id="firstName"
                        type="text" 
                        placeholder='First Name' 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`px-3 py-2.5 rounded-md border ${
                            formErrors.firstName ? 'border-red-500' : 'border-black/30'
                        } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                    />
                    {formErrors.firstName && <span className="text-red-500 text-xs">{formErrors.firstName}</span>}
                </span>
                
                {/* Last Name */}
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="lastName" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Last Name *</label>
                    <input 
                        id="lastName"
                        type="text" 
                        placeholder='Last Name' 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`px-3 py-2.5 rounded-md border ${
                            formErrors.lastName ? 'border-red-500' : 'border-black/30'
                        } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                    />
                    {formErrors.lastName && <span className="text-red-500 text-xs">{formErrors.lastName}</span>}
                </span>
                
                {/* Company Name */}
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="companyName" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Company Name</label>
                    <input 
                        id="companyName"
                        type="text" 
                        placeholder='Company Name' 
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className='px-3 py-2.5 rounded-md border border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'
                    />
                </span>
                
                {/* Contact Number */}
                <span className='flex flex-col col-span-1 gap-1'>
                    <label htmlFor="contactNumber" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Contact Number *</label>
                    <input 
                        id="contactNumber"
                        type="text" 
                        placeholder='Contact Number' 
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className={`px-3 py-2.5 rounded-md border ${
                            formErrors.contactNumber ? 'border-red-500' : 'border-black/30'
                        } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                    />
                    {formErrors.contactNumber && <span className="text-red-500 text-xs">{formErrors.contactNumber}</span>}
                </span>
                
                {/* Email */}
                <span className='flex flex-col col-span-full gap-1'>
                    <label htmlFor="email" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Email Address *</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder='Email Address' 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`px-3 py-2.5 rounded-md border ${
                            formErrors.email ? 'border-red-500' : 'border-black/30'
                        } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                    />
                    {formErrors.email && <span className="text-red-500 text-xs">{formErrors.email}</span>}
                </span>

                <h2 className='col-span-full font-black text-lg mt-5'>Shipping Method *</h2>
                {formErrors.shippingMethod && <span className="col-span-full text-red-500 text-xs -mt-3">{formErrors.shippingMethod}</span>}
                
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
                        
                        {/* House/Street */}
                        <span className='flex flex-col col-span-full gap-1'>
                            <label htmlFor="house" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>House No., Street Name, Village *</label>
                            <input 
                                id="house"
                                type="text" 
                                placeholder='Blk. Lot, Street, Village' 
                                value={formData.house}
                                onChange={(e) => handleInputChange('house', e.target.value)}
                                className={`px-3 py-2.5 rounded-md border ${
                                    formErrors.house ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {formErrors.house && <span className="text-red-500 text-xs">{formErrors.house}</span>}
                        </span>
                        
                        {/* Barangay */}
                        <span className='flex flex-col col-span-full lg:col-span-3 gap-1'>
                            <label htmlFor="barangay" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Barangay *</label>
                            <input 
                                id="barangay"
                                type="text" 
                                placeholder='Baranggay' 
                                value={formData.barangay}
                                onChange={(e) => handleInputChange('barangay', e.target.value)}
                                className={`px-3 py-2.5 rounded-md border ${
                                    formErrors.barangay ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {formErrors.barangay && <span className="text-red-500 text-xs">{formErrors.barangay}</span>}
                        </span>
                        
                        {/* City */}
                        <span className='flex flex-col col-span-4 lg:col-span-3 gap-1'>
                            <label htmlFor="city" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>City *</label>
                            <input 
                                id="city"
                                type="text" 
                                placeholder='City' 
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className={`px-3 py-2.5 rounded-md border ${
                                    formErrors.city ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {formErrors.city && <span className="text-red-500 text-xs">{formErrors.city}</span>}
                        </span>
                        
                        {/* Region */}
                        <span className='flex flex-col col-span-2 gap-1'>
                            <label htmlFor="region" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Region *</label>
                            <input 
                                id="region"
                                type="text" 
                                placeholder='Region' 
                                value={formData.region}
                                onChange={(e) => handleInputChange('region', e.target.value)}
                                className={`px-3 py-2.5 rounded-md border ${
                                    formErrors.region ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {formErrors.region && <span className="text-red-500 text-xs">{formErrors.region}</span>}
                        </span>
                        
                        {/* ZIP Code */}
                        <span className='flex flex-col col-span-2 lg:col-span-1 gap-1'>
                            <label htmlFor="zipCode" className='uppercase tracking-wide text-xs font-extrabold text-dark-blue'>ZIP Code *</label>
                            <input 
                                id="zipCode"
                                type="text" 
                                placeholder='ZIP Code' 
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                className={`px-3 py-2.5 rounded-md border ${
                                    formErrors.zipCode ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {formErrors.zipCode && <span className="text-red-500 text-xs">{formErrors.zipCode}</span>}
                        </span>
                        
                        {/* Time Availability */}
                        <span className='grid grid-cols-2 col-span-4 lg:col-span-3 gap-1'>
                            <label htmlFor="timeFrom" className='col-span-full uppercase tracking-wide text-xs font-extrabold text-dark-blue'>Time Availability *</label>
                            <input 
                                id="timeFrom"
                                type="time" 
                                placeholder='From' 
                                value={formData.timeFrom}
                                onChange={(e) => handleInputChange('timeFrom', e.target.value)}
                                className={`col-span-1 px-3 py-2.5 rounded-md border ${
                                    formErrors.timeFrom ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            <input 
                                id="timeTo"
                                type="time" 
                                placeholder='To' 
                                value={formData.timeTo}
                                onChange={(e) => handleInputChange('timeTo', e.target.value)}
                                className={`col-span-1 px-3 py-2.5 rounded-md border ${
                                    formErrors.timeTo ? 'border-red-500' : 'border-black/30'
                                } hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200`}
                            />
                            {(formErrors.timeFrom || formErrors.timeTo) && (
                                <span className="col-span-full text-red-500 text-xs">
                                    {formErrors.timeFrom || formErrors.timeTo}
                                </span>
                            )}
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
                <button 
                type="button" 
                className={`col-span-1 px-3 py-2 gap-2 rounded-md border ${modeOfPayment === 'cod' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold`} 
                onClick={() => setModeOfPayment('cod')}
                >
                    Cash on Delivery
                    <FaHandHoldingDollar className={`ml-auto text-xl ${modeOfPayment === 'cod' ? 'text-white': 'text-dark-blue'}`}/>
                    <FaTruckRampBox className={`text-xl ${modeOfPayment === 'cod' ? 'text-white': 'text-dark-blue'}`}/>
                </button>
                <button 
                type="button" 
                className={`col-span-1 px-3 py-2 rounded-md border ${modeOfPayment === 'card' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold disabled:border-black/20 disabled:text-black/30 disabled-button relative`} 
                onClick={() => setModeOfPayment('card')}
                disabled
                >
                    <span className='py-1 w-full text-center absolute top-1/2 left-0 -translate-y-1/2 bg-rose-500/30 text-red-500 border-y-2 border-red-600/50 backdrop-blur-sm'>CURRENTLY UNAVAILABLE</span>
                    Credit / Debit Card
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal Logo" className='h-7 w-auto'/>
                </button>
                <button 
                    type="button" 
                    className={`col-span-1 px-3 py-2 rounded-md border ${modeOfPayment === 'ewallet' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold disabled:border-black/20 disabled:text-black/30 disabled-button relative`}  
                    onClick={() => setModeOfPayment('ewallet')}
                    disabled
                >
                    <span className='py-1 w-full text-center absolute top-1/2 left-0 -translate-y-1/2 bg-rose-500/30 text-red-500 border-y-2 border-red-600/50 backdrop-blur-sm'>CURRENTLY UNAVAILABLE</span>
                    E-Wallet
                    <Image
                        height={2048}
                        width={2048}
                        alt='Gcash Logo'
                        src="/icons/gcash-logo-1.png"
                        className='ml-auto w-7 aspect-square object-cover object-center'
                    />
                    <Image
                        height={2048}
                        width={2048}
                        alt='Gcash Logo'
                        src="/icons/paymaya-logo.png"
                        className='h-7 w-auto object-contain object-center ml-1'
                    />
                </button>
                <button 
                    type="button" 
                    className={`col-span-1 px-3 py-2 rounded-md border ${modeOfPayment === 'bank' ? 'bg-violet text-white border-light-blue' : 'border-black/30 hover:border-black focus:border-dark-blue focus:bg-sky-100 ease-out duration-200'} flex items-center justify-between font-bold disabled:border-black/20 disabled:text-black/30 disabled-button relative`} 
                    onClick={() => setModeOfPayment('bank')}
                    disabled
                >
                    <span className='py-1 w-full text-center absolute top-1/2 left-0 -translate-y-1/2 bg-rose-500/30 text-red-500 border-y-2 border-red-600/50 backdrop-blur-sm'>CURRENTLY UNAVAILABLE</span>
                    Bank Transfer
                    <span className='ml-auto p-1 bg-[#004ea8]'>
                        <Image
                            height={2048}
                            width={2048}
                            alt='BDO Logo'
                            src="/icons/bdo.png"
                            className='h-3 w-auto object-contain object-center'
                        />
                    </span>
                    <span className='p-1 bg-white'>
                        <Image
                            height={2048}
                            width={2048}
                            alt='PNB Logo'
                            src="/icons/pnb.png"
                            className='h-3 w-auto object-contain object-center'
                        />
                    </span>
                </button>
            </motion.div>

            {/* Order Summary Section */}
            <motion.div 
                initial={{y:500, opacity:0}}
                animate={{y:0, opacity:1}}
                exit={{y:500, opacity:0}}
                transition={{type:'spring', stiffness:100, damping:20}}
                className='h-max lg:h-full lg:w-1/3 border border-black/20 rounded-xl lg:overflow-hidden shadow-lg shadow-transparent p-5 lg:ml-32 flex flex-col gap-3 hover:shadow-black/30 ease-out duration-200'
            >
                <h2 className='text-xl font-extrabold'>Order Summary</h2>
                <div className='flex flex-col w-full h-full lg:overflow-x-hidden'>
                    <div className='w-full min-h-max lg:min-h-2/5 max-h-3/5 flex flex-col items-center overflow-x-hidden lg:overflow-y-auto border border-black/10 rounded-lg'>
                        {filteredCartItems.length > 0 ? (
                            filteredCartItems.map((item) => (
                                <div key={item.cartID} className='h-24 w-full p-3 flex items-center gap-3 z-50 border-b border-black/10 last:border-0'>
                                    <Image
                                        height={2048}
                                        width={2048}
                                        alt='Item Image'
                                        src={item.product.imgUrl || item.product.frontUrl!}
                                        className='h-4/5 w-auto aspect-[3/2] rounded-md object-cover object-center'
                                    />
                                    <span className='flex flex-col w-auto'>
                                        <p className='font-extrabold text-sm'>{item.product.name}</p>
                                        <p className='text-xs px-2 py-1 rounded-full bg-dark-blue text-white w-max'>{item.logo}</p>
                                    </span>
                                    <span className='flex flex-col ml-auto items-end justify-center'>
                                        <h4 className='text-xs font-semibold text-neutral-700'>₱ <span className='text-sm'>{inPeso(item.logo === 'OnTap' ? item.product.price : item.product.customPrice)}</span></h4>
                                        <p className='text-sm text-neutral-700'>x <strong>{item.quantity}</strong></p>
                                        <h3 className='text-xs text-dark-blue text-nowrap'>₱ <span className='text-base font-extrabold'>{inPeso(item.subtotal)}</span></h3>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className='h-24 w-full flex items-center justify-center text-neutral-500'>
                                No items in cart
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col h-full w-full mt-3'>
                        <span className='flex flex-col gap-3 items-center text-base'>
                            <span className='w-full flex items-center justify-between'>
                                <p className='font-bold text-neutral-700'>Vouchers</p>
                                <button type="button" className='flex items-center gap-3 px-3 py-1 text-sm rounded-md border border-black/20' onClick={() => setShowVoucher(true)}>
                                    <Image
                                        height={2048}
                                        width={2048}
                                        alt='Voucher Icon'
                                        src="/icons/roulette.gif"
                                        className='h-8 w-8 object-cover object-center'
                                    />
                                    Spin & Win
                                </button>
                            </span>
                            <span className='w-full flex items-center gap-3 flex-wrap'>
                                {wonVouchers.length > 0 ? (
                                    wonVouchers.map((voucher) => (
                                        <button 
                                            key={voucher.id}
                                            type="button" 
                                            className={`rounded-lg px-3 py-2 flex flex-col justify-center gap-0 items-start hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200 ${
                                                selectedVoucher?.id === voucher.id 
                                                    ? 'bg-dark-blue text-white' 
                                                    : 'bg-white'
                                            }`}
                                            onClick={() => 
                                                selectedVoucher?.id === voucher.id 
                                                    ? handleVoucherDeselect()
                                                    : handleVoucherSelect(voucher)
                                            }
                                        >
                                            <span className='flex items-center gap-1'>
                                                <strong>{voucher.discount}%</strong>
                                                discount
                                            </span>
                                            <span className='text-xs font-bold'>
                                                {voucher.expiration && `Ends at ${formatExpiration(voucher.expiration)}`}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className='text-sm text-neutral-500'>No vouchers available</p>
                                )}
                            </span>
                        </span>
                        <div className='w-full flex flex-col gap-0 mt-5'>
                            <span className='flex items-center justify-between'>
                                <p className='font-bold text-neutral-700'>Subtotal ({totalQuantity} items)</p>
                                <h5 className='font-black text-dark-blue'>₱ <span className='text-lg'>{inPeso(subtotal)}</span></h5>
                            </span>
                            <span className='flex items-center justify-between'>
                                <p className='font-bold text-neutral-700'>Shipping Fee</p>
                                <h5 className='font-black text-dark-blue'>₱ <span className='text-lg'>{inPeso(shippingFee)}</span></h5>
                            </span>
                            {discount > 0 && (
                                <span className='flex items-center justify-between'>
                                    <p className='font-bold text-neutral-700'>Discount ({selectedVoucher?.discount}%)</p>
                                    <h5 className='font-black text-dark-blue'>-₱ <span className='text-lg'>{inPeso(discount)}</span></h5>
                                </span>
                            )}
                            <span className='flex items-center justify-between border-t border-black/20 pt-3'>
                                <p className='font-extrabold text-neutral-700 text-lg'><strong>Total</strong></p>
                                <h5 className='font-black text-dark-blue text-xl'>₱ <span className='text-2xl'>{inPeso(total)}</span></h5>
                            </span>
                        </div>
                    </div>
                    
                    {/* Complete Purchase Button */}
                    <button
                        type="button"
                        className={`py-3 rounded-md w-full mt-4 ${
                            isPurchaseDisabled()
                                ? 'bg-neutral-400 text-neutral-600 cursor-not-allowed'
                                : 'bg-dark-blue text-white hover:bg-blue focus:bg-violet ease-out duration-200'
                        }`}
                        disabled={isPurchaseDisabled()}
                        onClick={handleCompletePurchase}
                    >
                        {isSubmitting ? 'Placing Order...' : 
                        filteredCartItems.length === 0 ? 'Cart is Empty' : 
                        !doubleCheck ? 'Complete Purchase' :
                        'Place Order'}
                    </button>

                    {doubleCheck && (
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-1 mt-5'>
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
                    </div>
                    )}
                </div>
            </motion.div>
        </div>
    </div>
  )
}

export default CheckOut