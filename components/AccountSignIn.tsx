"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useClickOutside, useScrollLock } from '@/hooks'
import { HiOutlineX } from 'react-icons/hi'
import { useUser } from '@/contexts/UserContext'
import Image from 'next/image'
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';
import { RiBatteryFill, RiFacebookCircleFill, RiGlobalLine, RiInstagramLine, RiMailLine, RiMapPin5Fill, RiPhoneFill, RiTiktokFill, RiWifiFill } from 'react-icons/ri'
import { FcGoogle } from 'react-icons/fc'

interface AccountSignInProps {
  setShowLogin: (show: boolean) => void;
  onSuccess?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password' | 'verify-email';

const tags = [
  {
    name: 'Seamless Connectivity',
    position: 'top-5 left-5'
  },
  {
    name: 'Limitless Possibilities',
    position: 'top-25 right-5'
  },
  {
    name: 'Contactless Feature',
    position: 'top-2/5 left-16'
  },
  {
    name: 'Smart Solutions',
    position: 'top-3/5 left-5'
  },
  {
    name: 'Digital Integration',
    position: 'top-3/5 right-5'
  },
  {
    name: 'Instant Access',
    position: 'top-4/5 right-25'
  },
  {
    name: 'Business Visibility',
    position: 'bottom-5 left-15'
  },
  
]

const AccountSignIn = ({ setShowLogin, onSuccess }: AccountSignInProps) => {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    contactNumber: '',
    address: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const { toast, showToast } = useToast();
  
  const { login } = useUser()
  useScrollLock(true)
  const clickRef = useClickOutside<HTMLDivElement>(() => setShowLogin(false))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      switch (currentView) {
        case 'login':
          await handleLogin();
          break;
        case 'signup':
          await handleSignup();
          break;
        case 'forgot-password':
          await handleForgotPassword();
          break;
        case 'verify-otp':
          await handleVerifyOtp();
          break;
        case 'reset-password':
          await handleResetPassword();
          break;
        case 'verify-email':
          await handleVerifyEmail();
          break;
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Redirect to a backend route that initiates Google OAuth flow.
    // Implement `/api/auth/google` on the server (or use NextAuth) to handle redirects.
    try {
      window.location.href = 'https://ontap-creatives-website.vercel.app/api/auth/google'
    } catch (err) {
      showToast('error', 'Unable to start Google sign-in. Please try again.')
    }
  }

  const handleLogin = async () => {
    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.user) {
        login(data.user)
      }
      if (onSuccess) {
        onSuccess()
      } else {
        setShowLogin(false)
      }
    } else {
      const errorData = await response.json()
      showToast('error', 'Login failed. Please try again.');
    }
  }

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return
    }

    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        address: formData.address,
      }),
    })

    if (response.ok) {
      // Send verification email and go to verification view
      const verificationResponse = await fetch('https://ontap-creatives-website.vercel.app/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      })

      if (verificationResponse.ok) {
        setCurrentView('verify-email')
        showToast('success', 'Account created! Please verify your email with the OTP sent to your inbox.');
      } else {
        showToast('error', 'Account created but failed to send verification email. Please contact support.');
      }
    } else {
      const errorData = await response.json()
      showToast('error', 'Registration failed. Please try again.');
    }
  }

  const handleVerifyEmail = async () => {
    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        otp: formData.otp,
      }),
    })

    if (response.ok) {
      showToast('success', 'Email verified successfully! Please sign in to continue.');
      setTimeout(() => {
        setCurrentView('login')
        setFormData(prev => ({ 
          ...prev, 
          password: '', 
          confirmPassword: '', 
          name: '', 
          contactNumber: '', 
          address: '',
          otp: '' 
        }))
      }, 2000)
    } else {
      const errorData = await response.json()
      showToast('error', 'Invalid OTP. Please try again.');
    }
  }

  const handleForgotPassword = async () => {
    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email }),
    })

    if (response.ok) {
      setCurrentView('verify-otp')
      showToast('info', 'OTP sent to your email. Please check your inbox.');
    } else {
      const errorData = await response.json()
      showToast('error', 'Failed to send OTP. Please try again.');
    }
  }

  const handleVerifyOtp = async () => {
    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        otp: formData.otp,
      }),
    })

    if (response.ok) {
      setCurrentView('reset-password')
      showToast('info', 'OTP verified! Please set your new password.');
    } else {
      const errorData = await response.json()
      showToast('error', 'Invalid OTP. Please try again.');
    }
  }

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      showToast('error', 'Passwords do not match.');
      return
    }

    const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }),
    })

    if (response.ok) {
      showToast('success', 'Password reset successfully! Please log in with your new password.');
      setTimeout(() => {
        setCurrentView('login')
        setFormData(prev => ({ ...prev, password: '', otp: '', newPassword: '', confirmNewPassword: '' }))
      }, 2000)
    } else {
      const errorData = await response.json()
      showToast('error', 'Failed to reset password. Please try again.');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const switchToLogin = () => {
    setCurrentView('login')
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      name: '',
      contactNumber: '',
      address: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: ''
    }))
  }

  const switchToSignup = () => {
    setCurrentView('signup')
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: ''
    }))
  }

  const switchToForgotPassword = () => {
    setCurrentView('forgot-password')
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: ''
    }))
  }

  const resendVerificationEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/auth/email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      })

      if (response.ok) {
        showToast('success', 'Verification email sent again! Please check your inbox.');
      } else {
        showToast('error', 'Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      showToast('error', 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (currentView) {
      case 'login': return 'Sign In'
      case 'signup': return 'Create Account'
      case 'forgot-password': return 'Forgot Password'
      case 'verify-otp': return 'Verify OTP'
      case 'reset-password': return 'Reset Password'
      case 'verify-email': return 'Verify Your Email'
      default: return 'Sign In'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000 flex items-center justify-center p-4">
      {toast.show && (
        <Toast 
          icon={toast.icon}
          message={toast.message}
        />
      )}
      <motion.div
        ref={clickRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl overflow-hidden w-1/2 relative h-3/5 flex items-center"
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-2xl hover:text-rose-500 ease-out duration-200 z-30 text-white"
          onClick={() => setShowLogin(false)}
          disabled={loading}
        >
          <HiOutlineX />
        </button>
        <div className='w-full h-full flex items-center'>
          <div className='w-2/5 p-6 overflow-y-auto h-full'>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {getTitle()}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field - shown in all views except login */}
              {(currentView === 'signup' || currentView === 'forgot-password' || currentView === 'verify-otp' || currentView === 'reset-password' || currentView === 'verify-email') && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading || currentView === 'verify-otp' || currentView === 'reset-password' || currentView === 'verify-email'}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
              )}

              {/* Signup Fields */}
              {currentView === 'signup' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your contact number (optional)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your address (optional)"
                    />
                  </div>
                </>
              )}

              {/* Login Fields */}
              {currentView === 'login' && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      minLength={6}
                    />
                  </div>
                </>
              )}

              {/* OTP Field for Email Verification */}
              {currentView === 'verify-email' && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    Verification OTP *
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter OTP sent to your email"
                    maxLength={6}
                  />
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={resendVerificationEmail}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                    >
                      Resend verification email
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Field for Password Reset */}
              {currentView === 'verify-otp' && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    OTP *
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter OTP sent to your email"
                    maxLength={6}
                  />
                </div>
              )}

              {/* New Password Fields */}
              {currentView === 'reset-password' && (
                <>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>
                </>
              )}

              {/* Password Fields for Signup */}
              {currentView === 'signup' && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {currentView === 'login' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                    {currentView === 'signup' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                    {currentView === 'forgot-password' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                    {currentView === 'verify-otp' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                    {currentView === 'reset-password' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                    {currentView === 'verify-email' && 
                      <Image
                        height={2048}
                        width={2048}
                        alt='animated logo'
                        src='/icons/animated-logo.gif'
                        className='h-6 object-contain object-center'
                      />
                    }
                  </div>
                ) : (
                  currentView === 'login' && 'Sign In' ||
                  currentView === 'signup' && 'Create Account' ||
                  currentView === 'forgot-password' && 'Send OTP' ||
                  currentView === 'verify-otp' && 'Verify OTP' ||
                  currentView === 'reset-password' && 'Reset Password' ||
                  currentView === 'verify-email' && 'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FcGoogle className="text-lg" />
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
            </div>

            <div className="mt-4 text-center space-y-2">
              {/* Login/Signup Toggle */}
              {(currentView === 'login' || currentView === 'signup') && (
                <button
                  type="button"
                  onClick={currentView === 'login' ? switchToSignup : switchToLogin}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed block w-full"
                >
                  {currentView === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              )}

              {/* Forgot Password Link */}
              {currentView === 'login' && (
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Forgot your password?
                </button>
              )}

              {/* Back to Login Links */}
              {(currentView === 'forgot-password' || currentView === 'verify-otp' || currentView === 'reset-password' || currentView === 'verify-email') && (
                <button
                  type="button"
                  onClick={switchToLogin}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
          <div className='h-full w-3/5 flex items-center justify-center relative'>
              <Image
                height={4096}
                width={4096}
                alt='bg image'
                src='/images/app-bg.png'
                className='absolute h-full w-full object-cover object-center brightness-75'
                draggable={false}
              />
              <div className='w-[45%] h-[90%] rounded-3xl border-6 border-black z-10 flex flex-col overflow-hidden'>
                <span className='w-full min-h-7 border-b bg-[#111111] border-white/20 flex justify-between px-3 text-white relative'>
                  <strong className='mt-2 text-[8px]'>12:00</strong>
                  <span className='w-7 h-7 rounded-b-full left-1/2 -translate-x-1/2 absolute before:h-4 before:w-4 before:rounded-full before:absolute before:bg-white/30 before:top-1/2 before:left-1/2 before:-translate-1/2 
                  after:h-2.5 after:w-2.5 after:absolute after:rounded-full after:bg-black after:top-1/2 after:left-1/2 after:-translate-1/2'></span>
                  <span className='flex items-center gap-2 text-sm'>
                    <RiWifiFill className='text-xs'/>
                    <span className='flex items-center gap-1 text-[8px]'>
                      <RiBatteryFill className='text-sm'/>
                        86%
                    </span>
                  </span>
                </span>
                <span className='w-full h-28 flex items-center'>
                  <Image
                    height={4096}
                    width={4096}
                    alt='bg image'
                    src='/images/about-img-1.png'
                    className='h-full w-full object-cover object-center brightness-75'
                    draggable={false}
                  />
                </span>
                <div className='w-full flex items-center gap-3 px-3 py-1.5 bg-ink-black'>
                  <span className='h-12 w-12 aspect-square rounded-full flex items-center justify-center bg-white p-1.5'>
                    <Image
                      height={4096}
                      width={4096}
                      alt='bg image'
                      src='/images/logo.png'
                      className='h-full w-full object-contain object-center'
                      draggable={false}
                    />
                  </span>
                  <span className='h-full flex flex-col leading-3 text-white text-[8px]'>
                    <strong className='text-[11px]'>ONTAP CREATIVES</strong>
                    BUSINESS
                    <p className='pl-1 mt-1 border-l-2 border-white/50'>Turn every interaction into an opportunity for growth.</p>
                  </span>
                </div>
                <div className='w-full h-full flex flex-col gap-2 items-center relative'>
                  <Image
                      height={4096}
                      width={4096}
                      alt='bg image'
                      src='/images/app-bg.png'
                      className='absolute h-full w-full object-cover object-center'
                      draggable={false}
                    />
                  <div className='w-full flex items-center justify-center gap-3 text-white text-base z-10 py-3 pb-2'>
                    <motion.span 
                      initial={{color: '#5199D3', scale: 1}}
                      animate={{color: '#FFFFFF', scale: 1.25}}
                      exit={{color: '#5199D3', scale: 1}}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: 0.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 5
                      }}
                    ><RiGlobalLine /></motion.span>
                    <motion.span 
                      initial={{color: '#5199D3', scale: 1}}
                      animate={{color: '#FFFFFF', scale: 1.25}}
                      exit={{color: '#5199D3', scale: 1}}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 3
                      }}
                    ><RiFacebookCircleFill /></motion.span>
                    <motion.span 
                      initial={{color: '#5199D3', scale: 1}}
                      animate={{color: '#FFFFFF', scale: 1.25}}
                      exit={{color: '#5199D3', scale: 1}}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: 1.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 3
                      }}
                    ><RiInstagramLine /></motion.span>
                    <motion.span 
                      initial={{color: '#5199D3', scale: 1}}
                      animate={{color: '#FFFFFF', scale: 1.25}}
                      exit={{color: '#5199D3', scale: 1}}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 3
                      }}
                    ><RiTiktokFill /></motion.span>
                  </div>
                  <motion.div 
                    initial={{scale: 0.9}}
                    animate={{scale: 1}}
                    exit={{scale: 0.9}}
                    transition={{
                      duration: 0.7,
                      ease:'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 3
                    }}
                    className='w-2/3 rounded-lg bg-ink-black px-3 py-2 gap-1 flex flex-col items-center z-10'
                  >
                    <span className='h-7 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-sm text-blue'>
                      <RiMailLine />
                    </span>
                    <p className='text-white text-[10px]'>ontapcreatives@gmail.com</p>
                  </motion.div>
                  <motion.div
                    initial={{scale: 0.9}}
                    animate={{scale: 1}}
                    exit={{scale: 0.9}}
                    transition={{
                      duration: 0.7,
                      ease:'easeInOut',
                      delay: 0.7,
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 5
                    }}
                    className='w-2/3 rounded-lg bg-ink-black px-3 py-2 gap-1 flex flex-col items-center z-10'
                  >
                    <span className='h-7 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-sm text-blue'>
                      <RiPhoneFill />
                    </span>
                    <p className='text-white text-[10px]'>+ 63 917708364</p>
                  </motion.div>
                  <motion.div 
                    initial={{scale: 0.9}}
                    animate={{scale: 1}}
                    exit={{scale: 0.9}}
                    transition={{
                      duration: 0.7,
                      ease:'easeInOut',
                      delay: 1.4,
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 5
                    }}
                    className='w-2/3 rounded-lg bg-ink-black px-3 py-2 gap-1 flex flex-col items-center z-10'
                  >
                    <span className='h-7 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-sm text-blue'>
                      <RiMapPin5Fill />
                    </span>
                    <p className='text-white text-center text-[10px]'>Vatican City Dr, Las Piñas, 1740, Metro Manila</p>
                  </motion.div>
                </div>
              </div>
              { tags.map((t, i) => (
                <motion.div
                  animate={{
                    y: [150, 0],
                    opacity: [0, 1, 1, 1, 0],
                    filter: ['blur(3px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(3px)'],
                    scale: [0.7, 1, 1, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i / 7,
                    repeatDelay: i % 7
                  }}
                  key={`tag_${i}`} 
                  className={`py-3 px-5 border border-white/20 absolute rounded-lg ${t.position} z-10 text-xs text-white bg-white/10 backdrop-blur-xs`}
                >
                {t.name}
              </motion.div>
              ))}
              
          </div>
        </div>
        
      </motion.div>
    </div>
  )
}

export default AccountSignIn