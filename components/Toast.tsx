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
        animate={{x: [1, 0, -1], y: [1,0,-1]}}
        transition={{
            duration: 0.01,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'mirror'
        }}
        className={`fixed z-999999 rounded-xl ${icon === 'error' && 'bg-rose-500'} ${icon === 'success' && 'bg-violet'} ${icon === 'info' && 'bg-sky-400'} h-20 top-10 w-3/4 md:w-1/4 md:max-w-1/4 p-5 gap-3 flex items-center`}
    >
        <motion.span 
        animate={{scale: [0.9, 1, 0.9]}}
        transition={{
            duration: 0.7,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'loop'
        }}
        className='h-10 w-10 rounded-full bg-white z-999 flex items-center justify-center text-dark-blue text-2xl'
        >
            {Icon[icon]}
        </motion.span>
        {message}
    </motion.div>
  )
}

export default Toast