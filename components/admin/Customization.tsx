import React, { JSX } from 'react'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { Content } from '.';

interface CustomizationProps {
  child: JSX.Element;
}

const Customization = ({child}: CustomizationProps) => {
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col relative overflow-hidden'>
      <div className='w-full flex items-center justify-between lg:pr-5'>
        <h1 className='text-2xl font-semibold'>Customization</h1>
        { child === <Content /> && (
          <div className='flex gap-3'>
            <button type="button" className='flex items-center gap-3 rounded-lg border border-neutral-300 text-neutral-400 px-4 py-2 hover:border-black hover:text-black focus:bg-footer-bg focus:text-white ease-out duration-200'>Cancel</button>
            <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 pl-2 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiCheckboxCircleLine  className='text-2xl'/>Apply Changes</button>
          </div>
        )}
      </div>
      <div className='w-full h-full overflow-x-hidden'>
        {child}
      </div>
    </div>
  )
}

export default Customization