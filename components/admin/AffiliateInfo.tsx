import React from 'react'
import { RiMapPin2Line, RiUser5Line } from 'react-icons/ri'

const AffiliateInfo = () => {
  return (
    <div className='w-full h-full flex flex-col px-5 py-10 pb-5 gap-5 bg-neutral-100'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
          <h1 className='text-2xl font-semibold w-full'>Affiliates Profile</h1>
        </div>
        <div className='h-full w-full grid grid-cols-6 gap-x-3'>
            <div className='col-span-1 flex flex-col gap-5'>
                <div className='w-full h-auto rounded-lg bg-white shadow-md shadow-neutral-200 p-5'>
                    <div className='w-full flex items-center justify-center'>
                        <span className='h-20 w-20 rounded-full bg-neutral-400 text-white flex items-center justify-center text-5xl'><RiUser5Line /></span>
                    </div>
                    <h2>Juan Dela Cruz</h2>
                    <span className='flex items-center gap-3'>
                        <h3>30</h3>
                        <span className='h-1 w-1 rounded-full bg-neutral-600'></span>
                        <h3>Male</h3>
                    </span>
                    <p className='flex items-center gap-1'><RiMapPin2Line />143 Tondo Manila, NCR</p>

                </div>
            </div>
        </div>
    </div>
  )
}

export default AffiliateInfo