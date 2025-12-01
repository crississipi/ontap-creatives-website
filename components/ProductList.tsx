"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { AnimatePresence, motion } from 'framer-motion';
import { CheckOut, PopUp, ShowMoreInfo } from '.';
import { EditProps, ProductProps } from '@/types';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

// Add interface for direct purchase product data
interface DirectPurchaseProduct {
    product: {
        productID: number;
        name: string;
        price: number;
        imgUrl?: string;
        frontUrl?: string;
        description: string;
        customPrice: number;
        category: string;
    };
    quantity: number;
    logo: string;
    subtotal: number;
    variable: 'white' | 'black';
    priceOption: 'ontap' | 'custom';
    fileInfo: { name: string; preview: string } | null;
    logoSize: string;
}

interface User {
    clientID: number;
    clientName: string;
    email: string;
    contactNumber: string;
    address: string;
}

const ProductList = ({editable}: EditProps) => {
  const [inquire, setInquireItem] = useState(false);
  const [clickedProductId, setClickedProductId] = useState<number | null>(null); 
  const [clickedProductData, setClickedProductData] = useState<ProductProps | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState<{businessCards: ProductProps[], otherProducts: ProductProps[]}>({
    businessCards: [],
    otherProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [productDataLoading, setProductDataLoading] = useState(false);
  const { toast, showToast } = useToast();
  const [gotoCheckout, setGotoCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DirectPurchaseProduct | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Fetch user session on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        setCheckingAuth(true);
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/session');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchUserSession();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts({
            businessCards: data.products.filter((p: ProductProps) => p.category === 'Business Cards'),
            otherProducts: data.products.filter((p: ProductProps) => p.category === 'Other Products')
          });
        } else {
          showToast('error', 'Failed to load products. Please try again.');
        }
      } catch (error) {
        showToast('error', 'Network error. Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch individual product data when clicked
  useEffect(() => {
    const fetchProductData = async () => {
      if (clickedProductId) {
        setProductDataLoading(true);
        try {
          const response = await fetch(`https://ontap-creatives-website.vercel.app/api/products/${clickedProductId}`);
          const data = await response.json();
          
          if (data.success) {
            setClickedProductData(data.product);
          } else {
            showToast('error', `Failed to load product details: ${data.error || 'Please try again.'}`);
            handleCloseShowMoreInfo();
          }
        } catch (error) {
          showToast('error', 'Network error. Failed to load product details.');
          handleCloseShowMoreInfo();
        } finally {
          setProductDataLoading(false);
        }
      }
    };

    if (clickedProductId) {
      fetchProductData();
    }
  }, [clickedProductId]);

  const handleSetClickedItem = (productID: number) => {
    if (clickedProductId === productID && inquire) {
      return;
    }
    
    setClickedProductId(productID);
    setClickedProductData(null);
    setInquireItem(true);
  };

  // Function to properly close the ShowMoreInfo component
  const handleCloseShowMoreInfo = () => {
    setInquireItem(false);
    setClickedProductId(null);
    setClickedProductData(null);
    setProductDataLoading(false);
  };

  // Function to handle checkout close
  const handleCloseCheckout = () => {
    setGotoCheckout(false);
    setSelectedProduct(null);
  };

  // Format direct purchase product for cart
  const formatProductForCart = (productData: DirectPurchaseProduct) => {
    return {
      cartID: Date.now(), // Temporary ID for direct purchase
      productID: productData.product.productID,
      clientID: user?.clientID || 0,
      quantity: productData.quantity,
      subtotal: productData.subtotal,
      logo: productData.logo,
      status: 'direct_purchase',
      dateAdded: new Date().toISOString(),
      product: productData.product
    };
  };

  // Check if all data is loaded and ready to display ShowMoreInfo
  const isShowMoreInfoReady = inquire && clickedProductData && !productDataLoading;

  if (loading) { 
    return (
      <section className='min-h-[100vh] w-full flex items-center justify-center py-16 bg-neutral-50'>
        <Image
          height={2048}
          width={2048}
          alt='animated logo'
          src='/icons/animated-logo.gif'
          className='h-20 object-contain object-center'
        />
      </section>
    );
  }
  
  return (
    <section className='min-h-[100vh] w-full flex flex-col items-center justify-center py-16 bg-neutral-50 relative'>
      {toast.show && (
        <Toast 
          icon={toast.icon}
          message={toast.message}
        />
      )}
            
      {/* Loading overlay for product data */}
      {productDataLoading && (
        <div className='h-full w-full flex items-center justify-center bg-white/15 backdrop-blur-sm fixed z-999 top-0 left-0'>
          <Image
            height={2048}
            width={2048}
            alt='animated logo'
            src='/icons/animated-logo.gif'
            className='h-20 object-contain object-center'
          />
        </div>
      )}

      <h1 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>OnTap BizCard Products</h1>
      {productDataLoading && (
        <div className='h-full w-full flex items-center justify-center bg-white/15 backdrop-blur-sm fixed z-999 top-0 left-0'>
          <Image
            height={2048}
            width={2048}
            alt='animated logo'
            src='/icons/animated-logo.gif'
            className='h-20 object-contain object-center'
          />
        </div>
      )}
      
      {/* ShowMoreInfo Modal */}
      {isShowMoreInfoReady && (
        <ShowMoreInfo 
          product={clickedProductData}
          editable={editable}
          setInquireItem={handleCloseShowMoreInfo}
          inquire={inquire}
          setGotoCheckout={setGotoCheckout}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {/* CheckOut Component for direct purchases */}
      {gotoCheckout && selectedProduct ? (
        <CheckOut 
          setGotoCheckout={handleCloseCheckout}
          selectedItems={[]}
          cartItems={[formatProductForCart(selectedProduct)]}
          user={user} // Pass user data (might be null if not logged in)
        />
      ) : (
        <>
        <div className='w-full 2xl:w-3/4 h-auto grid grid-cols-2 gap-3 px-3 py-8 md:grid-rows-2 md:px-10 lg:grid-rows-1 lg:grid-cols-3 lg:h-full xl:grid-cols-4'>
          {products.businessCards.map((val, i) => (
            <motion.div
              key={`prodcard-${i}`}
              initial={{scale: 0.7}}
              animate={{scale: 1}}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
                delay: (i + 1) / 10
              }}
              className='col-span-1 h-auto flex md:row-span-1'
            >
              <ProductCard 
                  product={val}
                  size='w-full aspect-[9/10] aspect-[3/4]'
                  setInquireItem={setInquireItem}
                  setClickedItem={handleSetClickedItem}
                  hoverable={true}
                  inquire={inquire}
                />
            </motion.div>
          ))}
        </div>
        
        <h2 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>Other Products</h2>
        <div className='w-full h-full grid grid-cols-2 gap-3 px-3 md:px-10 py-8 lg:grid-cols-3 xl:grid-cols-4 2xl:w-3/4'>
          {products.otherProducts.map((val, i) => (
            <motion.div
              key={`otherprodcard-${i}`}
              initial={{scale: 0.7}}
              animate={{scale: 1}}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
                delay: (i + 1) / 10
              }}
              className='h-auto w-auto aspect-[2/3]'
            >
              <ProductCard 
                product={val}
                size='h-full w-full'
                setInquireItem={setInquireItem}
                setClickedItem={handleSetClickedItem}
                hoverable={true}
                inquire={inquire}
              />
            </motion.div>
          ))}
        </div>
        </>
      )}
      
      <AnimatePresence mode='wait'>{showPopup && <PopUp setShowPopup={setShowPopup}/>}</AnimatePresence>
    </section>
  );
};

export default ProductList