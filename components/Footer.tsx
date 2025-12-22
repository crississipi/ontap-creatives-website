import React, { useState } from 'react'
import Image from 'next/image'
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si'
import { IoIosArrowForward } from 'react-icons/io'

interface FooterProps {
    setPage: (page: number) => void;
};

const Footer = ({ setPage }: FooterProps) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }
  return (
    <footer className='z-50 w-full bg-linear-to-b from-footer-bg to-[#1a1d21] text-gray-300'>
        <div className='w-full px-6 md:px-12 lg:px-20 py-12 md:py-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8'>
                
                {/* Logo and Social Section */}
                <div className='lg:col-span-3 flex flex-col gap-6 items-center md:items-start'>
                    <Image
                        priority
                        height={1024}
                        width={1024}
                        alt='ontap creatives logo'
                        src='/images/ontap-logo.png'
                        className='max-h-16 md:max-h-20 aspect-square object-contain drop-shadow-lg'
                        draggable={false}
                    />
                    <div className='flex gap-4 text-gray-400 w-full justify-center'>
                        <button 
                            type="button"
                            className='text-xl hover:text-blue transition-colors duration-200'
                        ><SiFacebook /></button>
                        <button 
                            type="button"
                            className='text-xl hover:text-blue transition-colors duration-200'
                        ><SiInstagram /></button>
                        <button 
                            type="button"
                            className='text-xl hover:text-blue transition-colors duration-200'
                        ><SiTiktok /></button>
                        <button 
                            type="button"
                            className='text-xl hover:text-blue transition-colors duration-200'
                        ><SiYoutube /></button>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className='lg:col-span-3 flex flex-col gap-4 items-center md:items-start'>
                    <h3 className='text-xl md:text-2xl font-bold text-white'>Newsletter</h3>
                    <p className='text-sm text-gray-400 text-center md:text-left'>Subscribe to the newsletter and receive information about promotions and new arrivals</p>
                    <form onSubmit={handleNewsletterSubmit} className='w-full max-w-sm flex flex-col gap-3'>
                        <div className='relative w-full'>
                            <input 
                                type="email" 
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className='w-full px-4 py-3 pr-12 bg-transparent border-b-2 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-blue focus:outline-none transition-colors duration-200 disabled:opacity-50'
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className='absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black rounded-full text-white hover:bg-blue transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <IoIosArrowForward size={20} />
                                )}
                            </button>
                        </div>
                        {message && (
                            <p className={`text-xs text-center md:text-left ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.text}
                            </p>
                        )}
                    </form>
                </div>

                {/* Customer Service Column */}
                <div className='lg:col-span-2 flex flex-col gap-3 items-center md:items-start text-center md:text-left'>
                    <h4 className='text-base font-semibold text-white mb-2'>Customer service</h4>
                    <button 
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(2)}
                    >FAQs</button>
                    <button 
                        type='button'
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(6)}
                    >Orders</button>
                    <button 
                        type='button'
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(4)}
                    >Cart</button>
                </div>

                {/* Product Guide Column */}
                <div className='lg:col-span-2 flex flex-col gap-3 items-center md:items-start text-center md:text-left'>
                    <h4 className='text-base font-semibold text-white mb-2'>Product guide</h4>
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                    >Device Compatibility</a>
                    <button 
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(5)}
                    >About Us</button>
                </div>

                {/* Legal Area Column */}
                <div className='lg:col-span-2 flex flex-col gap-3 items-center md:items-start text-center md:text-left'>
                    <h4 className='text-base font-semibold text-white mb-2'>Legal area</h4>
                    <button
                        type='button'
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(7)}
                    >Privacy Policy</button>
                    <button
                        type='button'
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                        onClick={() => setPage(8)}
                    >Terms and Conditions</button>
                    <button 
                        type='button'
                        className='text-sm text-gray-400 hover:text-blue transition-colors duration-200'
                    >Affiliate Program</button>
                </div>

            </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className='w-full border-t border-gray-700/50 px-6 md:px-12 lg:px-20 py-6'>
            <p className='text-center text-xs md:text-sm text-gray-500'>
                Unit 109, 17 Vatican Building, BF Resort Village, Las Piñas City, Philippines
            </p>
        </div>
    </footer>
  )
}

export default Footer