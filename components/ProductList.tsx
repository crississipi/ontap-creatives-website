"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import InquireItem from './InquireItem';
import { motion } from 'framer-motion';

const ProductCardInfo = [
  [
    {
      imgUrl: '/images/card-1.png',
      name: 'Poly Vinyl',
      desc: 'Also known as a PVC business card, it is a durable and flexible material that is resistant to water, tears and fading, making it a great option for long-lasting business cards.',
    },
    {
      imgUrl: '/images/card-2.png',
      name: 'Carbon Bizcard',
      desc: 'A PVC card with a carbon sticker blends the practicality of PVC with the sophisticated look of carbon fiber, offering both functional and visual benefits.',
    },
    {
      imgUrl: '/images/card-3.png',
      name: 'Bamboo/Wood',
      desc: 'It showcase a unique blend of elegance and eco-friendliness. The natural texture and grain of Bamboo or Wood lend a touch of organic beauty on each card.',
    },
    {
      imgUrl: '/images/card-4.png',
      name: 'Elite Business Card',
      desc: 'Translucent business card made of acrylic, with frosted or glittered finish, offers a remarkable versatility, aura of innovation and contemporary sophistication, aligning  with perfectly progressive brand image.',
    },
  ],
  [
    {
      imgUrl: '/images/info-tag.png',
      name: 'Info Tap',
      desc: '',
    },
    {
      imgUrl: '/images/id-tap.png',
      name: 'ID Tap',
      desc: '',
    },
    {
      imgUrl: '/images/dog-tag.png',
      name: 'Pet Badge',
      desc: '',
    },
    {
      imgUrl: '/images/key-chain.png',
      name: 'OnTap Keychain',
      desc: '',
    },
    {
      imgUrl: '/images/qr-standee.png',
      name: 'QR Standee and Table Tap',
      desc: '',
    },
  ]
];

const ProductList = () => {
  const [inquire, setInquireItem] = useState(false);
  const [clickedItem, setClickedItem] = useState<any>(null); 
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <section className='min-h-[100vh] w-full flex flex-col items-center justify-center py-16 bg-neutral-50'>
      <h1 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>OnTap BizCard Products</h1>
      
      <div className='w-full md:w-3/4 h-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7 px-3 py-8 md:px-10'>
        {ProductCardInfo[0].map((val,i) => (
          <motion.div
            initial={{scale: 0.7}}
            animate={{scale: 1}}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
              delay: (i + 1) / 10
            }}
          >
            <ProductCard 
                key={`product-${i}`} 
                imgUrl={val.imgUrl}
                productName={val.name}
                productDesc={val.desc}
                size='aspect-[3/4] md:aspect-[3/5]'
                setInquireItem={setInquireItem}
                setClickedItem={setClickedItem}
                hoverable={true}
                inquire={inquire}
              />
          </motion.div>
        ))}
      </div>
      
      <h2 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>Other Products</h2>
      <div className='w-full md:w-3/4 h-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7 px-3 md:px-10 py-8'>
        {ProductCardInfo[1].map((val,i) => (
          <motion.div
            initial={{scale: 0.7}}
            animate={{scale: 1}}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
              delay: (i + 1) / 10
            }}
            className='h-auto w-auto aspect-[3/4]'
          >
            <ProductCard 
              key={`otherprod-${i}`} 
              imgUrl={val.imgUrl}
              productName={val.name}
              productDesc={val.desc}
              size='h-full w-full'
              setInquireItem={setInquireItem}
              setClickedItem={setClickedItem} // ✅ pass setter
              hoverable={true}
              inquire={inquire}
            />
          </motion.div>
        ))}
      </div>

      { inquire && clickedItem && (
        <InquireItem 
          imgUrl={clickedItem.imgUrl}
          productName={clickedItem.name}
          productDesc={clickedItem.desc}
          size={"min-h-3/7 w-full md:aspect-[3/5]"} 
          setInquireItem={setInquireItem} 
          inquire={inquire} 
          hoverable={false}
        />
      )}
    </section>
  );
};

export default ProductList
