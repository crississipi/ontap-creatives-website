"use client"

import React from 'react'
import { Mainpage } from '..'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

const Content = () => {
  return (
    <div className='h-full w-full flex flex-col justify-start fixed top-0 left-0 overflow-hidden z-99 bg-white'>
      <div className='h-full w-full overflow-x-hidden relative'>
        <motion.div 
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: -76, opacity: 0.2 }}
        whileHover={{ 
          y: 0, 
          opacity: 1,
          transition: {
            duration: 0.2,
            ease: 'easeOut',
            delay: 0, // No delay on hover
          }
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
          delay: 1
        }}
        className='w-full h-24 bg-black shadow-md absolute left-1/2 z-99999 -translate-x-1/2 p-5 flex items-center justify-between'
        >
          <span className='flex flex-col'>
            <h2 className='text-xl text-light-blue'>Experimental Mode</h2>
            <p className='text-neutral-400'>You are accessing the website in <strong>experimental mode</strong></p>
          </span>
          <div className='flex gap-3'>
            <button type="button" className='flex text-xs items-center gap-3 rounded-lg border border-neutral-600 text-neutral-400 px-4 py-2 hover:border-white hover:text-white focus:bg-light-blue focus:text-violet ease-out duration-200'>Cancel</button>
            <button type="button" className='flex text-xs items-center gap-3 rounded-lg bg-blue text-white px-4 pl-2 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiCheckboxCircleLine  className='text-2xl'/>Apply Changes</button>
          </div>
        </motion.div>
        <Mainpage editable={true} />
      </div>
    </div>
  )
}

export default Content