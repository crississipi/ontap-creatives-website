import React from 'react'
import { Hero } from '..'

const Customization = () => {
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 gap-10 pb-5 flex flex-col relative md:pl-10 2xl:pl-5'>
      <h1 className='text-2xl font-semibold'>Customization</h1>
      <div className='h-full w-full bg-black flex relative'>
        <div className='h-full w-1/5 bg-white p-5'>
          <h2 className='text-xl text-dark-blue font-bold'>Preferences</h2>
        </div>
        <div className='h-full w-full flex items-center justify-center relative overflow-hidden'>
          <Hero endWarping={true} editable={true} />
        </div>
      </div>
    </div>
  )
}

export default Customization