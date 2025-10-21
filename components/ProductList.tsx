"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { AnimatePresence, motion } from 'framer-motion';
import { PopUp, ShowMoreInfo } from '.';
import { EditProps, Product } from '@/types';

const ProductList = ({editable}: EditProps) => {
  const [inquire, setInquireItem] = useState(false);
  const [clickedItem, setClickedItem] = useState<any>(null); 
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState<{businessCards: Product[], otherProducts: Product[]}>({
    businessCards: [],
    otherProducts: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts({
            businessCards: data.products.filter((p: Product) => p.category === 'Business Cards'),
            otherProducts: data.products.filter((p: Product) => p.category === 'Other Products')
          });
        }
        console.log(products)
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ... your existing useEffect hooks ...

  if (loading) {
    return (
      <section className='min-h-[100vh] w-full flex items-center justify-center py-16 bg-neutral-50'>
        <div className='text-center'>Loading products...</div>
      </section>
    );
  }
  
  return (
    <section className='min-h-[100vh] w-full flex flex-col items-center justify-center py-16 bg-neutral-50 relative'>
      <h1 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>OnTap BizCard Products</h1>
      
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
                setClickedItem={setClickedItem}
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
              setClickedItem={setClickedItem}
              hoverable={true}
              inquire={inquire}
            />
          </motion.div>
        ))}
      </div>
      
      {inquire && clickedItem && (
        <ShowMoreInfo 
          product={clickedItem}
          editable={editable}
          setInquireItem={setInquireItem} 
          inquire={inquire}        
        />
      )}
      
      <AnimatePresence mode='wait'>{showPopup && <PopUp setShowPopup={setShowPopup}/>}</AnimatePresence>
    </section>
  );
};

export default ProductList