import React from 'react'
import Image from 'next/image'
import { AdminPageProps, HeaderProps } from '@/types'
import { RiLogoutBoxLine } from 'react-icons/ri'

type AdminProps = AdminPageProps & HeaderProps

const AdminLogin = ({ showAdminLogin, setPage }: AdminProps) => {
  
  return (
    <div className='w-full h-[100vh] flex items-center justify-center relative'>
        <Image
            height={500}
            width={500}
            alt='background image'
            src='/images/ontap-hero-bg.png'
            className='h-full w-full absolute object-center object-cover'
        />
        <div className='lg:h-1/2 lg:w-1/5 rounded-lg bg-white/20 backdrop-blur-lg flex flex-col items-center py-5'>
            <Image
                height={500}
                width={500}
                alt='background image'
                src='/images/ontap-logo.png'
                className='h-16 w-16 object-center object-contain'
            />
            <div className='w-full flex flex-col gap-3 px-5 my-auto'>
                <input type="text" className='outline-none py-3 px-5 rounded-sm border border-white/50 hover:border-white focus:border-blue placeholder:text-white/70 text-white' placeholder='Admin ID'/>
                <input type="password" className='outline-none py-3 px-5 rounded-sm border border-white/50 hover:border-white focus:border-blue placeholder:text-white/70 text-white tracking-widest placeholder:tracking-normal' placeholder='Password'/>
                <button type="button" className='ml-auto text-white hover:underline focus:text-blue ease-out duration-200'>forgot password?</button>
            </div>
            <button type="button" className='mb-auto py-4 px-10 bg-light-blue rounded-md hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setPage(1)}>LOGIN</button>
        </div>
        <button type="button" className='flex items-center gap-2 px-5 pl-3 py-3 rounded-md bg-white z-10 absolute bottom-10 left-10 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200' onClick={() => showAdminLogin(false)}><RiLogoutBoxLine className='text-xl'/> Exit</button>
    </div>
  )
}

export default AdminLogin