"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion';
import { PopUp, ShowMoreInfo } from '.';
import { EditProps } from '@/types';

const ProductCardInfo = [
  [
    {
      imgUrl: '',
      name: 'Polyvinyl Business Card',
      desc: 
          <p>
            Upgrade the way you connect with the <strong>Polyvinyl Business Card</strong> — built from <strong>durable, high-quality polyvinyl</strong> that is <strong>waterproof, scratch-resistant, and reusable.</strong> Designed to last, it is the smarter choice over traditional paper cards.
            <br />
            <br />
            Pair it with <strong>NFC or QR code technology</strong> for instant sharing and effortless networking.
          </p>,
      frontImg: '/images/card-1/front.png',
      backImg: '/images/card-1/back.png',
      varFront: '/images/card-5/front.png',
      varBack: '/images/card-5/front.png',
      tags: ["Most Affordable", "Best Seller"],
      price: {
        ontap: 799,
        custom: 999
      },
      ratings: 4.4,
      sold: 311
    },
    {
      imgUrl: '',
      name: 'Carbon Fibre Digital Business Card',
      desc: 
          <p>
            Upgrade your networking with the <strong>Carbon Fible Digital Business Card</strong> — where <strong>luxury design meets smart technology</strong>. Crafted from <strong>premium carbon fiber</strong>, it offers a <strong>sleek, lightweight, and ultra-durable finish</strong> that sets you apart from the ordinary. 
            <br /> <br />
            Featuring <strong>NFC tap-to-share and QR code integration</strong>, you can exchange contact details, share your brand, and connect instantly — all with just one tap. Say goodbye to reprints and hello to a <strong>smarter, eco-friendly way to network.</strong>
          </p>,
      frontImg: '/images/card-2/front.png',
      backImg: '/images/card-2/back.png',
      varFront: '',
      varBack: '',
      tags: ["Most Popular", "Top Reviewed", "Best Seller"],
      price: {
        ontap: 999,
        custom: 1199
      },
      ratings: 4.8,
      sold: 394
    },
    {
      imgUrl: '',
      name: 'Bamboo Digital Business Card',
      desc: 
          <p>
            Choose sustainability with style through the <strong>Bamboo Digital Business Card</strong>. Made from <strong>eco-friendly bamboo</strong>, this card blends <strong>durability, functionality, and modern design</strong> to ensure you stand out.
            <br/><br/>
            Every piece features a <strong>distinct natural wood grain</strong>, offering a warm and elegant finish that highlights both <strong>professionalism and environmental responsibility</strong>.
          </p>,
      frontImg: '/images/card-3/front.png',
      backImg: '/images/card-3/back.png',
      varFront: '',
      varBack: '',
      tags: ["Trending", "Top Reviewed"],
      price: {
        ontap: 1499,
        custom: 2000
      },
      ratings: 4.6,
      sold: 199
    },
    {
      imgUrl: '',
      name: 'Elite Digital Business Card',
      desc: 
          <p>
            The <strong>Elite Digital Business Card</strong> offers <strong>simplicity at its finest</strong>. With a <strong>smooth acrylic build and glass-like clarity</strong>, it's a professional essential that combines <strong>modern elegance with lasting durability</strong> — perfect for those who value <strong>clean, timeless design.</strong>
            <br/> <br/>
            <strong>Acrylic luxury. Digital convenience. Lasting impression</strong>
          </p>,
      frontImg: '/images/card-4/front-card.png',
      backImg: '/images/card-4/back-card.png',
      varFront: '',
      varBack: '',
      tags: ["Most Popular", "Best Seller"],
      price: {
        ontap: 1199,
        custom: 1499
      },
      ratings: 4.3,
      sold: 521
    },
  ],
  [
    {
      imgUrl: '/images/info-tag.png',
      name: 'INFOTAP',
      desc: 
          <p>Say goodbye to bulky cards! Infotap turns your phone into a smart networking tool. Stick it on, tap, and share your world — whether it's Facebook, Instagram, YouTube, or your portfolio.
            <br/> <br/>
            Instant fun, and eco-friendly.
          </p>,
      frontImg: '',
      backImg: '',
      varFront: '',
      varBack: '',
      tags: ["Trending", "Discounted", "Most Affordable"],
      price: { ontap: 499 },
      ratings: 4.1,
      sold: 293
    },
    {
      imgUrl: '/images/id-tap.png',
      name: 'ID TAP',
      desc: 
          <p>ID Tap is designed for professionals and teams who want more than just a traditional ID. It doubles as a digital networking tool, enabling employees to represent the company while seamlessly sharing their digital identity.</p>,
      frontImg: '',
      backImg: '',
      varFront: '',
      varBack: '',
      tags: ["Best Seller", "Most Popular"],
      price: { ontap: 1200 },
      ratings: 4.7,
      sold: 1239
    },
    {
      imgUrl: '/images/dog-tag.png',
      name: 'Pet Badge',
      desc: <></>,
      frontImg: '',
      backImg: '',
      varFront: '',
      varBack: '',
      tags: ["Top Reviewed", "Trending"],
      price: { ontap: 0},
      ratings: 4.9,
      sold: 112
    },
    {
      imgUrl: '/images/key-chain.png',
      name: 'POP UP Keychain',
      desc: <></>,
      frontImg: '',
      backImg: '',
      varFront: '',
      varBack: '',
      tags: ["Discounted", "Best Seller"],
      price: { ontap: 499},
      ratings: 4.5,
      sold: 221
    },
    {
      imgUrl: '/images/qr-standee.png',
      name: 'QR Standee and Table Tap',
      desc: <></>,
      frontImg: '',
      backImg: '',
      varFront: '',
      varBack: '',
      tags: ["Trending"],
      price: { ontap: 0},
      ratings: 4.1,
      sold: 178
    },
  ]
];

const ProductList = ({editable}: EditProps) => {
  const [inquire, setInquireItem] = useState(false);
  const [clickedItem, setClickedItem] = useState<any>(null); 
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let canTrigger = true;
    let cooldownTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottom = document.documentElement.scrollHeight;

      if (scrollPosition >= bottom - 2 && canTrigger) {
        setShowPopup(true);
        canTrigger = false;

        cooldownTimer = setTimeout(() => {
          canTrigger = true;
        }, 10000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(cooldownTimer);
    };
  }, []);
  
  return (
    <section className='min-h-[100vh] w-full flex flex-col items-center justify-center py-16 bg-neutral-50 relative'>
      <h1 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>OnTap BizCard Products</h1>
      
      <div className='w-full md:w-3/4 h-full grid grid-cols-2 grid-rows-1 md:grid-cols-4 gap-3 px-3 py-8 md:px-10'>
        {ProductCardInfo[0].map((val,i) => (
          <motion.div
            key={`prodcard-${i}`}
            initial={{scale: 0.7}}
            animate={{scale: 1}}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
              delay: (i + 1) / 10
            }}
            className='col-span-1 row-span-full h-auto flex'
          >
            <ProductCard 
                key={`product-${i}`} 
                imgUrl={val.imgUrl}
                productName={val.name}
                productDesc={val.desc}
                size='w-full aspect-[3/4] md:aspect-[3/4]'
                setInquireItem={setInquireItem}
                setClickedItem={setClickedItem}
                hoverable={true}
                inquire={inquire}
                frontImg={val.frontImg}
                backImg={val.backImg}
                tags={val.tags}
                price={val.price}
                ratings={val.ratings}
                sold={val.sold}
                variableBackImg={val.varBack}
                variableFrontImg={val.varFront}
              />
          </motion.div>
        ))}
      </div>
      
      <h2 className='z-10 w-full text-center text-2xl mt-10 text-black font-semibold md:text-5xl'>Other Products</h2>
      <div className='w-full md:w-3/4 h-full grid grid-cols-2 md:grid-cols-4 gap-3 px-3 md:px-10 py-8'>
        {ProductCardInfo[1].map((val,i) => (
          <motion.div
            key={`prodcard-${i}`}
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
              setClickedItem={setClickedItem}
              hoverable={true}
              inquire={inquire}
              frontImg={val.frontImg}
              backImg={val.backImg}
              tags={val.tags}
              price={val.price}
              ratings={val.ratings}
              sold={val.sold}
              variableBackImg={val.varBack}
              variableFrontImg={val.varFront}
            />
          </motion.div>
        ))}
      </div>
        {inquire && (
          <ShowMoreInfo 
            frontImg={clickedItem.front}
            backImg={clickedItem.back}
            editable={editable}
            tags={clickedItem.tags}
            price={clickedItem.price}
            ratings={clickedItem.ratings}
            sold={clickedItem.sold}
            imgUrl={clickedItem.imgUrl}
            productName={clickedItem.name}
            productDesc={clickedItem.desc}
            size={''}
            hoverable={false} 
            setInquireItem={setInquireItem} 
            inquire={inquire} 
            variableBackImg={clickedItem.varBack}
            variableFrontImg={clickedItem.varFront}         
          />
        )}
      {showPopup && <PopUp setShowPopup={setShowPopup}/>}
    </section>
  );
};

export default ProductList
