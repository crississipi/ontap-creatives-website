"use client";
import React from 'react'
import Image from 'next/image'
import { ProductCardProps, ProductProps } from '@/types';

type ProdCard = ProductCardProps & ProductProps;

const ProductCard = ({ imgUrl, productName, productDesc, size, setInquireItem, hoverable, setClickedItem }: ProdCard ) => {

  return (
    <button 
      className={`col-span-1 flex flex-col items-center rounded-md overflow-hidden bg-white ${hoverable ? `${size} border border-neutral-200 group hover:shadow-lg hover:scale-101 md:hover:scale-105 hover:border-0 ease-out duration-200` : 'w-full h-1/2 md:h-full md:w-2/5 md:bg-light-blue'}`}
      onClick={() => {
        setClickedItem?.({ imgUrl, name: productName, desc: productDesc });
        setInquireItem(true);
      }}
    >
        <div className='h-3/5 w-full flex items-center justify-center'>
            <div className={`rounded-xs md:rounded-md ${hoverable ? 'h-32 md:h-40 w-6/7 md:w-3/4 bg-neutral-200' : 'h-38 mt-18 w-full md:w-3/4 bg-light-blue md:bg-white flex justify-center'} relative`}>
                <Image
                    height={500}
                    width={500}
                    alt='ontap creatives cards'
                    src={imgUrl}
                    className={`w-64 aspect-square object-contain pt-3 md:pt-5 object-center -mt-8 md:-mt-16 ${hoverable ? 'group-hover:scale-110' : 'scale-135 group-hover:scale-150'} ease-out duration-200`}
                />
            </div>
        </div>
        <h2 className={`font-bold ${hoverable ? 'pt-3 md:pt-0 text-base md:text-xl' : 'pt-16 md:pt-0 text-xl'}`}>{productName}</h2>
        <p className='hidden md:block mt-3 mb-5 px-5 text-justify group-hover:px-5.5 ease-out duration-200'>{productDesc}</p>
      
        {hoverable && (
            <span 
                className='text-sm py-3 md:text-base mt-auto md:py-4 bg-light-blue w-full font-semibold text-center group-hover:bg-blue group-focus:bg-dark-blue group-focus:text-white ease-out duration-200'
            >
              INQUIRE NOW
            </span>
        )}
    </button>
  )
}

export default ProductCard
