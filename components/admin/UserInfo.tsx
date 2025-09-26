"use client"

import React, { useState } from 'react'
import { RiArrowDownSLine, RiCalendarLine, RiMapPin2Line, RiPhoneLine, RiSendPlane2Line } from 'react-icons/ri';
import UserRetention from './UserRetention';
import Image from 'next/image';

interface UserInfoProps {
    name: string;
    company: string;
}

const UserInfo = () => {
  return (
    <div className='w-full h-full flex flex-col px-5 py-10 pb-5 gap-5 bg-neutral-100'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
          <h1 className='text-2xl font-semibold'>Inquiry Thread</h1>
        </div>
        <div className='h-full w-full grid grid-cols-3 gap-x-3 overflow-hidden'>
          <div className='col-span-2 h-full flex flex-col justify-center gap-5 overflow-hidden'>
            <div className='h-full w-full rounded-md bg-white shadow-md shadow-neutral-200 flex flex-col justify-start gap-3 p-5 overflow-hidden'>
              <div className='h-auto w-full flex items-start'>
                <span className='flex flex-col leading-4'>
                  <h2 className='font-bold text-lg'>Juan Dela Cruz</h2>
                  <h3 className='text-dark-blue mb-3'>Panday</h3>
                  <span className='flex items-end gap-1'><RiMapPin2Line /> Metro Manila, Philippines</span>
                </span>
                <span className='flex flex-col ml-auto items-end gap-2'>
                  <a href='tel:+639183465678' className='flex w-min text-nowrap gap-3 items-center border rounded-md py-3 px-5 hover:bg-light-blue hover:border-blue focus:bg-violet focus:border-transparent focus:text-white ease-out duration-200'><RiPhoneLine className='text-xl'/> +63 918 346 5678</a>
                  <h3 className='flex items-center justify-between gap-3'>Last Visited: <span className='font-semibold'>22.09.25 10:00</span></h3>
                </span>
              </div>
              <div className='h-full w-full bg-light-blue/30 overflow-x-hidden p-3 flex flex-col gap-5'>
                <div className='flex flex-col w-4/5 mr-auto'>
                  <div className='w-full rounded-lg bg-white px-5 py-4'>
                    Hello OnTap Sales/Marketing Team,
                    <br/><br/>
                    I hope this message finds you well. I am reaching out to inquire about the availability and details of your Poly Vinyl product. Could you kindly provide me with information regarding:
                    <br/><br/>
                    Pricing for different quantities
                    Available sizes and material options
                    Estimated production and delivery time
                    <br/><br/>
                    Best regards,
                    <br/>
                    Cris Julius Malipico<br/>
                    +63 961 771 3925<br/>
                    crismalipico12@gmail.com
                  </div>
                  <span className='ml-3 mt-1 text-violet text-sm font-bold'>9/15/2025, 11:12:42 PM</span>
                </div>
                <div className='flex flex-col items-end w-4/5 ml-auto'>
                  <div className='w-full rounded-lg bg-white px-5 py-4'>
                    Hello OnTap Sales/Marketing Team,
                    <br/><br/>
                    I hope this message finds you well. I am reaching out to inquire about the availability and details of your Poly Vinyl product. Could you kindly provide me with information regarding:
                    <br/><br/>
                    Pricing for different quantities
                    Available sizes and material options
                    Estimated production and delivery time
                    <br/><br/>
                    Best regards,
                    <br/>
                    Cris Julius Malipico<br/>
                    +63 961 771 3925<br/>
                    crismalipico12@gmail.com
                  </div>
                  <span className='mx-3 mt-1 text-violet text-sm font-bold'>9/15/2025, 11:12:42 PM</span>
                </div>
                <div className='flex flex-col w-4/5 mr-auto'>
                  <div className='w-full rounded-lg bg-white px-5 py-4'>
                    Hello OnTap Sales/Marketing Team,
                    <br/><br/>
                    I hope this message finds you well. I am reaching out to inquire about the availability and details of your Poly Vinyl product. Could you kindly provide me with information regarding:
                    <br/><br/>
                    Pricing for different quantities
                    Available sizes and material options
                    Estimated production and delivery time
                    <br/><br/>
                    Best regards,
                    <br/>
                    Cris Julius Malipico<br/>
                    +63 961 771 3925<br/>
                    crismalipico12@gmail.com
                  </div>
                  <span className='ml-3 mt-1 text-violet text-sm font-bold'>9/15/2025, 11:12:42 PM</span>
                </div>
              </div>
              <div className='h-20 w-full rounded-md border border-neutral-300 p-2 flex items-start gap-3'>
                <Image
                  height={500}
                  width={500}
                  alt='gmail logo'
                  src='/icons/gmaillogo.png'
                  className='h-5 w-5 object-contain object-center mt-0.5'
                  draggable={false}
                />
                <textarea className='resize-none w-full ' defaultValue={'Write your reply here...'}></textarea>
                <button type="button" className='p-2 rounded-sm border border-transparent my-auto text-2xl hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'><RiSendPlane2Line /></button>
              </div>
            </div>
          </div>
          <div className='col-span-1 h-full flex flex-col items-center gap-5 overflow-hidden'>
            <div className='h-full w-full rounded-md bg-white shadow-md shadow-neutral-200 flex flex-col items-center p-5 gap-5'>
              <h3 className='font-semibold text-sm text-left w-full'>Inquired Item</h3>
              <Image
                height={500}
                width={500}
                alt='gmail logo'
                src='/images/card-2.png'
                className='w-2/3 object-contain object-center mt-0.5'
                draggable={false}
              />
              <h4 className='w-full text-left font-medium'>Product Name</h4>
            </div>
            <div className='h-auto w-full rounded-md bg-white shadow-md shadow-neutral-200 flex flex-col gap-5 p-5 justify-start'>
              <h3 className='font-semibold text-sm'>Activity</h3>
              <UserRetention accessedIn='userinfo'/>
              <div className='w-full grid grid-cols-2 gap-3 px-5'>
                <div className='col-span-1 rounded-md p-3 border border-[#212529] flex items-center gap-3'>
                  <span className='h-3 w-3 bg-[#212529] rounded-full'></span>
                  <h4>Idle</h4>
                  <p className='text-sm ml-auto'>~ 3mins</p>
                </div>
                <div className='col-span-1 rounded-md p-3 border border-[#5199D3] flex items-center gap-3'>
                  <span className='h-3 w-3 bg-[#5199D3] rounded-full'></span>
                  <h4>Mainpage</h4>
                  <p className='text-sm ml-auto'>~ 3mins</p>
                </div>
                <div className='col-span-1 rounded-md p-3 border border-[#2C4594] flex items-center gap-3'>
                  <span className='h-3 w-3 bg-[#2C4594] rounded-full'></span>
                  <h4>Product Page</h4>
                  <p className='text-sm ml-auto'>~ 3mins</p>
                </div>
                <div className='col-span-1 rounded-md p-3 border border-[#5A5CA8] flex items-center gap-3'>
                  <span className='h-3 w-3 bg-[#5A5CA8] rounded-full'></span>
                  <h4>About Us</h4>
                  <p className='text-sm ml-auto'>~ 3mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserInfo