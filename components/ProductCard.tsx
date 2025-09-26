"use client";

import React, { JSX, useState } from 'react'
import Image from 'next/image'
import { ProductCardProps, ProductProps } from '@/types';
import { RiChatPollLine, RiDiscountPercentLine, RiSparklingLine, RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';
import { MdOutlineTrendingUp } from 'react-icons/md';
import { FaAward } from 'react-icons/fa';
import { HiMiniFire } from 'react-icons/hi2';
import { LuHandCoins } from 'react-icons/lu';
import { TbCurrencyPeso } from 'react-icons/tb';

type ProdCard = ProductCardProps & ProductProps;

const ProductCard = ({ imgUrl, productName, productDesc, size, setInquireItem, hoverable, setClickedItem, frontImg, backImg, price, ratings, sold, variableBackImg, variableFrontImg }: ProdCard ) => {
  const Tag: Record<string, JSX.Element> = {
    'Trending': <span className='px-3 pl-1 py-1 gap-3 rounded-full border border-amber-600 flex text-sm items-center'>
      <span className='rounded-full bg-amber-500 p-1 text-base text-white'><MdOutlineTrendingUp /></span>
      Trending
    </span>,
    'Best Seller': <span className='px-3 pl-1 py-1 gap-3 rounded-full border border-purple-600 flex text-sm items-center'>
      <span className='rounded-full bg-purple-500 p-1 text-base text-white'><FaAward/></span>
      Best Seller
      </span>,
    'Most Popular': <span className='px-3 pl-1 py-1 gap-3 rounded-full border border-rose-600 flex text-sm items-center'>
      <span className='rounded-full bg-rose-500 p-1 text-base text-white'><HiMiniFire/></span>
      Most Popular
      </span>,
    'Most Affordable': <span className='px-3 pl-1 py-1 gap-3 rounded-full border border-emerald-600 flex text-sm items-center'>
      <span className='rounded-full bg-emerald-500 p-1 text-base text-white'><LuHandCoins/></span>  
      Most Affordable
    </span>,
    'Top Reviewed': <span className='px-3 pl-1 py-1 gap-3 rounded-full border border-fuchsia-600 flex text-sm items-center'>
      <span className='rounded-full bg-fuchsia-500 p-1 text-base text-white'><RiChatPollLine/></span>
      Top Reviewed
    </span>,
    'Discounted': <span className='px-3 pl-2 py-1 gap-3 rounded-full border border-orange-600 bg-orange-500 text-white flex text-sm items-center'><RiDiscountPercentLine  className='text-lg'/>Up to 15% off</span>,
    'Newly Launched': <span className='px-3 pl-2 py-1 gap-3 rounded-full border border-sky-600 bg-sky-500 text-white flex text-sm items-center'><RiSparklingLine  className='text-lg'/>Newly Launched</span>
  };

  return (
    <button 
      className={`relative flex flex-col items-center ${hoverable ? `${size} border border-neutral-200 group hover:shadow-lg hover:scale-101 md:hover:scale-105 hover:border-transparent ease-out duration-500` : 'w-full h-1/2 md:h-full md:w-2/5 md:bg-light-blue'}`}
      onClick={() => {
        setClickedItem?.({ imgUrl, name: productName, desc: productDesc, front:frontImg, back:backImg, price, ratings, sold, varBack:variableBackImg!, varFront:variableFrontImg! });
        setInquireItem(true);
      }}
    >
        <div className='h-1/2 w-full mt-10 flex items-center justify-center relative'>
          {size === 'w-full aspect-[3/4] md:aspect-[3/5]' && (
            <div className={`md:hidden rounded-xs md:rounded-md ${hoverable ? 'h-32 md:h-40 w-6/7 md:w-3/4 bg-neutral-200' : 'h-38 mt-18 w-full md:w-3/4 bg-light-blue md:bg-white flex justify-center'} relative`}>
              <Image
                height={500}
                width={500}
                alt='ontap creatives cards'
                src={imgUrl}
                className={`w-64 aspect-square object-contain pt-3 md:pt-5 object-center -mt-8 md:-mt-16 ${hoverable ? 'group-hover:scale-110' : 'scale-135 group-hover:scale-150'} ease-out duration-500`}
                draggable={false}
              />
            </div>
          )}
          { size !== 'h-full w-full' && size !== 'min-h-3/7 w-full md:aspect-[3/5]' ? (
            <div
              className='hidden md:block absolute w-3/4 aspect-[3/2] top-2/5 -translate-1/2 left-1/2 z-50 rounded-xl [perspective:1000px]'
            >
              <div 
                className='h-full w-full rounded-xl absolute group-hover:-rotate-x-10 group-hover:rotate-z-35 group-hover:top-10 top-0 duration-500 
                
                before:h-full before:w-full before:absolute before:-z-50 group-hover:before:rotate-x-60 group-hover:before:-rotate-y-30 before:bg-black/20 group-hover:before:top-22 group-hover:before:left-5 before:top-0 before:left-0 before:rounded-2xl before:duration-500'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-xl shadow-neutral-500 rounded-2xl">
                  <div className="absolute inset-0 rotate-y-180">
                    <Image
                      src={frontImg !== '/images/card-4/front-card.png' ? frontImg! : backImg}
                      alt="Front"
                      fill
                      className="object-cover rounded-xl shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-xl shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div 
                className='h-full w-full rounded-xl absolute  group-hover:rotate-x-40 group-hover:-rotate-y-5 group-hover:-rotate-z-20 group-hover:-top-25 group-hover:left-5 top-0 left-0 duration-500

                before:h-2/3 before:w-66/100 before:absolute before:-z-20 before:top-0 before:-left-0 before:bg-black/20 before:rounded-xl group-hover:before:top-17 group-hover:before:-left-5 group-hover:before:rotate-x-5 group-hover:before:-rotate-y-50 group-hover:before:-rotate-z-15 before:duration-500'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl">
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0 rotate-y-180">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-xl shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0">
                    <Image
                      src={frontImg!}
                      alt="Front"
                      fill
                      className="object-cover rounded-xl shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-xs md:rounded-md ${hoverable ? 'h-32 md:h-40 w-6/7 md:w-3/4 bg-neutral-200' : 'h-38 mt-18 w-full md:w-3/4 bg-light-blue md:bg-white flex justify-center'} relative`}>
              <Image
                height={500}
                width={500}
                alt='ontap creatives cards'
                src={imgUrl}
                className={`w-64 aspect-square object-contain pt-3 md:pt-5 object-center -mt-8 md:-mt-16 ${hoverable ? 'group-hover:scale-110' : 'scale-135 group-hover:scale-150'} ease-out duration-500`}
                draggable={false}
              />
            </div>
          )}
          
        </div>
        <h2 className={`font-bold mt-auto ${hoverable ? 'pt-3 md:pt-0 text-base md:text-xl' : 'pt-16 md:pt-0 text-xl'} text-left px-5 w-full`}>{productName}</h2>
        <div className='w-full flex items-center justify-between px-5 my-5'>
          <div className='text-left flex font-extrabold items-center'>
            {price.ontap === 0 ? (
              <p className='text-xl'>Upon Inquiry</p>
            ) : (
              <>
                <TbCurrencyPeso className='text-2xl'/>
                <p className='text-3xl'>{price.ontap.toLocaleString()}</p>
              </>
            )}
          </div>
          <div className='flex flex-col items-end leading-5'>
            <span className='flex items-center gap-1 text-amber-500'>
              {ratings > 4.5 && <RiStarFill />}
              {ratings <= 4.5 && <RiStarHalfFill />}
              {ratings < 3 && <RiStarLine />}
              
              <strong>{ratings}</strong>
              <p className='text-neutral-500 text-sm'>({sold - 20} reviews)</p>
            </span>
            <p className='text-sm'><strong>{sold}</strong> sold</p>
          </div>
        </div>
    </button>
  )
}

export default ProductCard
