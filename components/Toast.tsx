"use client"

import { motion } from 'framer-motion'
import React, { JSX } from 'react'
import { HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { HiMiniExclamationTriangle } from 'react-icons/hi2';

interface ToastProps {
    icon: string;
    message: string;
}

const Toast = ({ icon, message }: ToastProps) => {
  const Icon: Record<string, JSX.Element> = {
    "error" : <HiMiniExclamationTriangle className='text-rose-500'/>,
    "success" : <HiCheck className='text-violet'/>,
    "info" : <HiExclamationCircle className='text-sky-400'/>
  }

  return (
    <motion.div 
        animate={{boxShadow: ['0 0 0 1px #999', '0 0 0 4px #999', '0 0 0 1px #999']}}
        transition={{
            duration: 1,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'mirror'
        }}
        className={`fixed z-99999 rounded-xl text-white ${icon === 'error' && 'bg-rose-500'} ${icon === 'success' && 'bg-violet'} ${icon === 'info' && 'bg-sky-400'} h-12 top-3 lg:top-20 right-5 w-max p-3 px-5 pl-3 gap-3 flex items-center`}
    >
        <span 
        className='h-8 w-8 rounded-full bg-white z-999 flex items-center justify-center text-2xl'
        >
            {Icon[icon]}
        </span>
        {message}
    </motion.div>
  )
}

export default Toast