"use client"

import React, { useEffect, useRef, useState } from 'react'
import Input from './Input'
import { motion } from 'framer-motion';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import Toast from './Toast';
import ClientList from './ClientList';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return { ref, isInView };
}

const FillUpForm = () => {
  const { ref: fillUpRef, isInView: fillUpVisible } = useInView();
  const [userInfo, storeUserInfo] = useState({
    fname: '',
    lname: '',
    contact: '',
    email: '',
    message: '',
    compName: '',
    subject: `OnTap Product Inquiry`,
  });
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState('info');
  const [message, setMessage] = useState('Template Info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.fname.trim()) newErrors.fname = 'First name is required';
    if (!userInfo.lname.trim()) newErrors.lname = 'Last name is required';
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!userInfo.contact.trim()) newErrors.contact = 'Phone number is required';
    if (!userInfo.compName.trim()) newErrors.compName = 'Company name is required';
    if (!userInfo.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitEmail = async () => {
    if (!validateForm()) {
      setShow(true);
      setIcon('error');
      setMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const payload = {
        email: userInfo.email.toLowerCase(),
        name: (userInfo.fname + ' ' + userInfo.lname).toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        subject: userInfo.subject,
        message: userInfo.message,
        companyName: userInfo.compName,
        time: new Date().toLocaleString()
    };

    try {
        const res = await fetch(`https://ontap-creatives-website.vercel.app/api/product-inquiry-emails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        const data = await res.json();

        if (data.success) {
            setShow(true);
            setIcon('success');
            setMessage(`Message sent successfully!`);
            storeUserInfo({
            fname: '',
            lname: '',
            contact: '',
            email: '',
            message: '',
            compName: '',
            subject: `OnTap Product Inquiry`,
            });
            setErrors({});
        } else {
          setShow(true);
          setIcon('error');
          setMessage(`Error: ${data.message}`);
        }
        } catch (error) {
            setShow(true);
            setIcon('error');
            setMessage(`An unexpected error occurred.`);
        } finally {
            setIsSubmitting(false);
        }
  };

  const getInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    storeUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const InputData = [
    {
        name: 'fname',
        label: 'First Name',
        placeholder: 'Your First Name',
        type: 'text',
        value: userInfo.fname
    },
    {
        name: 'lname',
        label: 'Last Name',
        placeholder: 'Your Last Name',
        type: 'text',
        value: userInfo.lname
    },
    {
        name: 'email',
        label: 'Work Email',
        placeholder: 'example@mail.com',
        type: 'email',
        value: userInfo.email
    },
    {
        name: 'contact',
        label: 'Phone Number',
        placeholder: '+1 (555) 000-0000',
        type: 'text',
        value: userInfo.contact
    },
    {
        name: 'compName',
        label: 'Company Name',
        placeholder: 'ABC Ltd.',
        type: 'text',
        value: userInfo.compName
    },
  ]

  const benefits = [
    {
      title: "Interactive Design",
      desc: "Impress your contacts with a modern and interactive layout."
    },
    {
      title: "Contactless Sharing",
      desc: "Simply tap and share your details effortlessly."
    },
    {
      title: "Custom Branding",
      desc: "Tailor the card to reflect your unique brand identity."
    }
  ];

  return (
    <div ref={fillUpRef} className='w-full min-h-screen flex justify-center items-center py-10 z-50 bg-white overflow-hidden'>
        {show && (
          <Toast 
            icon={icon}
            message={message}
          />
        )}
        
        <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left Side Content */}
            <motion.div 
              className="w-full lg:w-1/2 flex flex-col gap-8 pt-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: fillUpVisible ? 1 : 0, x: fillUpVisible ? 0 : -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="flex flex-col gap-4">
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue leading-tight'>
                        Connect and Network better with <span className='text-transparent bg-clip-text bg-linear-to-r from-blue to-violet'>OnTap</span>
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 leading-relaxed'>
                        Interactive Digital Business Cards for your team.
                        <br />
                        Leave your info and we'll be in touch shortly.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div 
                            key={index} 
                            className="flex items-start gap-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: fillUpVisible ? 1 : 0, x: fillUpVisible ? 0 : -20 }}
                            transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                        >
                            <div className="mt-1 text-violet bg-violet/10 rounded-full p-1.5">
                                <HiCheckCircle className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg text-dark-blue">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm md:text-base">{benefit.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <span className='font-bold text-dark-blue'>Partners that trusted us</span>
                <ClientList />
            </motion.div>

            {/* Right Side Form */}
            <motion.div 
                className='w-full lg:w-5/12 bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 sticky top-24 self-start'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: fillUpVisible ? 1 : 0, y: fillUpVisible ? 0 : 50 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-dark-blue mb-2">See OnTap in Action</h3>
                    <p className="text-gray-500 text-sm md:text-base">Fill out the form below to schedule a demo.</p>
                </div>

                <form className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="fname"
                            type="text"
                            placeholder="John"
                            label="First Name"
                            value={userInfo.fname}
                            onChange={getInputs}
                            error={errors.fname}
                        />
                        <Input
                            name="lname"
                            type="text"
                            placeholder="Doe"
                            label="Last Name"
                            value={userInfo.lname}
                            onChange={getInputs}
                            error={errors.lname}
                        />
                    </div>

                    <Input
                        name="email"
                        type="email"
                        placeholder="example@mail.com"
                        label="Work Email"
                        value={userInfo.email}
                        onChange={getInputs}
                        error={errors.email}
                    />

                    <Input
                        name="contact"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        label="Phone Number"
                        value={userInfo.contact}
                        onChange={getInputs}
                        error={errors.contact}
                    />

                    <Input
                        name="compName"
                        type="text"
                        placeholder="ABC Ltd."
                        label="Company Name"
                        value={userInfo.compName}
                        onChange={getInputs}
                        error={errors.compName}
                    />

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='message' className="text-sm font-medium text-gray-700">Message <span className='text-rose-500'>*</span></label>
                        <textarea 
                            id='message'
                            name='message' 
                            className={`resize-none h-32 rounded-lg bg-gray-50 p-3 px-4 text-sm focus:bg-white transition-all duration-200 outline-none border ${
                              errors.message ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/20'
                            }`}
                            placeholder="Tell us about your needs..."
                            value={userInfo.message} 
                            onChange={getInputs}
                        ></textarea>
                        {errors.message && <span className='text-xs text-red-500 ml-1'>{errors.message}</span>}
                    </div>

                    <motion.button 
                        type="button" 
                        className='mt-2 w-full py-4 flex items-center justify-center gap-2 font-semibold text-white rounded-lg bg-linear-to-r from-blue to-violet hover:from-dark-blue hover:to-violet shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none' 
                        onClick={submitEmail}
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span>Schedule My Personalised Demo</span>
                                <HiArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                    
                    <p className="text-xs text-center text-gray-500 mt-2">
                        By clicking Schedule, you agree to our <button type="button" className="text-blue hover:underline">Privacy Policy</button>.
                    </p>
                </form>
            </motion.div>   
        </div>
    </div>
  );
};

export default FillUpForm