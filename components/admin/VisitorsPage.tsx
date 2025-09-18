import React from 'react'
import { RiArrowDownSLine, RiCalendarLine, RiExportFill } from 'react-icons/ri';

const VisitorsPage = () => {
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Visitor's Data</h1>
            <div className='flex gap-3'>
                <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill />Export</button>
            </div>
        </div>
        <div className='w-full h-full flex px-3 mt-10'>
            <div className='h-full w-full bg-white rounded-xl shadow-md shadow-neutral-200 overflow-hidden'>
                <div className='w-full grid grid-cols-10 py-1 border-b border-neutral-600 bg-violet text-white'>
                    <span className='py-2 px-5 col-span-2 text-sm font-bold border-r border-neutral-400'>Name</span>
                    <span className='py-2 px-5 col-span-1 text-sm font-bold border-r border-neutral-400'>Company</span>
                    <span className='py-2 px-5 col-span-2 text-sm font-bold border-r border-neutral-400'>Email Address</span>
                    <span className='py-2 px-5 col-span-1 text-sm font-bold border-r border-neutral-400'>Contact Number</span>
                    <span className='py-2 px-5 col-span-1 text-sm font-bold border-r border-neutral-400'>Date Visited</span>
                    <span className='py-2 px-5 col-span-1 text-sm font-bold border-r border-neutral-400'>Duration</span>
                    <span className='py-2 px-5 col-span-2 text-sm font-bold'>Activity</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VisitorsPage