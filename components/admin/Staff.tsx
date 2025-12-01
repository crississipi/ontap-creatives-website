"use client"

import { useClickOutside } from '@/hooks';
import React, { useState } from 'react'
import { RiBallPenFill, RiDeleteBinLine } from 'react-icons/ri';

const Staff = () => {
  const [role, showRoles] = useState(false);
  const [roleText, showRoleText] = useState('Sales');
  const [staffInfo, showStaffInfo] = useState(false);
  
  const outsideStaffInfo = useClickOutside<HTMLDivElement>(() => showStaffInfo(false), staffInfo);
  const outsideRoleOptions = useClickOutside<HTMLSpanElement>(() => showRoles(false), role);
  
  return (
    <div className='w-full flex flex-col'>
      <button 
        type='button' 
        className={`p-3 py-2 grid grid-cols-4 border-t border-black/5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200`}
        onClick={() => showStaffInfo(!staffInfo)}
      >
        <span className='col-span-3 text-left'>Staff Name</span>
        <span className='col-span-1 text-left'>Sales</span>
      </button>
      {staffInfo && (
        <div ref={outsideStaffInfo} className='block md:hidden h-max md:w-2/3 border border-black/20 md:rounded-xl p-1 md:p-3'>
          <span className='w-full flex items-center gap-0.5 pl-2'>
            <button type="button" className='p-2 rounded-md text-xl ml-auto hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'><RiBallPenFill /></button>
            <button type="button" className='p-2 rounded-md text-xl hover:bg-rose-200 focus:bg-rose-500 focus:text-white ease-out duration-200'><RiDeleteBinLine /></button>
          </span>
          <div className='w-full grid grid-cols-2 px-2 pb-5 mt-0 md:mt-5 gap-5'>
            <span className='col-span-1 flex flex-col w-full group'>
              <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>First Name</strong>
              <input type="text" placeholder='First Name' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200'/>
            </span>
            <span className='col-span-1 flex flex-col w-full group'>
              <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Last Name</strong>
              <input type="text" placeholder='Last Name' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200'/>
            </span>
            <span className='col-span-full flex flex-col w-full group'>
              <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Email Address</strong>
              <input type="email" placeholder='Email Address' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200'/>
            </span>
            <span className='col-span-full flex flex-col w-full group'>
              <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Role</strong>
              <span className='w-full flex relative'>
                <input type="text" placeholder='Occupation/Job Description' value={roleText} onChange={(e) => showRoleText(e.currentTarget.value.toString())} className='w-full px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' onMouseDown={() => showRoles(!role)}/>
                {role && (
                  <span ref={outsideRoleOptions} className='absolute flex flex-col top-full mt-1 rounded-md border border-black/20 w-full overflow-hidden bg-white hover:border-dark-blue ease-out duration-200'>
                    <button type="button" className='py-2 px-3 text-left hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => showRoleText('Sales')}>Sales</button>
                    <button type="button" className='py-2 px-3 text-left hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => showRoleText('Marketing')}>Marketing</button>
                    <button type="button" className='py-2 px-3 text-left hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => showRoleText('Graphic Designer')}>Graphic Designer</button>
                  </span>
                )}
              </span>
            </span>
            <div className='col-span-full grid grid-cols-2 gap-3'>
              <strong className='col-span-full'>Authorization</strong>
              <div className='w-full flex flex-col col-span-1'>
                <strong>General</strong>
                <div className='ml-2 flex flex-col'>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox"/>
                    <span>Dashboard</span>
                  </span>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Order List</span>
                  </span>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Client List</span>
                  </span>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Affiliate List</span>
                  </span>
                </div>
              </div>
              <div className='w-full flex flex-col col-span-1'>
                <strong>Page Customization</strong>
                <div className='ml-2 flex flex-col'>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Adding Products</span>
                  </span>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Changing Content</span>
                  </span>
                  <span className='flex items-center gap-2'>
                    <input type="checkbox" name="" id="" />
                    <span>Adding Offers</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Staff