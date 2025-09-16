"use client"

import React, { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import { Country, ProductCardProps, ProductProps } from '@/types';
import { HiOutlineArrowLongRight, HiOutlineArrowSmallLeft, HiOutlineXMark, HiPhone } from 'react-icons/hi2';
import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import { TbCaretDownFilled } from 'react-icons/tb';
import Toast from './Toast';
import { countries } from '@/data/countries';

type ProdCard = ProductCardProps & ProductProps;

const InquireItem = ({ imgUrl, productName, productDesc, size, setInquireItem, inquire, hoverable }: ProdCard) => {
  const [step, nextStep] = useState(0);
  const [otp, setOtp] = useState<string>("".padEnd(6, " "));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countryCodeOptions, showCountryCodeOptions] = useState(false);
  const [countryCode, selectedCountryCode] = useState<Country>(countries[136]);
  const [countrySearch, setCountrySearch] = useState("");
  const [userInfo, storeUserInfo] = useState({
    name: '',
    contact: '',
    email: '',
    subject: `Product Inquiry: ${productName}`,
  });
  const [emailContent, setEmailContent] = useState(<>
        Hello <strong>OnTap Sales/Marketing Team</strong>,
        <br /><br />
        I hope this message finds you well. I am reaching out to inquire about the availability and details of your <strong>{productName} OnTap Card</strong> product. Could you kindly provide me with information regarding:
        <br /><br />
        <ul className="list-disc list-inside space-y-2 pl-3">
            <li>Pricing for different quantities</li>
            <li>Available sizes and material options</li>
            <li>Estimated production and delivery time</li>
        </ul>
        <br />
        If there are any design guidelines or minimum order requirements, I would also appreciate it if you could share those details.
        <br /><br />
        Thank you in advance for your assistance. I look forward to your reply.
        <br /><br />
        Best regards,
        <br />
        <strong className='capitalize'>{userInfo.name}</strong>
        <br />
        <a href={`tel:+${countryCode?.code}${userInfo.contact}`}>
            <strong>{userInfo.contact}</strong>
        </a>
        <br />
        <strong className='lowercase'>{userInfo.email}</strong>
    </>);
  const emailRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState('info');
  const [message, setMessage] = useState('Template Info');
  
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

    // Default update for other fields
    storeUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEmail = async () => {
    if (step === 0) {
        if (!userInfo.name || !userInfo.contact || !userInfo.email) {
            setShow(true);
            setIcon('info');
            setMessage(`Please fill out all required fields.`);
        } else {
            try {
                const res = await fetch(`https://ontap-creatives-website.vercel.app/api/email-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    setShow(true);
                    setIcon('success');
                    setMessage(`OTP sent successfully!`);
                    nextStep(1);
                } else {
                  setShow(true);
                  setIcon('error');
                  setMessage(`Failed to send OTP: ${data.message}`);
                }
            } catch (err) {
                console.log('Error sending OTP: ' + err);
            }
        }
    } else if (step === 1) {
        try {
            const res = await fetch(`https://ontap-creatives-website.vercel.app/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userInfo.email,
                    otp: otp,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShow(true);
                setIcon('success');
                setMessage(`OTP matched.`);
                nextStep(2);
                setEmailContent(
                <>
                    Hello <strong>OnTap Sales/Marketing Team</strong>,
                    <br />
                    <br />
                    I hope this message finds you well. I am reaching out to inquire about the availability and details of your{' '}
                    <strong>{productName}</strong> product. Could you kindly provide me with information regarding:
                    <br />
                    <br />
                    <ul className="list-disc list-inside space-y-2 pl-3">
                    <li>Pricing for different quantities</li>
                    <li>Available sizes and material options</li>
                    <li>Estimated production and delivery time</li>
                    </ul>
                    <br />
                    If there are any design guidelines or minimum order requirements, I would also appreciate it if you could share those details.
                    <br />
                    <br />
                    Thank you in advance for your assistance. I look forward to your reply.
                    <br />
                    <br />
                    Best regards,
                    <br />
                    <strong className="capitalize">{userInfo.name}</strong>
                    <br />
                    <a href={`tel:${userInfo.contact.trim().replace(/\s+/g, "")}`}>{userInfo.contact}</a>
                    <br />
                    <strong className="lowercase">{userInfo.email}</strong>
                </>
                );
            } else { 
              setShow(true);
              setIcon('error');
              setMessage(`OTP not matched.`);
            }
        } catch (err) { console.log(err) };
    } else {
        const messageHtml = emailRef.current?.innerHTML || '';

        const payload = {
            email: userInfo.email.toLowerCase(),
            name: userInfo.name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            subject: userInfo.subject,
            message: messageHtml,
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
            nextStep(0);
            storeUserInfo({
            name: '',
            contact: '',
            email: '',
            subject: `Product Inquiry: ${productName}`,
            });
            setOtp('');
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
    };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let value = e.target.value;

    // only keep one digit
    if (value.length > 1) {
      value = value.charAt(0);
    }

    // update OTP string
    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // move focus to next input automatically
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    const otpArray = otp.split("");
    for (let i = index; i < otpArray.length; i++) {
      otpArray[i] = " ";
    }
    setOtp(otpArray.join(""));
  };

  const searchCountry = countries.filter((c) => 
    c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );



  return (
    <div className='h-full w-full fixed top-0 left-0 bg-white/15 backdrop-blur-md z-100 flex items-center justify-center'>
        {show && (
          <Toast 
            icon={icon}
            message={message}
          />
        )}
        <div className='w-full h-full md:w-3/4 lg:w-1/2 md:h-2/3 rounded-xl bg-white shadow-md flex flex-col md:flex-row items-center p-3'>
            <button 
                type="button"
                className='md:hidden text-black/50 flex items-center gap-2 mr-auto rounded-md bg-light-blue/50 py-2 px-3 hover:text-black hover:bg-light-blue focus:text-white focus:bg-blue ease-out duration-200'
                onClick={() => setInquireItem(false)}
            ><HiOutlineArrowSmallLeft className='text-3xl'/></button>
            <ProductCard  
              imgUrl={imgUrl}
              productName={productName}
              productDesc={productDesc}
              size={size}
              setInquireItem={setInquireItem} 
              inquire={inquire}
              hoverable={hoverable}
            />
            <div className='h-full w-full md:w-3/5 flex flex-col items-end gap-5'>
                <span className='w-full flex justify-between items-start pt-5 md:pt-0'>
                    <span className='flex gap-3 items-center ml-3 md:ml-10 md:mt-3'>
                        <Image
                            alt='gmail icon'
                            height={500}
                            width={500}
                            src='/icons/gmaillogo.png'
                            className='w-6 md:w-8 aspect-square object-contain object-center'
                        />
                        <p className='font-semibold'>{step === 0 ? 'Leave Us a Message' : 'Account Verification'}</p>
                    </span>
                    <button 
                        type="button"
                        className='hidden md:block text-3xl text-neutral-400 rounded-full hover:bg-light-blue hover:text-rose-300 focus:bg-blue focus:text-rose-500 ease-out duration-200'
                        onClick={() => setInquireItem(false)}
                    ><HiOutlineXMark /></button>
                </span>
                <div className='h-full w-full px-2 md:px-10 flex flex-col gap-3 overflow-hidden md:mt-10'>
                    { step === 0 && (
                        <>
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='name'
                                    type="text" 
                                    placeholder='Name'
                                    value={userInfo.name}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none capitalize'
                                />
                            </span>
                            <span className='px-5 pl-0 rounded-md border border-neutral-200 flex gap-3'>
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
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='email'
                                    type="email" 
                                    placeholder='Email Address'
                                    value={userInfo.email}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none lowercase placeholder:capitalize'
                                />
                            </span>
                        </>
                    )}
                    { step === 1 && (
                        <>
                            <p>We sent a One-Time Code to your email  <strong>{userInfo.email}</strong>. Please check and input the OTP Key below.</p>
                            <span className='mt-auto grid grid-cols-6 gap-3 px-14'>
                                {[...Array(6)].map((_, index) => (
                                    <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={otp[index] === " " ? "" : otp[index] ?? ""}
                                    className="p-3 border border-gray-400 rounded-md text-center text-3xl text-dark-blue font-bold focus:outline-blue ease-out duration-200"
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    onChange={(e) => handleInput(e, index)}
                                    onClick={() => handleClick(index)}
                                    />
                                ))}
                            </span>
                        </>
                    )}
                    { step === 2 && (
                        <>
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='subject'
                                    type="text" 
                                    placeholder='Subject'
                                    value={userInfo.subject}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none'
                                />
                            </span>
                            <div
                                ref={emailRef}
                                contentEditable
                                suppressContentEditableWarning
                                className="overflow-x-hidden px-5 py-3 rounded-md border border-neutral-200 outline-none min-h-[200px] whitespace-pre-wrap"
                            >
                                {emailContent}
                            </div>
                        </>
                    )}
                    <span className='w-full flex justify-end gap-2 mt-5'>
                        { step > 0 && (
                            <button 
                                type="button"
                                className='flex gap-2 px-4 py-2 rounded-md border border-neutral-400 text-neutral-400 items-center hover:border-neutral-700 hover:text-neutral-600 focus:border-black focus:text-black ease-out duration-200'
                                onClick={() => { step === 2 ? nextStep(1) : nextStep(0)}}
                            >Back</button>
                        )}
                        <button 
                            type="button" 
                            className='flex gap-2 px-4 py-2 rounded-md bg-light-blue items-center hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                            onClick={submitEmail}
                        >Next<HiOutlineArrowLongRight /></button>
                    </span>
                    <span className='w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-auto md:mb-5'>
                        <p className='col-span-full font-semibold'>You can also reach out via </p>
                        <a
                            href='tel:+0270072412'                            
                            className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                        ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>(02) 7007-2412</a>
                        <a
                            href='tel:+639286935815'                            
                            className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                        ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>+63 928 693 5815</a>
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
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InquireItem