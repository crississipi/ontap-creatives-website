import React, { useRef, useState } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { FirstStep } from './tutorial'
import { useClickOutside } from '@/hooks'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { Country } from '@/types'
import { countries } from '@/data/countries'
import { TbCaretDownFilled } from 'react-icons/tb'
import Toast from './Toast'
import { HiMiniCheckCircle } from 'react-icons/hi2'
import { useUser } from '@/contexts/UserContext'

interface AccountSignInProps {
    setShowLogin: (showLogin: boolean) => void;
}

const AccountSignIn = ({ setShowLogin }: AccountSignInProps) => {
  const [signIn, setSignIn] = useState(true);
  const [countryCodeOptions, showCountryCodeOptions] = useState(false);
  const [countryCode, selectedCountryCode] = useState<Country>(countries[136]);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const searchCountry = countries.filter((c) => 
      c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const clickRef = useClickOutside<HTMLDivElement>(() => setShowLogin(false));
  const contactRef = useClickOutside<HTMLDivElement>(() => showCountryCodeOptions(false));
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState('info');
  const [message, setMessage] = useState('Template Info');
  const [steps, setStep] = useState<'step-1' | 'step-2' | 'step-3'>('step-1');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string>("".padEnd(6, " "));
  const [userInfo, storeUserInfo] = useState({
    username: '',
    name: '',
    contact: '',
    email: '',
    pass: '',
    confirmPass: ''
  });

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const { login } = useUser()

  const showToast = (iconType: string, messageText: string) => {
    setIcon(iconType);
    setMessage(messageText);
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  const sendOtp = async () => {
    if (!userInfo.email || !userInfo.name) {
      showToast('error', 'Please fill in name and email first');
      return false;
    }

    setSendingOtp(true);
    try {
      const response = await fetch('/api/email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', 'OTP sent to your email!');
        return true;
      } else {
        showToast('error', data.message || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      showToast('error', 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async () => {
  if (!loginInfo.email || !loginInfo.password) {
    showToast('error', 'Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
    });

    // Read the response once and store it
    const data = await response.json();

    if (!response.ok) {
      showToast('error', data.error || 'Login failed');
      return;
    }

    showToast('success', 'Login successful!');
    login(data.user);
    
    setTimeout(() => {
      setShowLogin(false);
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);
    showToast('error', 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
  };

  const handleSignUp = async () => {
    if (steps === 'step-1') {
      // Validate step 1
      if (!userInfo.name || !userInfo.email || !userInfo.contact) {
        showToast('error', 'Please fill in all fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo.email)) {
        showToast('error', 'Please enter a valid email address');
        return;
      }

      // Send OTP before proceeding to step 2
      const otpSent = await sendOtp();
      if (otpSent) {
        setStep('step-2');
      }
      return;
    }

    if (steps === 'step-2') {
    // Validate OTP
    const enteredOtp = otp.replace(/\s/g, '');
    if (enteredOtp.length !== 6) {
      showToast('error', 'Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userInfo.email, 
          otp: enteredOtp 
        }),
      });

      // Read response once
      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast('error', data.message || 'OTP verification failed');
        return;
      }

      setStep('step-3');
      showToast('success', 'Email verified successfully!');
      
    } catch (error) {
      showToast('error', 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
    return;
    }

    if (steps === 'step-3') {
        // Validate step 3
        if (!userInfo.pass || !userInfo.confirmPass) {
        showToast('error', 'Please fill in all fields');
        return;
        }

        if (userInfo.pass !== userInfo.confirmPass) {
        showToast('error', 'Passwords do not match');
        return;
        }

        if (userInfo.pass.length < 6) {
        showToast('error', 'Password must be at least 6 characters');
        return;
        }

        setLoading(true);
        try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.contact,
            password: userInfo.pass
            }),
        });

        // Read response once
        const data = await response.json();

        if (!response.ok) {
            showToast('error', data.error || 'Signup failed');
            return;
        }

        showToast('success', 'Account created successfully!');
        
        // Auto login after successful signup
        if (data.user) {
            login(data.user);
        }
        
        setTimeout(() => {
            setSignIn(true);
            setStep('step-1');
            storeUserInfo({
            username: '',
            name: '',
            contact: '',
            email: '',
            pass: '',
            confirmPass: ''
            });
            setOtp("".padEnd(6, " "));
            setShowLogin(false); // Close the modal
        }, 1500);

        } catch (error) {
        showToast('error', 'Network error. Please try again.');
        } finally {
        setLoading(false);
        }
    }
  };

  const handleResendOtp = async () => {
    await sendOtp();
  };

  const handleClick = (index: number) => {
    const otpArray = otp.split("");
    for (let i = index; i < otpArray.length; i++) {
      otpArray[i] = " ";
    }
    setOtp(otpArray.join(""));
  };

  const getInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
      if (value && index < inputRef.current.length - 1) {
        inputRef.current[index + 1]?.focus();
      }
  };

  return (
    <div className='h-full w-full bg-white/40 backdrop-blur-md fixed z-999 flex items-center justify-center'>
        {show && (
          <Toast 
            icon={icon}
            message={message}
          />
        )}
        <div ref={clickRef} className='hidden lg:flex h-3/5 w-5/6 xl:w-3/4 2xl:w-2/3 flex-row bg-light-blue rounded-lg shadow-md z-40 overflow-hidden relative'>
            <motion.div 
            initial={{left: '0%'}}
            animate={{left: signIn ? '0%' : '60%'}}
            transition={{
                duration: 0.5,
                stiffness: 150
            }}
            className='h-full flex flex-col w-2/5 bg-white pt-10 pb-5 px-5 absolute z-20'
            >
                {signIn ? (
                <>
                    <h1 className='text-xl font-extrabold'>Welcome Back!</h1>
                    <span>We missed you.</span>
                    <div className='my-auto w-full flex flex-col gap-3'>
                        <span className='flex flex-col'>
                            <label htmlFor="loginEmail" className='text-sm text-black/50'>Email Address</label>
                            <input 
                                name='email' 
                                type="email" 
                                placeholder='Enter your email address' 
                                value={loginInfo.email}
                                onChange={handleLoginInput}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                        <span className='flex flex-col'>
                            <label htmlFor="password" className='text-sm text-black/50'>Password</label>
                            <input 
                                name='password' 
                                type="password" 
                                placeholder='Enter your password' 
                                value={loginInfo.password}
                                onChange={handleLoginInput}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                        <button type="button" className='font-bold hover:text-blue focus:text-violet ease-out duration-200 ml-auto -mt-2 mb-3'>forgot password?</button>
                        <button 
                          type="button" 
                          className='py-3 w-full rounded-md text-center bg-light-blue hover:bg-blue focus:bg-violet focus:text-white ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {loading ? 'LOGGING IN...' : 'LOG IN'}
                        </button>
                    </div>
                    <div className='flex items-center gap-1 mx-auto'>
                        <span className='h-1 w-10 border-b'></span> or <span className='h-1 w-10 border-b'></span>
                    </div>
                    <div className='flex gap-3 mt-5'>
                        <button type="button" className='p-2 pl-3 border border-black/10 hover:border-violet focus:bg-[linear-gradient(135deg,rgba(234,67,53,1)_0%,rgba(251,188,5,1)_25%,rgba(52,168,83,1)_50%,rgba(66,133,244,1)_100%)] focus:text-white focus:border-black ease-out duration-200 w-full rounded-md flex items-center gap-5'>
                            <FcGoogle className='text-2xl'/>
                            <span>Google</span>
                        </button>
                        <button type="button" className='p-2 pl-3 border border-black/10 hover:border-blue focus:bg-blue-600 focus:text-white group ease-out duration-200 w-full rounded-md flex items-center gap-5'>
                            <FaFacebook className='text-2xl text-blue-600 group-focus:text-white'/>
                            <span>Facebook</span>
                        </button>
                    </div>
                    <div className='mt-auto flex flex-col gap-3'>
                        <span className='text-sm'>Don't have an account yet?</span>
                        <button 
                            type="button" 
                            className='px-3 py-2 rounded-md border border-light-blue hover:bg-dark-blue focus:bg-violet hover:text-white ease-out duration-200' 
                            onClick={() => setSignIn(false)}
                        >SIGN UP</button>
                    </div>
                </>
                ) : (
                <>
                    <h1 className='text-xl font-extrabold'>Hello, Welcome</h1>
                    <span>Elevate your first impression with just a tap.</span>
                    <div className='mt-10 w-full flex gap-1'>
                        <p className={`text-nowrap text-sm flex items-center gap-1 rounded-md transition-colors ease-out duration-200 ${steps === 'step-1' ? 'bg-blue text-white px-3' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                            {steps !== 'step-1' && <HiMiniCheckCircle className='text-2xl text-blue-400'/>}
                            Step 1
                            {steps === 'step-1' && <span>: Contact Details</span>}
                        </p>
                        <p className={`text-nowrap text-sm flex items-center gap-1 p-1.5 pr-2.5 rounded-md ${steps === 'step-2' ? 'bg-blue text-white px-3' : steps === 'step-1' ? '' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                            {steps !== 'step-2' && steps !== 'step-1' && <HiMiniCheckCircle className='text-2xl text-blue-400'/>}
                            Step 2
                            {steps === 'step-2' && <span>: Email Verification</span>}
                        </p>
                        <p className={`text-nowrap text-sm flex items-center gap-1 p-1.5 pr-2.5 rounded-md ${steps === 'step-3' ? 'bg-blue text-white px-3' : steps === 'step-2' || steps === 'step-1' ? '' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                            Step 3
                            {steps === 'step-3' && <span>: Set up password</span>}
                        </p>
                    </div>
                    <div className='mb-auto mt-5 w-full flex flex-col gap-3'>
                        {steps === 'step-1' && (
                        <>
                            <span className='flex flex-col'>
                                <label htmlFor="signInName" className='text-sm text-black/50'>Company/Client Name</label>
                                <input 
                                    name='name' 
                                    type="text"
                                    placeholder='Enter your name' 
                                    value={userInfo.name}
                                    onChange={(e) => getInputs(e)}
                                    className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                                />
                            </span>
                            <span className='flex flex-col'>
                                <label htmlFor="signInEmail" className='text-sm text-black/50'>Email Address</label>
                                <input 
                                    name='email' 
                                    type="email" 
                                    placeholder='Enter your email address' 
                                    value={userInfo.email}
                                    onChange={(e) => getInputs(e)}
                                    className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                                />
                            </span>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="signInEmail" className='text-sm text-black/50'>Contact Number</label>
                                <span className='px-5 pl-0 rounded-md border border-black/30 flex gap-3 hover:border-blue focus:border-violet ease-out duration-200'>
                                    <div className='relative flex gap-2 items-center'>
                                        <button 
                                            type="button"
                                            className='h-full w-full bg-light-blue py-2 px-3 pr-2 flex items-center gap-1 rounded-l-sm group hover:text-white hover:bg-dark-blue focus:text-white focus:bg-violet ease-out duration-200'
                                            onClick={ () => showCountryCodeOptions(!countryCodeOptions) }
                                        >
                                            <span>{countryCode?.icon}</span>
                                            <span className='font-extrabold ml-2'>{countryCode?.code}</span>
                                            <TbCaretDownFilled className='text-neutral-400 group-hover:text-neutral-600 group-focus:text-black'/>
                                        </button>
                                        { countryCodeOptions && (
                                            <div ref={contactRef} className='absolute h-auto max-h-50 w-auto z-50 rounded-md bg-white top-full mt-1 overflow-x-hidden border border-black/20 shadow-md'>
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
                            </div>
                        </>
                        )}
                        {steps === 'step-2' && (
                        <>
                            <p>We sent a One-Time Code to your email  <strong>{userInfo.email}</strong>. Please check and input the OTP Key below.</p>
                            <div className='w-3/4 grid grid-cols-6 border border-neutral-300 rounded-xl mx-auto my-5 px-2'>
                                {[...Array(6)].map((_, index) => (
                                    <input
                                    key={index}
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={otp[index] === " " ? "" : otp[index] ?? ""}
                                    className="h-14 col-span-1 text-center text-3xl ease-out duration-200 font-extrabold"
                                    placeholder='&bull;'
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    onChange={(e) => handleInputs(e, index)}
                                    onClick={() => handleClick(index)}
                                    />
                                ))}
                            </div>
                            <div className='text-center'>
                                <button 
                                  type="button" 
                                  onClick={handleResendOtp}
                                  disabled={sendingOtp}
                                  className='text-blue hover:text-violet focus:text-dark-blue ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                  {sendingOtp ? 'Sending OTP...' : 'Resend OTP'}
                                </button>
                            </div>
                        </>
                        )}
                        {steps === 'step-3' && (
                        <>
                            <span className='flex flex-col'>
                                <label htmlFor="signInPassword" className='text-sm text-black/50'>Password</label>
                                <input 
                                    name='pass' 
                                    type="password" 
                                    placeholder='Enter your password' 
                                    value={userInfo.pass}
                                    onChange={(e) => getInputs(e)}
                                    className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                                />
                            </span>
                            <span className='flex flex-col'>
                                <label htmlFor="signInConfirmPassword" className='text-sm text-black/50'>Confirm Password</label>
                                <input 
                                    name='confirmPass' 
                                    type="password" 
                                    placeholder='Re-enter your password' 
                                    value={userInfo.confirmPass}
                                    onChange={(e) => getInputs(e)}
                                    className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                                />
                            </span>
                        </>
                        )}
                        <div className='w-full flex justify-end items-center gap-1'>
                            {steps !== 'step-1' && (
                              <button 
                                type='button' 
                                className='px-3 py-2 rounded-md flex items-center gap-2 border border-black/30 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' 
                                onClick={() => setStep(steps === 'step-3' ? 'step-2' : 'step-1')}
                              >
                                <RiArrowLeftLine /> Back 
                              </button>
                            )}
                            <button 
                              type='button' 
                              className='px-3 py-2 rounded-md flex items-center gap-2 border border-black/30 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                              onClick={handleSignUp}
                              disabled={loading || (steps === 'step-2' && sendingOtp)}
                            >
                              {loading ? 'PROCESSING...' : steps === 'step-3' ? 'SIGN UP' : 'Next'} 
                              {!loading && steps !== 'step-3' && <RiArrowRightLine />}
                            </button>
                        </div>
                    </div>
                    <div className='flex w-full flex-col gap-2'>
                        <p className='text-sm'>Already have an account?</p>
                        <button 
                            type="button" 
                            className='px-3 py-2 rounded-md border border-light-blue hover:bg-dark-blue focus:bg-violet hover:text-white ease-out duration-200'
                            onClick={() => setSignIn(true)}
                        >SIGN IN</button>
                    </div>
                </>
                )}
                
            </motion.div>
            <div className={`h-full relative ${signIn && 'ml-auto'} w-3/5`}>
                <FirstStep />
                <div className='absolute bottom-3 right-3 flex items-center gap-3'>
                    <button type="button" className='p-2 rounded-md border text-lg'><RiArrowLeftLine /></button>
                    <div className='flex items-center gap-1'>
                        {Array.from({ length: 4 }).map((_,i) => (
                            <span key={i} className='w-3 h-3 rounded-full shadow-md shadow-black/20 border'></span>
                        ))}
                    </div>
                    <button type="button" className='p-2 rounded-md border text-lg'><RiArrowRightLine /></button>
                </div>
            </div>
        </div>
        
        {/* Mobile View - Updated with same functionality */}
        <div className='lg:hidden h-max w-5/6 pt-10 pb-5 px-5 mx-auto flex flex-col lg:flex-row bg-white rounded-lg shadow-md z-40 overflow-hidden relative'>
            {signIn ? (
            <>
                <h1 className='text-xl font-extrabold'>Welcome Back!</h1>
                <span>We missed you.</span>
                <div className='mt-10 w-full flex flex-col gap-3'>
                    <span className='flex flex-col'>
                        <label htmlFor="loginEmail" className='text-sm text-black/50'>Email Address</label>
                        <input 
                            name='email' 
                            type="email" 
                            placeholder='Enter your email address' 
                            value={loginInfo.email}
                            onChange={handleLoginInput}
                            className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                        />
                    </span>
                    <span className='flex flex-col'>
                        <label htmlFor="password" className='text-sm text-black/50'>Password</label>
                        <input 
                            name='password' 
                            type="password" 
                            placeholder='Enter your password' 
                            value={loginInfo.password}
                            onChange={handleLoginInput}
                            className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                        />
                    </span>
                    <button type="button" className='font-bold hover:text-blue focus:text-violet ease-out duration-200 ml-auto -mt-2 mb-3'>forgot password?</button>
                    <button 
                      type="button" 
                      className='py-3 w-full rounded-md text-center bg-light-blue hover:bg-blue focus:bg-violet focus:text-white ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? 'LOGGING IN...' : 'LOG IN'}
                    </button>
                </div>
                <div className='flex items-center gap-1 mx-auto'>
                    <span className='h-1 w-10 border-b'></span> or <span className='h-1 w-10 border-b'></span>
                </div>
                <div className='flex gap-3 mt-5'>
                    <button type="button" className='p-2 pl-3 border border-black/10 hover:border-violet focus:bg-[linear-gradient(135deg,rgba(234,67,53,1)_0%,rgba(251,188,5,1)_25%,rgba(52,168,83,1)_50%,rgba(66,133,244,1)_100%)] focus:text-white focus:border-black ease-out duration-200 w-full rounded-md flex items-center gap-5'>
                        <FcGoogle className='text-2xl'/>
                        <span>Google</span>
                    </button>
                    <button type="button" className='p-2 pl-3 border border-black/10 hover:border-blue focus:bg-blue-600 focus:text-white group ease-out duration-200 w-full rounded-md flex items-center gap-5'>
                        <FaFacebook className='text-2xl text-blue-600 group-focus:text-white'/>
                        <span>Facebook</span>
                    </button>
                </div>
                <div className='mt-10 flex flex-col gap-3'>
                    <span className='text-sm'>Don't have an account yet?</span>
                    <button 
                        type="button" 
                        className='px-3 py-2 rounded-md border border-light-blue hover:bg-dark-blue focus:bg-violet hover:text-white ease-out duration-200' 
                        onClick={() => setSignIn(false)}
                    >SIGN UP</button>
                </div>
            </>
            ) : (
            <>
                <h1 className='text-xl font-extrabold'>Hello, Welcome</h1>
                <span>Elevate your first impression with just a tap.</span>
                <div className='mt-10 w-full flex gap-1'>
                    <p className={`text-nowrap text-sm flex items-center gap-1 rounded-md transition-colors ease-out duration-200 ${steps === 'step-1' ? 'bg-blue text-white px-3' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                        {steps !== 'step-1' && <HiMiniCheckCircle className='text-2xl text-blue-400'/>}
                        Step 1
                        {steps === 'step-1' && <span>: Contact Details</span>}
                    </p>
                    <p className={`text-nowrap text-sm flex items-center gap-1 p-1.5 pr-2.5 rounded-md ${steps === 'step-2' ? 'bg-blue text-white px-3' : steps === 'step-1' ? '' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                        {steps !== 'step-2' && steps !== 'step-1' && <HiMiniCheckCircle className='text-2xl text-blue-400'/>}
                        Step 2
                        {steps === 'step-2' && <span>: Email Verification</span>}
                    </p>
                    <p className={`text-nowrap text-sm flex items-center gap-1 p-1.5 pr-2.5 rounded-md ${steps === 'step-3' ? 'bg-blue text-white px-3' : steps === 'step-2' || steps === 'step-1' ? '' : 'bg-light-blue p-1.5 pr-2.5'}`}>
                        Step 3
                        {steps === 'step-3' && <span>: Set up password</span>}
                    </p>
                </div>
                <div className='mb-auto mt-5 w-full flex flex-col gap-3'>
                    {steps === 'step-1' && (
                    <>
                        <span className='flex flex-col'>
                            <label htmlFor="signInName" className='text-sm text-black/50'>Company/Client Name</label>
                            <input 
                                name='name' 
                                type="text"
                                placeholder='Enter your name' 
                                value={userInfo.name}
                                onChange={(e) => getInputs(e)}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                        <span className='flex flex-col'>
                            <label htmlFor="signInEmail" className='text-sm text-black/50'>Email Address</label>
                            <input 
                                name='email' 
                                type="email" 
                                placeholder='Enter your email address' 
                                value={userInfo.email}
                                onChange={(e) => getInputs(e)}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="signInEmail" className='text-sm text-black/50'>Contact Number</label>
                            <span className='px-5 pl-0 rounded-md border border-black/30 flex gap-3 hover:border-blue focus:border-violet ease-out duration-200'>
                                <div className='relative flex gap-2 items-center'>
                                    <button 
                                        type="button"
                                        className='h-full w-full bg-light-blue py-2 px-3 pr-2 flex items-center gap-1 rounded-l-sm group hover:text-white hover:bg-dark-blue focus:text-white focus:bg-violet ease-out duration-200'
                                        onClick={ () => showCountryCodeOptions(!countryCodeOptions) }
                                    >
                                        <span>{countryCode?.icon}</span>
                                        <span className='font-extrabold ml-2'>{countryCode?.code}</span>
                                        <TbCaretDownFilled className='text-neutral-400 group-hover:text-neutral-600 group-focus:text-black'/>
                                    </button>
                                    { countryCodeOptions && (
                                        <div ref={contactRef} className='absolute h-auto max-h-50 w-auto z-50 rounded-md bg-white top-full mt-1 overflow-x-hidden border border-black/20 shadow-md'>
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
                                    className='h-full w-full outline-none my-auto'
                                />
                            </span>
                        </div>
                    </>
                    )}
                    {steps === 'step-2' && (
                    <>
                        <p>We sent a One-Time Code to your email  <strong>{userInfo.email}</strong>. Please check and input the OTP Key below.</p>
                        <div className='w-3/4 grid grid-cols-6 border border-neutral-300 rounded-xl mx-auto my-5 px-2'>
                            {[...Array(6)].map((_, index) => (
                                <input
                                key={index}
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={otp[index] === " " ? "" : otp[index] ?? ""}
                                className="h-14 col-span-1 text-center text-3xl ease-out duration-200 font-extrabold"
                                placeholder='&bull;'
                                ref={(el) => {
                                    inputRef.current[index] = el;
                                }}
                                onChange={(e) => handleInput(e, index)}
                                onClick={() => handleClick(index)}
                                />
                            ))}
                        </div>
                        <div className='text-center'>
                            <button 
                              type="button" 
                              onClick={handleResendOtp}
                              disabled={sendingOtp}
                              className='text-blue hover:text-violet focus:text-dark-blue ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {sendingOtp ? 'Sending OTP...' : 'Resend OTP'}
                            </button>
                        </div>
                    </>
                    )}
                    {steps === 'step-3' && (
                    <>
                        <span className='flex flex-col'>
                            <label htmlFor="signInPassword" className='text-sm text-black/50'>Password</label>
                            <input 
                                name='pass' 
                                type="password" 
                                placeholder='Enter your password' 
                                value={userInfo.pass}
                                onChange={(e) => getInputs(e)}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                        <span className='flex flex-col'>
                            <label htmlFor="signInConfirmPassword" className='text-sm text-black/50'>Confirm Password</label>
                            <input 
                                name='confirmPass' 
                                type="password" 
                                placeholder='Re-enter your password' 
                                value={userInfo.confirmPass}
                                onChange={(e) => getInputs(e)}
                                className='px-3 py-2 rounded-md border border-black/30 hover:border-blue focus:border-violet focus:text-violet ease-out duration-200'
                            />
                        </span>
                    </>
                    )}
                    <div className='w-full flex justify-end items-center gap-1'>
                        {steps !== 'step-1' && (<button type='button' className='px-3 py-2 rounded-md flex items-center gap-2 border border-black/30 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setStep(steps === 'step-3' ? 'step-2' : 'step-1')}><RiArrowLeftLine /> Back </button>)}
                        <button 
                          type='button' 
                          className='px-3 py-2 rounded-md flex items-center gap-2 border border-black/30 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={handleSignUp}
                          disabled={loading || (steps === 'step-2' && sendingOtp)}
                        >
                          {loading ? 'PROCESSING...' : steps === 'step-3' ? 'SIGN UP' : 'Next'} 
                          {!loading && steps !== 'step-3' && <RiArrowRightLine />}
                        </button>
                    </div>
                </div>
                <div className='flex w-full flex-col gap-2 mt-10'>
                    <p className='text-sm'>Already have an account?</p>
                    <button 
                        type="button" 
                        className='px-3 py-2 rounded-md border border-light-blue hover:bg-dark-blue focus:bg-violet hover:text-white ease-out duration-200'
                        onClick={() => setSignIn(true)}
                    >SIGN IN</button>
                </div>
            </>
            )}
        </div>
    </div>
  )
}

export default AccountSignIn