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
      console.log('Attempting admin login for:', email);
      
      // Use relative path for development, full URL for production
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/admin/login' 
        : 'https://ontap-creatives-website.vercel.app/api/admin/login';
      
      console.log('Using API URL:', apiUrl);
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // IMPORTANT: This sends cookies
      })

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        throw new Error(data?.error || `Login failed with status ${res.status}`)
      }

      const role = data?.staff?.role as StaffRole | undefined
      if (role) {
        saveRoleSession(role)
        console.log('Role saved:', role);
      }

      setSuccess('Access granted. Redirecting...')
      
      // Wait a moment then reload to ensure cookies are set
      setTimeout(() => {
        console.log('Reloading page after successful login');
        window.location.reload();
      }, 1000)
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Unable to login. Please try again.')
    } finally {
      setLoading(false);
      // Don't clear email/password on error so user can see what they entered
      // setEmail('');
      // setPassword('');
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
                  <div className='text-sm text-rose-200 text-center p-2 bg-red-900/30 rounded'>
                    <strong>Error:</strong> {error}
                  </div>
                )}
                {success && (
                  <div className='text-sm text-emerald-200 text-center p-2 bg-green-900/30 rounded'>
                    <strong>Success:</strong> {success}
                  </div>
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
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-4 p-2 bg-black/30 rounded text-xs text-white'>
                <div>NODE_ENV: {process.env.NODE_ENV}</div>
                <div>Email: {email}</div>
                <div>Password length: {password.length}</div>
              </div>
            )}
        </div>
        <button type="button" className='flex items-center gap-2 px-5 pl-3 py-3 rounded-md bg-white z-10 absolute bottom-10 left-10 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200' onClick={() => showAdminLogin(false)}>
          <RiLogoutBoxLine className='text-xl'/> Exit
        </button>
    </div>
  )
}

export default AdminLogin