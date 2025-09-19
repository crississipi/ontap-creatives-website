import React from 'react'
import { RiExportFill, RiSearchLine } from 'react-icons/ri'

const Customization = () => {
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col relative'>
      <div className='w-full flex items-center justify-between lg:pr-5'>
        <h1 className='text-2xl font-semibold'>Customization</h1>
        <div className='flex gap-3'>
          <div className='flex gap-2 px-3 border border-violet items-center rounded-md w-80 text-violet'>
            <RiSearchLine className='text-xl'/>
            <input type="text" placeholder='Search...' className='outline-none w-full h-full text-black placeholder:text-violet'/>
          </div>
          <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill />Export</button>
        </div>
      </div>
    </div>
  )
}

export default Customization