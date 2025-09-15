"use client"

import React, { useEffect, useRef, useState } from 'react'
import Input from './Input'
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';



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
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const submitEmail = async () => {
    const payload = {
        email: userInfo.email.toLowerCase(),
        name: (userInfo.fname + ' ' + userInfo.lname).toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        subject: userInfo.subject,
        message: userInfo.message,
        companyName: userInfo.compName,
        time: new Date().toLocaleString()
    };

    try {
        const res = await fetch(`https://ontap-backend-system.vercel.app/api/product-inquiry-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
            alert('Message sent successfully!');
            storeUserInfo({
            fname: '',
            lname: '',
            contact: '',
            email: '',
            message: '',
            compName: '',
            subject: `OnTap Product Inquiry`,
            });
        } else {
            alert(`Error: ${data.message}`);
        }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An unexpected error occurred.');
        }
  };

  const getInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    storeUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        label: 'Email Address',
        placeholder: 'Your Email Address',
        type: 'email',
        value: userInfo.email
    },
    {
        name: 'contact',
        label: 'Mobile Number',
        placeholder: 'Enter your Contact Number',
        type: 'text',
        value: userInfo.email
    },
    {
        name: 'compName',
        label: 'Company Name',
        placeholder: 'Your Company Name',
        type: 'text',
        value: userInfo.compName
    },
  ]

  return (
    <div ref={fillUpRef} className='w-full flex flex-col py-20 items-center gap-5'>
        <h2 className='w-full text-center text-3xl font-bold'>To Arrange a Demonstration <span className='text-dark-blue'>or to Place Bulk Orders</span></h2>
        <p className='text-lg font-bold'>Kindly fill up this form</p>
        <motion.form 
            className='w-9/10 md:w-1/3 p-5 bg-neutral-100 rounded-md gap-5 flex flex-col'
            initial={{ y: '100%'}}
            animate={{ y: fillUpVisible ? '0%' : '100%'}}
            transition={{
                duration: 1,
                ease: 'easeOut',
                delay: 0.3
            }}
        >
            {InputData.map((val, i) => (
                <Input
                    key={i}
                    name={val.name}
                    type={val.type}
                    placeholder={val.placeholder}
                    label={val.label}
                    value={val.value}
                    onChange={getInputs}
                >
                </Input>
            ))}
            <span className='flex flex-col'>
                <label htmlFor='messageBox'>Message <span className='text-rose-500'>*</span></label>
                <textarea name='messageBox' className='resize-none min-h-52 rounded-sm bg-neutral-200 p-3 px-5' value={userInfo.message} onChange={getInputs}></textarea>
            </span>
            <span className='w-full flex justify-end'>
                <button type="button" className='px-5 py-3 pr-4 flex items-center gap-3 rounded-md bg-light-blue hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => submitEmail}>Submit <HiArrowRight /></button>
            </span>
        </motion.form>   
    </div>
  );
};

export default FillUpForm