"use client";
import React from 'react'
import Image from 'next/image'
import { ProductCardProps, ProductProps } from '@/types';

type ProdCard = ProductCardProps & ProductProps;

const ProductCard = ({ imgUrl, productName, productDesc, size, setInquireItem, hoverable, setClickedItem, frontImg, backImg }: ProdCard ) => {

  return (
    <button 
      className={`col-span-1 relative flex flex-col items-center rounded-md bg-white ${hoverable ? `${size} border border-neutral-200 group hover:shadow-lg hover:scale-101 md:hover:scale-105 hover:border-0 ease-out duration-500` : 'w-full h-1/2 md:h-full md:w-2/5 md:bg-light-blue'}`}
      onClick={() => {
        setClickedItem?.({ imgUrl, name: productName, desc: productDesc, frontImg, backImg });
        setInquireItem(true);
      }}
    >
        <div className='h-3/5 w-full flex items-center justify-center relative'>
          
          { size !== 'h-full w-full' && size !== 'min-h-3/7 w-full md:aspect-[3/5]' ? (
            <div
              className='hidden md:block absolute w-3/4 aspect-[3/2] top-1/2 -translate-1/2 left-1/2 z-50 rounded-xl [perspective:1000px]'
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
                    />
                  </div>
                  {frontImg !== '/images/card-4/front-card.png' && (
                    <div className="absolute inset-0">
                      <Image
                        src={backImg!}
                        alt="Back"
                        fill
                        className="object-cover rounded-xl shadow-lg backface-hidden"
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
                      />
                    </div>
                  )}
                  <div className="absolute inset-0">
                    <Image
                      src={frontImg!}
                      alt="Front"
                      fill
                      className="object-cover rounded-xl shadow-lg backface-hidden"
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
              />
            </div>
          )}
        </div>
        <h2 className={`font-bold ${hoverable ? 'pt-3 md:pt-0 text-base md:text-xl' : 'pt-16 md:pt-0 text-xl'}`}>{productName}</h2>
        <p className='hidden md:block mt-3 mb-5 px-5 text-justify group-hover:px-5.5 ease-out duration-500'>{productDesc}</p>
      
        {hoverable && (
            <span 
                className='text-sm py-3 md:text-base mt-auto md:py-4 bg-light-blue w-full font-semibold text-center group-hover:bg-blue group-focus:bg-dark-blue group-focus:text-white ease-out duration-500'
            >
              INQUIRE NOW
            </span>
        )}
    </button>
  )
}

export default ProductCard
