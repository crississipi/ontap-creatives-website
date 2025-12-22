"use client"

import React, { useState } from 'react'
import { RiStarFill, RiStarLine } from 'react-icons/ri'

// Custom hook for rating logic
const useStarRating = (totalStars = 5) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    setSelectedRating(index + 1);
  };

  const isStarFilled = (index: number) => {
    if (hoverRating > 0) {
      return index < hoverRating;
    }
    return index < selectedRating;
  };

  const resetRating = () => {
    setSelectedRating(0);
    setHoverRating(0);
  };

  return {
    selectedRating,
    hoverRating,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    isStarFilled,
    resetRating,
    totalStars,
  };
};

const Feedback = () => {
  const {
    selectedRating,
    hoverRating,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    isStarFilled,
    resetRating,
    totalStars,
  } = useStarRating(5);

  return (
    <div className='h-screen w-full flex flex-col bg-white p-5'>
      <h1 className='text-3xl font-bold text-dark-blue'>Product Feedback</h1>
      <div className='h-full w-full flex'>
        <div className='h-full w-2/5 flex items-center justify-center'>
          <div className='h-9/10 w-2/3 rounded-2xl shadow-xl bg-white border border-black/10 p-5 flex flex-col gap-3'>
            <span className='text-2xl font-bold'>Order Details</span>
            <div className='h-1/3 w-full rounded-md bg-neutral-100 p-3 flex flex-col gap-2'>
              <span className='w-full h-16 rounded-sm bg-light-blue p-2 flex'>
                <span className='h-full aspect-square bg-dark-blue'>
                </span>
              </span>
              <span className='w-full h-16 rounded-sm bg-light-blue p-2 flex'>
                <span className='h-full aspect-square bg-dark-blue'>
                </span>
              </span>
              <span className='w-full h-16 rounded-sm bg-light-blue p-2 flex'>
                <span className='h-full aspect-square bg-dark-blue'>
                </span>
              </span>
            </div>
            <div className='w-full h-28 rounded-md bg-neutral-100'></div>
            <div className='w-full h-28 rounded-md bg-neutral-100'></div>
            <div className='w-full h-28 rounded-md bg-neutral-100'></div>
            
          </div>
        </div>
        <div className='w-3/5 h-full p-5 pt-20 flex flex-col'>
          <h2 className='text-xl'>Thank you for purchasing!</h2>
          <p>We hope you enjoy our products. Please share your experience with us.</p>
          <div className='w-2/3 h-full mt-10 flex flex-col gap-10 items-center'>
            <div className='flex gap-1 text-4xl md:text-5xl lg:text-6xl'>
              {Array.from({ length: totalStars }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`
                    cursor-pointer 
                    transition-all 
                    duration-200 
                    transform 
                    hover:scale-110 
                    active:scale-95
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-yellow-400 
                    focus:ring-opacity-50
                    rounded-full
                    p-1
                    ${isStarFilled(index) 
                      ? 'text-yellow-500 filter drop-shadow' 
                      : 'text-gray-300 hover:text-yellow-300'
                    }
                  `}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
                  aria-label={`Rate ${index + 1} out of ${totalStars} stars`}
                >
                  {isStarFilled(index) ? 
                    <RiStarFill /> :
                    <RiStarLine />
                  }
                </button>
              ))}
            </div>
            <textarea placeholder='Leave us a message...' className='resize-none w-full h-1/3 border-2 border-neutral-400 rounded-xl p-3 text-lg hover:border-blue focus:border-dark-blue ease-out duration-200'></textarea>
            <button type="button" className='py-3 px-5 rounded-md border-2 border-violet bg-violet/20 ml-auto text-violet font-bold hover:border-blue hover:bg-blue/20 hover:text-blue focus:border-dark-blue focus:bg-dark-blue focus:text-white ease-out duration-200'>Submit Feedback</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback