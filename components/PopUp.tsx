"use client"

import React, { useEffect, useState } from 'react'
import { HiArrowRight, HiLocationMarker, HiOutlineX, HiPhone } from 'react-icons/hi'
import Toast from './Toast';
import { Country } from '@/types';
import { countries } from '@/data/countries';
import { TbCaretDownFilled } from 'react-icons/tb';

interface PopupProps {
    setShowPopup: (showPopup: boolean) => void;
}

const PopUp = ({ setShowPopup }: PopupProps) => {
  const [userInfo, storeUserInfo] = useState({
    name: '',
    contact: '',
    email: '',
    message: '',
    subject: `OnTap Product Inquiry`,
  });

  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState('info');
  const [message, setMessage] = useState('Template Info');
  const [countryCodeOptions, showCountryCodeOptions] = useState(false);
  const [countryCode, selectedCountryCode] = useState<Country>(countries[136]);
  const [countrySearch, setCountrySearch] = useState("");

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
  
      // Cleanup when show changes or component unmounts
      return () => clearTimeout(timer);
    }
  }, [show]);
  
    
  const getInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Default update for other fields
    if (name === "contact") {
      let digits = value.replace(/\D/g, "");

      const countryDigits = countryCode.code.replace(/\D/g, "");
      if (digits.startsWith(countryDigits)) {
        digits = digits.slice(countryDigits.length);
      }

      if (countryCode.maxDigits) {
        if (digits.length > countryCode.maxDigits) {
          digits = digits.slice(0, countryCode.maxDigits);
        }
      }

      let formatted = digits;
      if (countryCode?.format) {
        try {
          formatted = countryCode.format(digits);
        } catch {
          formatted = digits;
        }
      }

      formatted = `${countryCode.code} ${formatted}`.trim();

      storeUserInfo((prev) => ({ ...prev, contact: formatted }));

      e.target.value = formatted;

      return;
    }

    storeUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEmail = async () => {
    if (!userInfo.name || !userInfo.contact || !userInfo.email) {
        setShow(true);
        setIcon('info');
        setMessage(`Please fill out all required fields.`);
    } else {
        const payload = {
            email: userInfo.email.toLowerCase(),
            name: userInfo.name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            subject: userInfo.subject,
            message: `<span style="font-size: 16px;">${userInfo.message}</span>
                      <span>Best Regards</span>
                      <span><strong>${userInfo.name}</strong></span>
                      <a href='tel:+${userInfo.contact}'>${userInfo.contact}</a>`,
            time: new Date().toLocaleString()
        };

        try {
            const res = await fetch(`https://ontap-creatives-website.vercel.app/api/product-inquiry-emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setShow(true);
                setIcon('success');
                setMessage(`Message sent successfully!`);
                storeUserInfo({
                name: '',
                contact: '',
                email: '',
                message: '',
                subject: `OnTap Product Inquiry`,
                });
            } else {
            setShow(true);
            setIcon('error');
            setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setShow(true);
            setIcon('error');
            setMessage(`Error sending email. Please try again.`);
        }
    }
  }

  const searchCountry = countries.filter((c) => 
    c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );
  
  return (
    <div className='fixed h-full w-full z-99999 bg-white/20 backdrop-blur-md flex items-center justify-center left-0'>
        {show && (
          <Toast 
            icon={icon}
            message={message}
          />
        )}
        <button 
            type="button" 
            className='h-12 w-12 absolute top-1/10 md:top-1/7 right-5 md:right-1/3 rounded-full bg-white text-3xl flex items-center justify-center border border-rose-200 hover:border-light-blue hover:bg-blue focus:border-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
            onClick={() => setShowPopup(false)}    
        ><HiOutlineX /></button>
        <div className='bg-white md:h-2/3 w-9/10 md:w-1/3 rounded-xl shadow-md p-5 gap-3 flex flex-col items-center md:justify-between'>
            <h2 className='text-lg'>You have reached the end of this page. To inquire, please leave us a message.</h2>
            <div className='grid grid-cols-2 gap-3 w-full'>
                <span className='col-span-full md:col-span-1 p-3 px-5 rounded-md border border-light-blue hover:border-blue ease-out duration-200'>
                    <input 
                    type="text" 
                    placeholder='Your name' 
                    name='name' 
                    value={userInfo.name}
                    onChange={getInputs}
                    className='h-full w-full outline-none'
                    />
                </span>
                <span className='col-span-full md:col-span-1 px-5 pl-0 rounded-md border border-neutral-200 flex gap-3'>
                    <div className='relative flex gap-2 items-center'>
                        <button 
                            type="button"
                            className='h-full w-full bg-light-blue/50 py-3 px-3 pr-2 flex items-center gap-1 rounded-l-sm group hover:bg-light-blue/70 focus:bg-light-blue ease-out duration-200'
                            onClick={ () => {showCountryCodeOptions(!countryCodeOptions); storeUserInfo((prev) => ({...prev, contact: ''}))} }
                        >
                            <span>{countryCode?.icon}</span>
                            <span className='font-extrabold ml-2'>{countryCode?.code}</span>
                            <TbCaretDownFilled className='text-neutral-400 group-hover:text-neutral-600 group-focus:text-black'/>
                        </button>
                        { countryCodeOptions && (
                            <div className='absolute h-auto max-h-50 w-auto z-50 rounded-md bg-white top-full mt-1 overflow-x-hidden border border-black/20 shadow-md'>
                                <input 
                                    type="text" 
                                    className='sticky top-0 p-2 bg-white border-b border-neutral-200 hover:border-b-2 hover:border-blue/50 focus:border-b-2 focus:border-blue outline-none ease-out duration-200'
                                    value={countrySearch}
                                    placeholder={countryCode?.icon + '  ' + countryCode?.country}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                />
                                {searchCountry.map((value, i) => (
                                    <button 
                                        key={i} 
                                        type="button" 
                                        className='text-black p-2 w-full max-w-47 overflow-hidden flex items-center gap-3 justify-between hover:bg-light-blue/50 focus:bg-light-blue ease-out duration-200'
                                        onClick={() => {
                                            selectedCountryCode(value);
                                            showCountryCodeOptions(false);
                                            setCountrySearch("");
                                        }}
                                    >
                                        <span>{value.icon}</span>
                                        <span className='text-nowrap overflow-ellipsis overflow-hidden mr-auto'>{value.country}</span> 
                                        <strong className='text-nowrap text-sm'>{value.code}</strong>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input 
                        name='contact'
                        type="text" 
                        placeholder={countryCode?.placeholder}
                        value={userInfo.contact}
                        onChange={(e) => getInputs(e)}
                        className='h-full w-full outline-none'
                    />
                </span>
                <span className='col-span-full p-3 px-5 rounded-md border border-light-blue hover:border-blue ease-out duration-200'>
                    <input 
                        type="email" 
                        placeholder='Your email address' 
                        name='email' 
                        value={userInfo.email}
                        onChange={getInputs}
                        className='h-full w-full outline-none'
                    />
                </span>
                <span className='col-span-full p-3 px-5 rounded-md border h-38 md:h-48 border-light-blue hover:border-blue ease-out duration-200'>
                    <textarea 
                        defaultValue='Your message here...' 
                        name='message' 
                        className='h-full w-full outline-none resize-none'
                        value={userInfo.message}
                        onChange={getInputs}
                    ></textarea>
                </span>
                <span className='flex justify-end col-span-full'>
                    <button 
                        type="button" 
                        className='flex gap-2 items-center px-5 py-2 pr-3 rounded-md bg-light-blue hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                        onClick={submitEmail}
                    >
                        Submit
                        <HiArrowRight />
                    </button>
                </span>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-3 w-full gap-2 font-bold text-sm md:text-base'>
                <span className='col-span-full w-full text-center font-normal text-lg mb-2'>- or contact us via -</span>
                <a
                    href='tel:+0270072412'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                >
                    <HiPhone className='text-xl md:text-2xl text-dark-blue'/>
                    (02) 7007-2412
                </a>
                <a
                    href='tel:+639286935815'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                >
                    <HiPhone className='text-xl md:text-2xl text-dark-blue'/>
                    +63 928 693 5815
                </a>
                <a
                    href='tel:+639772473179'                            
                    className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>+63 977 247 3179</a>
                <a 
                    href="https://www.google.com/maps/place/17+Vatican+City+Dr,+Las+Pi%C3%B1as" 
                    target="_blank"
                    className='col-span-full flex -ml-0.5 gap-2 md:items-center hover:underline focus:underline ease-out duration-200'
                >
                    <HiLocationMarker className='text-3xl text-rose-700'/>
                    17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City
                </a>
            </div>
        </div>
    </div>
  )
}

export default PopUp