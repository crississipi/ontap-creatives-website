import React from 'react'
import { HiArrowRight, HiLocationMarker, HiOutlineX, HiPhone } from 'react-icons/hi'

interface PopupProps {
    setShowPopup: (showPopup: boolean) => void;
}

const PopUp = ({ setShowPopup }: PopupProps) => {
  return (
    <div className='fixed h-full w-full z-99999 bg-white/20 backdrop-blur-md flex items-center justify-center left-0'>
        <button 
            type="button" 
            className='h-12 w-12 absolute top-1/7 right-10 md:right-1/3 rounded-full bg-white text-3xl flex items-center justify-center border border-rose-200 hover:border-light-blue hover:bg-blue focus:border-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
            onClick={() => setShowPopup(false)}    
        ><HiOutlineX /></button>
        <div className='bg-white h-2/3 w-9/10 md:w-1/3 rounded-xl shadow-md p-5 gap-3 flex flex-col items-center md:justify-between'>
            <h2 className='text-lg'>You have reached the end of this page. To inquire, please leave us a message.</h2>
            <div className='flex flex-col gap-3 w-full'>
                <span className='p-3 px-5 rounded-md border border-light-blue hover:border-blue ease-out duration-200'>
                    <input type="text" placeholder='Your name' className='h-full w-full outline-none'/>
                </span>
                <span className='p-3 px-5 rounded-md border border-light-blue hover:border-blue ease-out duration-200'>
                    <input type="email" placeholder='Your email address' className='h-full w-full outline-none'/>
                </span>
                <span className='p-3 px-5 rounded-md border h-48 border-light-blue hover:border-blue ease-out duration-200'>
                    <textarea defaultValue='Your message here...' className='h-full w-full outline-none resize-none'></textarea>
                </span>
                <span className='flex justify-end'>
                    <button 
                        type="button" 
                        className='flex gap-2 items-center px-5 py-2 pr-3 rounded-md bg-light-blue hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                    >
                        Submit
                        <HiArrowRight />
                    </button>
                </span>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-3 w-full gap-2 font-bold text-sm md:text-base'>
                <span className='col-span-full w-full text-center font-normal text-lg mb-2'>- or contact us via -</span>
                <a
                    href='tel:+0270072412'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                >
                    <HiPhone className='text-xl md:text-2xl text-dark-blue'/>
                    (02) 7007-2412
                </a>
                <a
                    href='tel:+639286935815'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                >
                    <HiPhone className='text-xl md:text-2xl text-dark-blue'/>
                    +63 928 693 5815
                </a>
                <a
                    href='tel:+639772473179'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>+63 977 247 3179</a>
                <a 
                    href="https://www.google.com/maps/place/17+Vatican+City+Dr,+Las+Pi%C3%B1as" 
                    target="_blank"
                    className='col-span-full flex -ml-0.5 gap-2 md:items-center hover:underline focus:underline ease-out duration-200'
                >
                    <HiLocationMarker className='text-3xl text-rose-700'/>
                    17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City
                </a>
            </div>
        </div>
    </div>
  )
}

export default PopUp