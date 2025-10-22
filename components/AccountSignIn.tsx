"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useClickOutside, useScrollLock } from '@/hooks'
import { HiOutlineX } from 'react-icons/hi'
import { useUser } from '@/contexts/UserContext' // Add this import

interface AccountSignInProps {
  setShowLogin: (show: boolean) => void;
  onSuccess?: () => void;
}

const AccountSignIn = ({ setShowLogin, onSuccess }: AccountSignInProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    contactNumber: '',
    address: ''
  })
  
  // Add this line to get the login function from context
  const { login } = useUser()
  
  useScrollLock(true)

  const clickRef = useClickOutside<HTMLDivElement>(() => setShowLogin(false))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Login successful:', data)
          
          // Update UserContext with the logged-in user
          if (data.user) {
            login(data.user) // This is the key fix!
          }
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess()
          } else {
            // Fallback: just close the modal
            setShowLogin(false)
          }
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Login failed. Please try again.')
        }
      } else {
        // Register logic
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            contactNumber: formData.contactNumber,
            address: formData.address,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Registration successful:', data)
          
          // For registration, also log the user in automatically
          if (data.user) {
            login(data.user) // This is the key fix!
          }
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess()
          } else {
            // Fallback: switch to login form
            setIsLogin(true)
            setFormData(prev => ({
              ...prev,
              password: '',
              confirmPassword: '',
              name: '',
              contactNumber: '',
              address: ''
            }))
            setError('Registration successful! Please sign in.')
          }
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Registration failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      name: '',
      contactNumber: '',
      address: ''
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000 flex items-center justify-center p-4">
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
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
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
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your contact number"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your address"
                />
              </div>
            </>
          )}
          
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
          
          {!isLogin && (
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
                required={!isLogin}
                disabled={loading}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={switchMode}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AccountSignIn