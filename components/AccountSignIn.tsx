"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useClickOutside, useScrollLock } from '@/hooks'
import { HiOutlineX } from 'react-icons/hi'
import { useUser } from '@/contexts/UserContext'
import Image from 'next/image'
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

interface AccountSignInProps {
  setShowLogin: (show: boolean) => void;
  onSuccess?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password' | 'verify-email';

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

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
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

    const response = await fetch('/api/auth/signup', {
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
      const verificationResponse = await fetch('/api/auth/send-verification', {
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
    const response = await fetch('/api/auth/verify-email', {
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
    const response = await fetch('/api/auth/forgot-password', {
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
    const response = await fetch('/api/auth/verify-otp', {
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

    const response = await fetch('/api/auth/reset-password', {
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
      const response = await fetch('/api/auth/email-verification', {
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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-2xl hover:text-rose-500 ease-out duration-200"
          onClick={() => setShowLogin(false)}
          disabled={loading}
        >
          <HiOutlineX />
        </button>

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
      </motion.div>
    </div>
  )
}

export default AccountSignIn