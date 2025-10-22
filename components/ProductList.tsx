"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { AnimatePresence, motion } from 'framer-motion';
import { PopUp, ShowMoreInfo } from '.';
import { EditProps, ProductProps } from '@/types';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
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
        // Show error toast for network errors
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
        setProductDataLoading(true); // Start loading individual product data
        try {
          const response = await fetch(`/api/products/${clickedProductId}`);
          const data = await response.json();
          
          if (data.success) {
            setClickedProductData(data.product);
          } else {
            // Show error toast if product fetch fails
            showToast('error', `Failed to load product details: ${data.error || 'Please try again.'}`);
            handleCloseShowMoreInfo(); // Reset states on error
          }
        } catch (error) {
          // Show error toast for network errors
          showToast('error', 'Network error. Failed to load product details.');
          handleCloseShowMoreInfo(); // Reset states on error
        } finally {
          setProductDataLoading(false); // End loading individual product data
        }
      }
    };

    if (clickedProductId) {
      fetchProductData();
    }
  }, [clickedProductId]);

  const handleSetClickedItem = (productID: number) => {
    // If clicking the same product that's already open, do nothing
    if (clickedProductId === productID && inquire) {
      return;
    }
    
    setClickedProductId(productID);
    setClickedProductData(null); // Reset previous product data
    setInquireItem(true); // Show loading state immediately
  };

  // Function to properly close the ShowMoreInfo component
  const handleCloseShowMoreInfo = () => {
    setInquireItem(false);
    setClickedProductId(null);
    setClickedProductData(null);
    setProductDataLoading(false);
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
      
      {isShowMoreInfoReady && (
        <ShowMoreInfo 
          product={clickedProductData}
          editable={editable}
          setInquireItem={handleCloseShowMoreInfo} // Use the new close function
          inquire={inquire}        
        />
      )}
      
      <AnimatePresence mode='wait'>{showPopup && <PopUp setShowPopup={setShowPopup}/>}</AnimatePresence>
    </section>
  );
};

export default ProductList