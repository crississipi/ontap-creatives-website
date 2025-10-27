"use client";

import { AnimatePresence, motion } from 'framer-motion';
import React, { JSX, useRef, useState, useEffect } from 'react';
import { RiStore3Fill, RiTruckLine } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';
import Image from 'next/image';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { MdOutlineSaveAlt } from 'react-icons/md';
import { HiOutlineX } from 'react-icons/hi';
import ReceiptTemplate from './ReceiptTemplate';
import { inPeso } from '@/lib/utils';

type PaymentInfo = {
  title: string;
  image: JSX.Element;
  label: string;
  digit: number;
};

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  logo: string;
  imgUrl: string;
  frontImg: string;
}

interface TrackingEvent {
  timestamp: string;
  title: string;
  description?: string;
}

interface Order {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: OrderItem[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  trackingEvents: TrackingEvent[];
}

const payment: Record<string, PaymentInfo> = {
  "cod": 
    { title: '', 
      image: <></>, 
      label: '', 
      digit: 0
    },
  "credit": 
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
  "ewallet":
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
  "bank": 
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

// Date validation and formatting utilities
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const safeFormatDate = (dateString: string): string => {
  if (!isValidDate(dateString)) {
    return 'Invalid Date';
  }
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

const safeFormatTime = (dateString: string): string => {
  if (!isValidDate(dateString)) {
    return 'Invalid Time';
  }
  try {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Time';
  }
};

const safeToISOString = (dateString: string): string => {
  if (!isValidDate(dateString)) {
    return new Date().toISOString(); // Fallback to current date
  }
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString(); // Fallback to current date
  }
};

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/transaction');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Validate and sanitize the data with proper date handling
      const validatedOrders = (data.orders || []).map((order: any) => {
        // Ensure orderDate is valid
        const validOrderDate = isValidDate(order.orderDate) 
          ? order.orderDate 
          : new Date().toISOString();

        // Validate and sanitize tracking events
        const validTrackingEvents = (order.trackingEvents || []).map((event: any) => ({
          timestamp: isValidDate(event.timestamp) ? event.timestamp : validOrderDate,
          title: event.title || 'Status Update',
          description: event.description
        }));

        // If no tracking events, create a default one
        const trackingEvents = validTrackingEvents.length > 0 
          ? validTrackingEvents 
          : [{
              timestamp: validOrderDate,
              title: 'Order Placed',
              description: 'Your order has been received and is being processed'
            }];

        return {
          ...order,
          orderDate: validOrderDate,
          items: Array.isArray(order.items) ? order.items : [],
          trackingEvents: trackingEvents,
          customerName: order.customerName || 'Unknown Customer',
          contactNumber: order.contactNumber || 'N/A',
          email: order.email || 'N/A',
          deliveryAddress: order.deliveryAddress || 'N/A',
          shippingMethod: order.shippingMethod || 'pickup',
          paymentMethod: order.paymentMethod || 'cod',
          subtotal: Number(order.subtotal) || 0,
          shippingFee: Number(order.shippingFee) || 0,
          discount: Number(order.discount) || 0,
          total: Number(order.total) || 0,
          status: order.status || 'pending'
        };
      });
      
      setOrders(validatedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderInfo(true);
  };

  const handleDownload = async () => {
    if (!receiptRef.current || !selectedOrder) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = receiptRef.current.cloneNode(true) as HTMLElement;
      element.style.display = "block";

      const opt = {
        margin: 0,
        filename: `receipt-${selectedOrder.orderID}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a5", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'For Approval';
      case 'approved': return 'Approved';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Safe item count function
  const getItemCount = (order: Order) => {
    return Array.isArray(order.items) ? order.items.length : 0;
  };

  // Safe items access
  const getOrderItems = (order: Order | null): OrderItem[] => {
    return order && Array.isArray(order.items) ? order.items : [];
  };

  // Safe tracking events access
  const getTrackingEvents = (order: Order | null): TrackingEvent[] => {
    return order && Array.isArray(order.trackingEvents) ? order.trackingEvents : [];
  };

  if (loading) {
    return (
      <div className='h-[100vh] w-full flex items-center justify-center bg-gradient-to-t from-violet via-light-blue to-white'>
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

  if (error) {
    return (
      <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-t from-violet via-light-blue to-white'>
        <div className='text-red-500 text-lg mb-4'>{error}</div>
        <button 
          onClick={fetchOrders}
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='h-[100vh] w-full flex flex-col items-center relative overflow-x-hidden p-0 pt-20 lg:p-10 lg:pr-5 gap-2 lg:gap-5 select-none lg:overflow-hidden bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/70 before:backdrop-blur-xl'>
      <motion.h1 
        initial={{x:-200, opacity:0}}
        animate={{x:0, opacity:1}}
        exit={{x:-200, opacity:0}}
        transition={{type:'spring', stiffness:100, damping:20}}
        className='pl-3 w-full text-left text-2xl xl:text-4xl font-bold z-50'
      >
        Orders
      </motion.h1>
      
      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-7 gap-5 z-50 relative'>
        {/* Orders List */}
        <div className='col-span-full lg:col-span-2 flex flex-col xl:p-5 w-full xl:h-[95%] overflow-x-hidden'>
          <span className='font-extrabold pl-3 lg:pl-0 text-neutral-500 text-sm uppercase'>Ongoing</span>
          {orders.filter(order => order.status !== 'completed').map((order) => (
            <button 
              key={order.orderID} 
              type='button' 
              className='w-full border-b border-neutral-200 flex gap-3 p-3 hover:bg-light-blue/30 focus:bg-light-blue ease-out duration-200' 
              onClick={() => handleOrderSelect(order)}
            >
              <span className='h-12 xl:h-14 aspect-square rounded-xl bg-blue flex items-center justify-center text-white font-bold text-xs'>
                {getItemCount(order)}
              </span>
              <span className='py-2 flex flex-col items-start justify-center leading-4'>
                <h3 className='font-extrabold w-full flex items-center text-left'>#{order.orderID}</h3>
                <p className='text-sm'>{safeFormatDate(order.orderDate)}</p>
              </span>
              <span className='ml-auto flex flex-col items-end leading-5 justify-center'>
                <p className={`text-[10px] px-3 rounded-full text-nowrap ${getStatusColor(order.status)} text-white font-bold uppercase`}>
                  {getStatusText(order.status)}
                </p>
                <p className='flex items-center gap-1 text-xs'>₱<strong className='font-extrabold text-base'>{inPeso(order.total)}</strong></p>
              </span>
            </button>
          ))}
          
          <span className='font-extrabold text-neutral-500 text-sm uppercase mt-5 pl-3 lg:pl-0'>Previous Purchases</span>
          {orders.filter(order => order.status === 'completed').map((order) => (
            <button 
              key={order.orderID} 
              type='button' 
              className='w-full border-b border-neutral-200 flex gap-3 p-3 hover:bg-light-blue/30 focus:bg-light-blue ease-out duration-200' 
              onClick={() => handleOrderSelect(order)}
            >
              <span className='h-14 aspect-square rounded-xl bg-blue flex items-center justify-center text-white font-bold text-xs'>
                {getItemCount(order)}
              </span>
              <span className='py-2 flex flex-col items-start justify-center leading-4'>
                <h3 className='font-extrabold w-full flex items-center justify-between'>#{order.orderID}</h3>
                <p className='text-sm'>{safeFormatDate(order.orderDate)}</p>
              </span>
              <span className='ml-auto flex flex-col items-end leading-5 justify-center'>
                <p className={`text-[10px] px-3 rounded-full ${getStatusColor(order.status)} text-white font-bold uppercase`}>
                  {getStatusText(order.status)}
                </p>
                <p className='flex items-center gap-1 text-xs'>₱<strong className='font-extrabold text-base'>{inPeso(order.total)}</strong></p>
              </span>
            </button>
          ))}
        </div>

        {/* Order Details */}
        <AnimatePresence mode='wait'>
          {showOrderInfo && selectedOrder && (
            <motion.div 
              initial={{y: 999}}
              animate={{y: 0}}
              exit={{y: 999}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='col-span-full lg:col-span-5 rounded-xl shadow-md shadow-black/20 bg-white lg:bg-white/50 backdrop-blur-xl p-3 lg:p-5 w-full h-[95%] lg:max-h-[95%] overflow-hidden flex flex-col absolute lg:relative'
            >
              <div className='w-full flex flex-row-reverse lg:flex-row items-center justify-end lg:justify-between gap-3'>
                <button type="button" className='lg:hidden bg-neutral-50 text-rose-500 p-1 rounded-xl border border-black/20 ml-auto text-2xl hover:bg-rose-300 focus:bg-rose-500 focus:text-white ease-out duration-200' onClick={() => setShowOrderInfo(false)}>
                  <HiOutlineX />
                </button>
                <span className='flex flex-col'>
                  <h2 className='capitalize font-extrabold text-xl'>Order #{selectedOrder.orderID}</h2>
                  <p className='font-bold text-sm text-neutral-500'>
                    {safeFormatDate(selectedOrder.orderDate)} at {safeFormatTime(selectedOrder.orderDate)}
                  </p>
                </span>
                <button type="button" className='py-2 px-2 lg:px-3 rounded-xl border border-dark-blue flex items-center gap-2 text-dark-blue font-bold hover:bg-dark-blue hover:text-white focus:text-white focus:bg-violet ease-out duration-200' onClick={handleDownload}>
                  <MdOutlineSaveAlt className='text-xl'/> 
                  <span className='hidden lg:block'>Download E-Receipt</span>
                </button>
              </div>
              
              <div className='h-full w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-3 overflow-x-hidden px-2 py-3'>
                {/* Items Section */}
                <div className='col-span-full xl:col-span-5 h-full flex flex-col gap-3 xl:overflow-hidden px-1'>
                  <div className='h-full max-h-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 overflow-hidden py-3 flex flex-col'>
                    <span className='text-xl font-bold pl-5'>Items</span>
                    <div className='h-full w-full flex flex-col overflow-x-hidden'>
                      {getOrderItems(selectedOrder).map((item, index) => (
                        <div key={index} className='flex w-full p-3 items-center gap-3 border-b border-white'>
                          <span className='h-14 xl:h-20 aspect-square rounded-xl bg-light-blue flex items-center justify-center'>
                            {item.imgUrl ? (
                              <Image src={item.imgUrl} alt={item.name} width={80} height={80} className="rounded-xl object-cover" />
                            ) : (
                              <span className="text-white font-bold text-xs">IMG</span>
                            )}
                          </span>
                          <span className='w-1/2 flex flex-col leading-5'>
                            <h3 className='overflow-ellipsis text-nowrap w-full overflow-hidden text-sm xl:text-base'>{item.name}</h3>
                            <p className='text-xs xl:text-sm'>Logo: <strong className='text-dark-blue'>{item.logo}</strong></p>
                          </span>
                          <span className='w-1/2 flex flex-col xl:flex-row items-end xl:items-center justify-around'>
                            <p className='text-xs flex items-center gap-1'>₱ <strong className='text-sm xl:text-base'>{inPeso(item.price)}</strong></p>
                            <strong className='text-sm xl:text-base'>{item.qty}</strong>
                            <p className='text-xs flex items-center gap-1'>₱ <strong className='text-base'>{inPeso(item.subtotal)}</strong></p>
                          </span>
                        </div>
                      ))}
                      {getOrderItems(selectedOrder).length === 0 && (
                        <div className='flex w-full p-3 items-center justify-center'>
                          <p className='text-neutral-500'>No items found</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recipient Info and Tracking */}
                  <div className='h-max w-full flex flex-col lg:flex-row items-center gap-3'>
                    <div className='h-full w-full lg:w-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 overflow-x-hidden p-3'>
                      <span className='text-base font-bold'>Recipient&apos;s Information</span>
                      <div className='w-full flex flex-col gap-2 pt-5'>
                        <span className='flex flex-col w-full leading-5'>
                          <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>name</strong>
                          <p>{selectedOrder.customerName}</p>
                        </span>
                        <span className='flex flex-col w-full leading-5'>
                          <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>email</strong>
                          <p>{selectedOrder.email}</p>
                        </span>
                        <span className='flex flex-col w-full leading-5'>
                          <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>contact</strong>
                          <p>{selectedOrder.contactNumber}</p>
                        </span>
                        <span className='flex flex-col w-full leading-5'>
                          <strong className='uppercase text-[10px] font-extrabold text-neutral-600'>address</strong>
                          <p>{selectedOrder.deliveryAddress}</p>
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Tracking Section */}
                    <div className='h-max lg:h-full lg:max-h-[33vh] xl:max-h-[31vh] w-full lg:w-1/2 rounded-xl bg-neutral-100 shadow-md shadow-black/20 p-3 gap-3 flex flex-col xl:overflow-hidden'>
                      <span className='text-base font-bold'>Order Tracking</span>
                      <div className='h-max xl:h-full w-full flex flex-col xl:overflow-y-auto overflow-x-hidden pr-2'>
                        {getTrackingEvents(selectedOrder).map((event, index) => (
                          <div key={index} className='h-max w-full flex flex-col pl-5 py-3 relative 
                            before:h-3 before:w-3 before:bg-blue before:rounded-xs before:absolute before:z-20 before:left-0 before:top-4
                            after:h-full after:w-0.5 after:bg-neutral-300 after:absolute after:left-1.5 after:top-7'>
                            <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>
                              {safeFormatDate(event.timestamp)}
                            </strong>
                            <span className='flex flex-col gap-2'>
                              <strong className='text-sm font-extrabold text-dark-blue'>
                                {safeFormatTime(event.timestamp)} <span className='text-black font-normal'> ● {event.title}</span>
                              </strong>
                              {event.description && (
                                <p className='text-xs text-neutral-600'>{event.description}</p>
                              )}
                            </span>
                          </div>
                        ))}
                        {getTrackingEvents(selectedOrder).length === 0 && (
                          <div className='h-max w-full flex flex-col pl-5 py-3 relative 
                            before:h-3 before:w-3 before:bg-blue before:rounded-xs before:absolute before:z-20 before:left-0 before:top-4'>
                            <strong className='uppercase font-extrabold text-xs text-neutral-500 mb-3'>
                              {safeFormatDate(selectedOrder.orderDate)}
                            </strong>
                            <span className='flex flex-col gap-2'>
                              <strong className='text-sm font-extrabold text-dark-blue'>
                                {safeFormatTime(selectedOrder.orderDate)} <span className='text-black font-normal'> ● Order Placed</span>
                              </strong>
                              <p className='text-xs text-neutral-600'>Your order has been received and is being processed</p>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                 {/* Right Sidebar */}
                        <div className='col-span-full xl:col-span-2 h-max w-full flex flex-col lg:grid lg:grid-cols-2 xl:flex xl:flex-col gap-3'>
                            {/* Shipping Method */}
                            <div className='rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold pl-3'>Shipping Method</span>
                                <span className='w-full p-4 flex items-center gap-2'>
                                    {selectedOrder.shippingMethod === 'delivery' ? (
                                        <>
                                        <span className='h-12 aspect-square rounded-xl bg-dark-blue text-white items-center justify-center flex text-2xl'>
                                            <RiTruckLine />
                                        </span>
                                        <span className='w-full text-sm flex items-center justify-between'>
                                            <strong className='font-extrabold text-neutral-700'>Door-to-door Delivery</strong>
                                            <span className='text-xs flex items-center gap-1 ml-auto'>₱<strong className='text-base font-extrabold'>{inPeso(selectedOrder.shippingFee)}</strong></span>
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
                            
                            {/* Payment Method */}
                            <div className='rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 p-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold'>Mode of Payment</span>
                                {selectedOrder.paymentMethod === 'cod' ? (
                                    <span className='flex items-center justify-between w-full mt-3 py-2 px-3 text-white rounded-xl bg-dark-blue'>
                                        <span className='uppercase font-bold flex text-xs gap-2 items-center'><TbTruckDelivery className='text-2xl'/>cash on delivery</span>
                                        <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-xl'>250.00</span></p>
                                    </span>
                                ) : (
                                    <span className='flex flex-col justify-center w-full mt-3 py-2 px-3 gap-1 text-white rounded-xl bg-dark-blue'>
                                        <span className='flex items-center justify-between'>
                                            <p className='uppercase text-sm font-bold tracking-wide'>{payment[selectedOrder.paymentMethod]?.title || selectedOrder.paymentMethod}</p>
                                            {payment[selectedOrder.paymentMethod]?.image}
                                        </span>
                                        <span className='flex items-end justify-between gap-5'>
                                            <span className='w-full flex flex-col justify-start'>
                                                <h5 className='text-xs'>{payment[selectedOrder.paymentMethod]?.label}</h5>
                                                <span className='flex w-full items-center gap-0.5 '>
                                                    {Array.from({ length: payment[selectedOrder.paymentMethod]?.digit || 4 }).map((_,i) => (
                                                        <span key={i} className={`h-5 min-w-1 ${showBilling ? 'text-sm' : 'text-xs'} font-extrabold`}>
                                                            {showBilling ? 
                                                            selectedOrder.paymentMethod === 'credit' ? `${(i+1) % 5 === 0 ? ' ' : `${i%4 + 1}`}`: 
                                                            `${i%4 + 1}`
                                                            : selectedOrder.paymentMethod === 'credit' ? `${(i+1) % 5 === 0 ? ' ' : '●'}` : '●' 
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
                                            <p className='flex items-center gap-1 text-xs'>₱<span className='font-bold text-xl'>{inPeso(selectedOrder.total)}</span></p>
                                        </span>
                                    </span>
                                )}
                            </div>
                            
                            {/* Order Summary */}
                            <div className='col-span-full rounded-xl bg-neutral-100 shadow-md shadow-black/20 pt-3 w-full flex flex-col overflow-hidden'>
                                <span className='text-base font-bold pl-3'>Summary</span>
                                <div className='w-full flex flex-col mt-5'>
                                    <span className='w-full flex items-center justify-between px-5'>
                                        <strong className='font-extrabold'>Subtotal</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>{inPeso(selectedOrder.subtotal)}</strong></span>
                                    </span>
                                    <span className='w-full flex items-center justify-between px-5'>
                                        <strong className='font-extrabold'>Delivery Fee</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>{inPeso(selectedOrder.shippingFee)}</strong></span>
                                    </span>
                                    {selectedOrder.discount > 0 && (
                                        <span className='w-full flex items-center justify-between gap-2 pb-5 px-5'>
                                            <strong className='font-extrabold'>Discount</strong>
                                            <strong className='mr-auto font-semibold text-sm'>({inPeso((selectedOrder.discount / selectedOrder.subtotal) * 100)}% less)</strong>
                                            <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>{inPeso(selectedOrder.discount)}</strong></span>
                                        </span>
                                    )}
                                    <span className='w-full flex items-center justify-between py-2 px-5 bg-dark-blue text-white'>
                                        <strong className='font-extrabold'>Total</strong>
                                        <span className='text-sm flex items-center gap-1'>₱<strong className='font-extrabold text-xl'>{inPeso(selectedOrder.total)}</strong></span>
                                    </span>
                                </div>
                            </div>
                        </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Receipt for PDF Generation */}
      <div ref={receiptRef} className="h-full w-full flex" style={{display:'none'}}>
        <ReceiptTemplate 
          orderID={selectedOrder?.orderID || ''}
          customerName={selectedOrder?.customerName || ''}
          companyName={selectedOrder?.companyName || ''}
          contactNumber={selectedOrder?.contactNumber || ''}
          email={selectedOrder?.email || ''}
          deliveryAddress={selectedOrder?.deliveryAddress || ''}
          items={getOrderItems(selectedOrder)}
          shippingMethod={selectedOrder?.shippingMethod || ''}
          shippingFee={selectedOrder?.shippingFee || 0}
          paymentMethod={selectedOrder?.paymentMethod || ''}
          discount={selectedOrder?.discount || 0}
          subtotal={selectedOrder?.subtotal || 0}
          total={selectedOrder?.total || 0}
          orderDate={safeToISOString(selectedOrder?.orderDate || '')}
        />
      </div>
    </div>
  );
};

export default OrderPage;