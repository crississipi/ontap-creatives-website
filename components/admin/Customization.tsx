import React, { JSX } from 'react'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { Content } from '.';
import { EditProps } from '@/types';

interface CustomizationProps {
  child: JSX.Element;
  tag: string;
}

const Customization = ({child, tag}: CustomizationProps) => {
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col relative overflow-hidden'>
      {tag === 'content' && <div className='w-full flex items-center justify-between lg:pr-5'>
        <h1 className='text-2xl font-semibold'>Customization</h1>
      </div>}
      <div className='w-full h-full overflow-x-hidden'>
        {child}
      </div>
    </div>
  )
}

export default Customization