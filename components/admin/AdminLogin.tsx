"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { AdminPageProps, HeaderProps } from '@/types'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { saveRoleSession } from '@/utils/adminAccessSession'
import { StaffRole } from '@/constants/staffRoles'

type AdminProps = AdminPageProps & HeaderProps

const AdminLogin = ({ showAdminLogin, setPage }: AdminProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return
    setError(null)
    setSuccess(null)

    try {
      setLoading(true)
      const res = await fetch('https://ontap-creatives-website.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to login. Please try again.')
      }

      const role = data?.staff?.role as StaffRole | undefined
      if (role) {
        saveRoleSession(role)
      }

      setSuccess('Access granted. Redirecting...')
      setPage(1)
    } catch (err: any) {
      setError(err.message || 'Unable to login. Please try again.')
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  }
  
  return (
    <div className='w-full h-[100vh] flex items-center justify-center relative '>
        <Image
            height={500}
            width={500}
            alt='background image'
            src='/images/ontap-hero-bg.png'
            className='h-full w-full absolute object-center object-cover'
        />
        <div className='h-auto w-2/3 md:w-1/2 lg:h-1/2 lg:w-1/3 rounded-lg bg-white/20 backdrop-blur-lg flex flex-col items-center py-5'>
            <Image
                height={500}
                width={500}
                alt='background image'
                src='/images/ontap-logo.png'
                className='h-16 w-16 object-center object-contain'
            />
            <form className='w-full flex flex-col gap-3 px-5 my-auto' onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className='outline-none py-3 px-5 rounded-sm border border-white/50 hover:border-white focus:border-blue placeholder:text-white/70 text-white bg-transparent' 
                  placeholder='Work Email'
                  required
                  autoComplete='username'
                />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  className='outline-none py-3 px-5 rounded-sm border border-white/50 hover:border-white focus:border-blue placeholder:text-white/70 text-white tracking-widest placeholder:tracking-normal bg-transparent' 
                  placeholder='Password'
                  required
                  autoComplete='current-password'
                />
                {error && (
                  <span className='text-sm text-rose-200 text-center'>{error}</span>
                )}
                {success && (
                  <span className='text-sm text-emerald-200 text-center'>{success}</span>
                )}
                <button type="button" className='ml-auto text-white hover:underline focus:text-blue ease-out duration-200'>forgot password?</button>
                <button 
                  type="submit" 
                  className='mt-4 py-4 px-10 bg-light-blue rounded-md hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200 disabled:opacity-60 disabled:cursor-not-allowed' 
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'LOGIN'}
                </button>
            </form>
        </div>
        <button type="button" className='flex items-center gap-2 px-5 pl-3 py-3 rounded-md bg-white z-10 absolute bottom-10 left-10 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200' onClick={() => showAdminLogin(false)}><RiLogoutBoxLine className='text-xl'/> Exit</button>
    </div>
  )
}

export default AdminLogin