import React from 'react'
import Image from 'next/image'
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si'

interface FooterProps {
    setPage: (page: number) => void;
};

const Footer = ({ setPage }: FooterProps) => {
  return (
    <footer className='z-50 w-full grid grid-cols-6 px-5 md:px-20 py-10 bg-footer-bg text-white gap-5'>
        <div className='col-span-2 flex flex-col gap-5 justify-center items-center'>
            <Image
                priority
                height={1024}
                width={1024}
                alt='ontap creatives logo'
                src='/images/ontap-logo.png'
                className='max-h-20 md:max-h-24 aspect-square object-contain'
                draggable={false}
            />
            <button 
                type="button"
                className='px-5 py-2 w-min rounded-full bg-blue text-white text-sm md:text-base md:pt-2 text-nowrap font-bold flex pt-3 hover:scale-105 hover:text-light-blue focus:text-light-blue focus:scale-105 ease-out duration-200'
            >Follow Us</button>
            <div className='flex gap-3 text-blue'>
                <button 
                    type="button"
                    className='text-xl md:text-3xl hover:scale-105 hover:text-light-blue focus:text-light-blue focus:scale-105 ease-out duration-200'
                ><SiFacebook /></button>
                <button 
                    type="button"
                    className='text-xl md:text-3xl hover:scale-105 hover:text-light-blue focus:text-light-blue focus:scale-105 ease-out duration-200'
                ><SiInstagram /></button>
                <button 
                    type="button"
                    className='text-xl md:text-3xl hover:scale-105 hover:text-light-blue focus:text-light-blue focus:scale-105 ease-out duration-200'
                ><SiTiktok /></button>
                <button 
                    type="button"
                    className='text-xl md:text-3xl hover:scale-105 hover:text-light-blue focus:text-light-blue focus:scale-105 ease-out duration-200'
                ><SiYoutube /></button>
            </div>
        </div>
        <div className='md:hidden col-span-4 w-full flex flex-col gap-2'>
            <h4 className='text-lg text-blue font-bold'>Address</h4>
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className='hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Unit 109, 17 Vatican Building, BF Resort Village, Las Piñas City, Philippines</a>
        </div>
        <div className='col-span-3 md:col-span-1 w-full flex flex-col'>
            <h4 className='text-lg col-span-full mb-2 text-blue font-bold md:text-2xl'>Company</h4>
            <button 
                className='md:text-lg text-left hover:text-light-blue focus:text-light-blue ease-out duration-200'
                onClick={() => setPage(5)}
            >About Us</button>
            <button 
                type='button'
                className='text-left md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Contact Us</button>
            <button
                type='button'
                className='text-left md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
                onClick={() => setPage(2)}
            >FAQs</button>
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className='md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Device Compatibility</a>
        </div>
        <div className='col-span-3 md:col-span-1 w-full flex flex-col'>
            <h4 className='text-lg mb-2 text-blue font-bold md:text-2xl '>Legal</h4>
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className='md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Terms and Conditions</a>
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className='md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Privacy Policy</a>
            </div>
        <div className='col-span-2 md:col-span-2 hidden md:flex w-full flex-col'>
            <h4 className='text-lg text-blue font-bold md:text-2xl'>Address</h4>
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className='md:text-lg hover:text-light-blue focus:text-light-blue ease-out duration-200'
            >Unit 109, 17 Vatican Building, BF Resort Village, Las Piñas City, Philippines</a>
        </div>
        <p className='col-span-full w-full text-center text-sm border-t border-t-gray-400 text-gray-400 pt-5'>All rights reserved &copy; {new Date().getFullYear()} <em>Powered by </em>OnTap</p>
    </footer>
  )
}

export default Footer