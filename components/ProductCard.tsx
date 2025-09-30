"use client";

import React from 'react'
import Image from 'next/image'
import { ProductCardProps, ProductProps } from '@/types';
import { RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';
import { TbCurrencyPeso } from 'react-icons/tb';

type ProdCard = ProductCardProps & ProductProps;

const ProductCard = ({ imgUrl, productName, productDesc, size, setInquireItem, hoverable, setClickedItem, frontImg, backImg, price, ratings, sold, variableBackImg, variableFrontImg }: ProdCard ) => {
  return (
    <button 
      className={`relative flex flex-col items-center ${hoverable ? `${size} border border-neutral-200 group hover:shadow-lg hover:scale-101 hover:border-transparent ease-out duration-500` : 'w-full h-1/2 md:h-full md:w-2/5 md:bg-light-blue'}`}
      onClick={() => {
        setClickedItem?.({ imgUrl, name: productName, desc: productDesc, front:frontImg, back:backImg, price, ratings, sold, varBack:variableBackImg!, varFront:variableFrontImg! });
        setInquireItem(true);
      }}
    >
        <div className='h-1/2 w-full mt-10 flex items-center justify-center relative'>
          {size === 'w-full aspect-[9/10] aspect-[3/4]' && (
            <div
              className='md:hidden absolute w-5/6 aspect-[3/2] top-2/5 -translate-1/2 left-1/2 z-50 rounded-md [perspective:1000px]'
            >
              <div 
                className='h-full w-full rounded-lg absolute group-hover:-rotate-x-10 group-hover:rotate-z-25 group-hover:-top-2 top-0 duration-500 
                
                before:h-full before:w-full before:absolute before:-z-50 group-hover:before:rotate-x-60 group-hover:before:-rotate-y-28 before:bg-black/20 group-hover:before:top-20 group-hover:before:left-3 before:top-0 before:left-0 before:rounded-xl before:duration-500'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md shadow-neutral-300 rounded-md">
                  <div className="absolute inset-0 rotate-y-180">
                    <Image
                      src={frontImg !== '/images/card-4/front-card.png' ? frontImg! : backImg}
                      alt="Front"
                      fill
                      className="object-cover rounded-md shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-md shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div 
                className='h-full w-full rounded-xl xl:rounded-lg absolute  group-hover:rotate-x-30 group-hover:-rotate-y-5 group-hover:-rotate-z-15 group-hover:-top-20 group-hover:left-5 top-0 left-0 duration-500

                before:h-2/3 before:w-full before:absolute before:-z-20 before:top-0 before:-left-0 before:bg-black/20 before:rounded-xl group-hover:before:top-15 group-hover:before:-left-5 group-hover:before:rotate-x-5 group-hover:before:-rotate-y-50 group-hover:before:-rotate-z-15 before:duration-500'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl xl:rounded-lg">
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0 rotate-y-180">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-md shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0">
                    <Image
                      src={frontImg!}
                      alt="Front"
                      fill
                      className="object-cover rounded-md shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          { size !== 'h-full w-full' && size !== 'min-h-3/7 w-full md:aspect-[3/5]' ? (
            <div
              className='hidden md:block absolute w-3/4 aspect-[3/2] top-2/5 -translate-1/2 left-1/2 z-50 rounded-xl [perspective:1000px]  xl:rounded-lg'
            >
              <div 
                className='h-full w-full rounded-xl xl:rounded-lg absolute group-hover:-rotate-x-10 group-hover:rotate-z-35 group-hover:top-10 top-0 duration-500 
                
                before:h-full before:w-full before:absolute before:-z-50 group-hover:before:rotate-x-60 group-hover:before:-rotate-y-30 before:bg-black/20 group-hover:before:top-22 group-hover:before:left-5 before:top-0 before:left-0 before:rounded-2xl before:duration-500 group-hover:md:before:top-30 group-hover:lg:before:top-24 group-hover:xl:before:top-22 group-hover:xl:before:left-4 group-hover:2xl:before:top-26 group-hover:2xl:before:left-5'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-xl shadow-neutral-500 rounded-2xl xl:rounded-lg">
                  <div className="absolute inset-0 rotate-y-180">
                    <Image
                      src={frontImg !== '/images/card-4/front-card.png' ? frontImg! : backImg}
                      alt="Front"
                      fill
                      className="object-cover rounded-xl xl:rounded-lg shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-xl xl:rounded-lg shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div 
                className='h-full w-full rounded-xl xl:rounded-lg absolute  group-hover:rotate-x-40 group-hover:-rotate-y-5 group-hover:-rotate-z-20 group-hover:-top-25 group-hover:left-5 top-0 left-0 duration-500

                before:h-2/3 before:w-66/100 before:absolute before:-z-20 before:top-0 before:-left-0 before:bg-black/20 before:rounded-xl group-hover:before:top-17 group-hover:before:-left-5 group-hover:before:rotate-x-5 group-hover:before:-rotate-y-50 group-hover:before:-rotate-z-15 before:duration-500'
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-3d shadow-md rounded-2xl xl:rounded-lg">
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0 rotate-y-180">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-xl xl:rounded-lg shadow-lg backface-hidden"
                        draggable={false}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0">
                    <Image
                      src={frontImg!}
                      alt="Front"
                      fill
                      className="object-cover rounded-xl xl:rounded-lg shadow-lg backface-hidden"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-xs md:rounded-md ${hoverable ? 'h-24 md:h-40 w-6/7 md:w-3/4 bg-neutral-200' : 'h-38 mt-18 w-full md:w-3/4 bg-light-blue md:bg-white flex justify-center'} relative`}>
              <Image
                height={500}
                width={500}
                alt='ontap creatives cards'
                src={imgUrl}
                className={`w-64 aspect-square object-contain md:pt-5 object-center mx-auto -mt-10 md:-mt-16 scale-115 ${hoverable ? 'group-hover:scale-125' : 'scale-135 group-hover:scale-150'} ease-out duration-500`}
                draggable={false}
              />
            </div>
          )}
          
        </div>
        <h2 className={`font-bold mt-auto ${hoverable ? 'pt-3 md:pt-16 md:text-xl' : 'pt-16 md:pt-0 text-xl'} text-left px-5 w-full`}>{productName}</h2>
        <div className='w-full flex flex-col-reverse md:flex-row justify-between px-5 my-3 mt-2 md:mt-0 md:my-5'>
          <div className='text-left flex font-extrabold items-center'>
            {price.ontap === 0 ? (
              <p className='text-xl'>Upon Inquiry</p>
            ) : (
              <>
                <TbCurrencyPeso className='text-lg md:text-2xl lg:text-xl'/>
                <p className='text-2xl md:text-3xl lg:text-2xl mt-0.5 md:mt-0'>{price.ontap.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </>
            )}
          </div>
          <div className='flex flex-row md:flex-col justify-between md:justify-normal items-end leading-5 mb-3 md:mb-0'>
            <span className='flex items-center gap-1 text-amber-500'>
              {ratings > 4.5 && <RiStarFill className='mb-1 text-lg'/>}
              {ratings <= 4.5 && <RiStarHalfFill className='mb-1 text-lg'/>}
              {ratings < 3 && <RiStarLine className='mb-1 text-lg'/>}
              
              <strong>{ratings}</strong>
              <p className='text-neutral-500 text-sm text-nowrap hidden md:block xl:text-xs'>({sold - 20} reviews)</p>
            </span>
            <p className='text-sm text-nowrap'><strong className='font-extrabold'>{sold.toLocaleString()}</strong> sold</p>
          </div>
        </div>
    </button>
  )
}

export default ProductCard
