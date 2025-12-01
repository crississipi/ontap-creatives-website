"use client";

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { RiCharacterRecognitionLine, RiDeviceLine, RiLayout3Line, RiMessageLine, RiRefreshLine, RiVerifiedBadgeLine } from 'react-icons/ri'
import Image from 'next/image'
import { FaQuoteLeft, FaArrowPointer } from 'react-icons/fa6'
import { LuSparkle } from "react-icons/lu";
import { GiCheckMark } from "react-icons/gi";
import { PiCursorFill } from "react-icons/pi";
import { RiUserSmileLine, RiWifiFill, RiBearSmileLine, RiBatteryFill, RiGlobalLine, RiFacebookCircleFill, RiInstagramLine, RiTiktokFill, RiMailLine, RiPhoneFill,RiMapPin5Fill, RiArrowRightLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { PiHandPointingBold,PiShoppingCartBold, PiPenBold, PiPlugsConnectedBold, PiMoneyWavyBold, PiShoppingCartSimpleBold } from "react-icons/pi";

const bizcards = [
    {
        image: '/images/card-1/front.png',
        name: 'Polyvinyl Business Card - White',
        info: 'Upgrade the way you connect with the Polyvinyl Business Card — built from durable, high-quality polyvinyl that is waterproof, scratch-resistant, and reusable. Designed to last, it is the smarter choice over traditional paper cards. Pair it with NFC or QR code technology for instant sharing and effortless networking.'
    },
    {
        image: '/images/card-2/front.png',
        name: 'Carbon Fiber Digital Business Card',
        info: 'Upgrade your networking with the Carbon Fiber Digital Business Card — where luxury design meets smart technology. Crafted from premium carbon fiber, it offers a sleek, lightweight, and ultra-durable finish that sets you apart from the ordinary. Featuring NFC tap-to-share and QR code integration, you can exchange contact details, share your brand, and connect instantly — all with just one tap. Say goodbye to reprints and hello to a smarter, eco-friendly way to network.'
    },
    {
        image: '/images/card-3/front.png',
        name: 'Bamboo Digital Business Card',
        info: 'Choose sustainability with style through the Bamboo Digital Business Card. Made from eco-friendly bamboo, this card blends durability, functionality, and modern design to ensure you stand out. Every piece features a distinct natural wood grain, offering a warm and elegant finish that highlights both professionalism and environmental responsibility.'
    },
    {
        image: '/images/card-4/front.png',
        name: 'Elite Digital Business Card',
        info: 'The Elite Digital Business Card offers simplicity at its finest. With a smooth acrylic build and glass-like clarity, it\'s a professional essential that combines modern elegance with lasting durability — perfect for those who value clean, timeless design. Acrylic luxury. Digital convenience. Lasting impression'
    },
    {
        image: '/images/card-5/front.png',
        name: 'Polyvinyl Business Card - Black',
        info: 'Upgrade the way you connect with the Polyvinyl Business Card — built from durable, high-quality polyvinyl that is waterproof, scratch-resistant, and reusable. Designed to last, it is the smarter choice over traditional paper cards. Pair it with NFC or QR code technology for instant sharing and effortless networking.'
    }
];

const products = [
    {
        image: '/images/id-tap.png',
        name: 'ID Tap',
        info: 'ID Tap is designed for professionals and teams who want more than just a traditional ID. It doubles as a digital networking tool, enabling employees to represent the company while seamlessly sharing their digital identity.'
    },
    {
        image: '/images/key-chain.png',
        name: 'Pop Up Keychain',
        info: 'Interactive pop-up keychain with digital features.'
    },
    {
        image: '/images/standee.png',
        name: 'QR Standee / Table Tap',
        info: 'QR code standee and table tap for digital interactions.'
    },
    {
        image: '/images/dog-tag.png',
        name: 'Dog Tag',
        info: 'Pet identification and information badge with digital capabilities.'
    },
    {
        image: '/images/info-tag.png',
        name: 'Info Tag',
        info: 'Say goodbye to bulky cards! Infotap turns your phone into a smart networking tool. Stick it on, tap, and share your world — whether it\'s Facebook, Instagram, YouTube, or your portfolio. Instant fun, and eco-friendly.'
    },
]

const features = [
    {
        icon: <RiLayout3Line className='text-5xl'/>,
        name: 'Interactive Design',
        info: 'Impress your contacts with a modern and interactive layout.'
    },
    {
        icon: <RiMessageLine className='text-4xl'/>,
        name: 'Contactless Sharing',
        info: 'Simply tap and share your details effortlessly.'
    },
    {
        icon: <RiCharacterRecognitionLine className='text-5xl'/>,
        name: 'Custom Branding',
        info: 'Tailor the card to reflect your unique brand identity.'
    },
    {
        icon: <RiDeviceLine className='text-5xl'/>,
        name: 'Multi-Platform Compatibility',
        info: 'Access your digital card on various devices for seamless networking.'
    },
    {
        icon: <RiVerifiedBadgeLine className='text-5xl'/>,
        name: 'Online Presence',
        info: 'Enhancing digital visibility across diverse online platforms.'
    },
    {
        icon: <RiRefreshLine className='text-4xl'/>,
        name: 'Real-Time Update',
        info: 'Keep your contacts informed with instant update.'
    }
]

const items = [
    [
        '/images/card-1/front.png',
        '/images/card-2/front.png',
        '/images/card-3/front.png',
        '/images/card-4/front-card.png',
        '/images/card-5/front.png',
    ],
    [
        '/images/card-1/back.png',
        '/images/card-2/back.png',
        '/images/card-3/back.png',
        '/images/card-4/back-card.png',
        '/images/card-5/back.png',
    ]
]

const Funnel = () => {
  const [feed, showFeedback] = useState(0);
  const [prod, setProd] = useState(0);
  const [img, setImg] = useState(0);
  const [biz, setBiz] = useState(0);

  useEffect(() => { 
    const timer = setTimeout(() => { 
      showFeedback((prev) => prev < 2 ? prev + 1 : 0);
    }, 7000);
    return () => clearTimeout(timer);
  }, [feed]);
  
  useEffect(() => { 
    const timer = setTimeout(() => { 
      setProd((prev) => prev < 4 ? prev + 1 : 0);
    }, 6000);
    return () => clearTimeout(timer);
  }, [prod]);
  
  useEffect(() => { 
    const timer = setTimeout(() => { 
      setImg((prev) => prev < 4 ? prev + 1 : 0);
    }, 5000);
    return () => clearTimeout(timer);
  }, [img]);
  
  useEffect(() => { 
    const timer = setTimeout(() => { 
      setBiz((prev) => prev < 4 ? prev + 1 : 0);
    }, 5000);
    return () => clearTimeout(timer);
  }, [biz]);

  return (
    <section className='w-full flex flex-col relative gap-y-20'>
        <Image 
            height={4096} 
            width={4096} 
            alt='hero-bg image' 
            src='/images/ontap-hero-bg.png' 
            className='h-full w-full object-cover fixed top-1/2 left-1/2 -translate-1/2'
            draggable={false}
        />
        <motion.div 
            animate={{rotateZ: [0, 360]}} 
            transition={{ duration: 15, ease: 'linear', repeat: Infinity, repeatType: 'loop'}} 
            className='w-full aspect-square bg-conic-90 from-dark-blue/75 via-black/95 to-transparent scale-200 fixed blur-3xl top-1/2 left-1/2 -translate-1/2'
        >
            <div className="absolute inset-0 noise"></div>
        </motion.div>
        <div className='w-full h-[100vh] flex items-center relative'>
            <div className='h-max w-3/7 flex flex-col px-10 z-20 pt-32'>
                <h1 className='text-7xl text-white'>Smart Business Card</h1>
                <p className='w-full flex justify-between gap-3 text-lg text-light-blue mt-3'>
                    <span>DIGITAL TREND</span>•
                    <span>INNOVATIONS</span>•
                    <span>SEAMLESS CONNECTIONS</span>
                </p>
                <p className='text-2xl mt-10 text-justify text-white'>Turn every interaction into an opportunity for growth. Embrace the future of networking with our Digital Business Card - your key to a world with endless possibilities.</p>
                <AnimatePresence mode='wait'>
                    <div className='w-full grid grid-cols-2 gap-2 mt-10 pb-30'>
                        {features.map((f, i) => (
                            <motion.span 
                            initial={{ x: -999, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -999, opacity: 0 }}
                            transition={{ duration: 0.3, delay: ( i / 10 ) + ( i % 1 ) }}
                            key={f + '_' + i} 
                            className='rounded-lg flex items-center gap-3 p-3 bg-white/10 backdrop-blur-xl border border-black/20 shadow-md text-white'
                            >
                                {f.icon}
                                <span className='flex flex-col leading-4.5'>
                                    <h2 className='text-lg'>{f.name}</h2>
                                    <p>{f.info}</p>
                                </span>
                            </motion.span>
                        ))}
                    </div>
                </AnimatePresence>
            </div>
            <div className='h-full w-4/7 flex items-center justify-center relative'>
                <div className='mt-auto h-4/5 w-100 rounded-4xl border-8 border-black bg-black flex flex-col overflow-hidden shadow-xl shadow-blue/25 mb-5 relative'>
                    <span className='w-full h-10 border-b bg-[#111111] border-white/20 flex justify-between px-5 text-white relative'>
                        <strong className='mt-2'>12:00</strong>
                        <span className='w-10 h-10 rounded-b-full left-1/2 -translate-x-1/2 absolute before:h-6 before:w-6 before:rounded-full before:absolute before:bg-white/30 before:top-1/2 before:left-1/2 before:-translate-1/2 
                        after:h-4 after:w-4 after:absolute after:rounded-full after:bg-black after:top-1/2 after:left-1/2 after:-translate-1/2'></span>
                        <span className='flex items-center gap-2 text-lg'>
                            <RiWifiFill />
                            <span className='flex items-center gap-1 text-xs'>
                                <RiBatteryFill className='text-xl'/>
                                86%
                            </span>
                        </span>
                    </span>
                    <div className='h-full w-full flex flex-col'>
                        <span className='w-full h-48 bg-white'>
                            <Image
                                height={4096}
                                width={4096}
                                alt='Profile Cover'
                                src='/images/about-img-1.png'
                                className='w-full h-full object-cover object-center'
                            />
                        </span>
                        <div className='w-full h-full flex flex-col relative'>
                            <span className='h-full w-full absolute top-1/2 left-1/2 -translate-1/2 
                            before:h-full before:w-full before:absolute before:z-1 before:bg-black/30'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt="app bg"
                                    src="/images/app-bg.png"
                                    className='h-full w-full object-cover object-center'
                                />
                            </span>
                            <span className='h-max w-full flex items-center gap-3 pl-5 py-3 z-10 bg-ink-black'>
                                <span className='h-24 aspect-square rounded-full bg-white flex items-center justify-center'>
                                    <Image
                                        height={4096}
                                        width={4096}
                                        alt='Profile logo'
                                        src='/images/logo.png'
                                        className='h-16 w-16 object-contain object-center'
                                    />
                                </span>
                                <span className='h-full flex flex-col leading-3 text-white text-sm'>
                                    <strong className='text-lg'>ONTAP CREATIVES</strong>
                                    BUSINESS
                                    <p className='pl-2 mt-5 border-l-4 border-white/50'>
                                        Turn every interaction into an opportunity for growth.
                                    </p>
                                </span>
                            </span>
                            <span className='w-full flex items-center justify-center gap-3 text-white text-4xl z-10 py-3'>
                                <RiGlobalLine />
                                <RiFacebookCircleFill />
                                <RiInstagramLine />
                                <RiTiktokFill />
                            </span>
                            <div className='h-max w-full flex flex-col items-center gap-3 z-10 text-sm'>
                                <span className='w-2/3 rounded-2xl bg-ink-black px-3 py-2 gap-2 flex flex-col items-center'>
                                    <span className='h-10 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-xl text-blue'>
                                        <RiMailLine />
                                    </span>
                                    <p className='text-white'>ontapcreatives@gmail.com</p>
                                </span>
                                <span className='w-2/3 rounded-2xl bg-ink-black px-3 py-2 gap-2 flex flex-col items-center'>
                                    <span className='h-10 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-xl text-blue'>
                                        <RiPhoneFill />
                                    </span>
                                    <p className='text-white'>+ 63 917708364</p>
                                </span>
                                <span className='w-2/3 rounded-2xl bg-ink-black px-3 py-2 gap-2 flex flex-col items-center'>
                                    <span className='h-10 aspect-square rounded-full border border-blue bg-footer-bg flex items-center justify-center text-xl text-blue'>
                                        <RiMapPin5Fill />
                                    </span>
                                    <p className='text-white text-center'>Vatican City Dr, Las Piñas, 1740, Metro Manila</p>
                                </span>
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
                <span>
                    <Image
                        height={4096}
                        width={4096}
                        alt='card logo'
                        src='/images/card-2/front.png'
                        className='w-100 aspect-[3/2] rounded-2xl object-cover object-center absolute top-30 right-30 z-30 shadow-lg shadow-black/40'
                    />
                </span>
            </div>
        </div>
        <div className='w-full h-[100vh] z-50 overflow-hidden flex items-center justify-center p-5 py-10 gap-10'>
            <div className='h-5/6 w-2/5 p-0.5 flex items-center justify-center relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md'>
                <motion.span 
                animate={{ rotateZ: [0,360]}}
                transition={{
                    duration: 10,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop'
                }}
                    className='w-full h-full absolute top-0 left-1/2 -translate-x-1/2 
                    scale-400 gradient blur-md'>
                </motion.span>
                <div className='h-full w-full z-10 rounded-3xl overflow-hidden relative flex items-center justify-center'>
                    <div className='h-full w-full bg-black/50 backdrop-blur-sm z-20 rounded-3xl flex flex-col p-10 gap-5'>
                        <h3 className='text-white text-7xl'>Enjoy exclusive discounts on your first purchase!</h3>
                        <span className='px-5 py-3 flex items-center ml-auto text-white text-xl gap-3'>
                            Register now
                            <span className='text-2xl rounded-full ease-out duration-200'>
                                <RiArrowRightLine/>
                            </span>
                        </span>
                        <div className='h-full w-full relative flex items-center justify-center perspective-distant transform-3d'>
                            <span className='h-52 aspect-square rounded-2xl flex flex-col p-2 bg-blue/10 backdrop-blur-md -rotate-z-10 rotate-y-40 -ml-5 absolute left-0 top-full -translate-y-full'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt='discount'
                                    src='/icons/5-off.png'
                                    className='w-full h-full object-cover object-center'
                                />
                            </span>
                            <span className='h-52 aspect-square rounded-2xl flex flex-col p-2 bg-blue/10 backdrop-blur-md -ml-10 -rotate-z-10 rotate-y-20 absolute top-1/5 left-1/3 -translate-x-1/3 -translate-y-1/5'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt='discount'
                                    src='/icons/15-off.png'
                                    className='w-full h-full object-cover object-center'
                                />
                            </span>
                            <span className='h-52 aspect-square rounded-2xl flex flex-col p-2 bg-blue/10 backdrop-blur-md  rotate-z-10 -rotate-y-20 top-1/5 ml-10 absolute left-2/3 -translate-x-2/3 -translate-y-1/5'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt='discount'
                                    src='/icons/20-off.png'
                                    className='w-full h-full object-cover object-center'
                                />
                            </span>
                            <span className='h-52 aspect-square rounded-2xl flex flex-col p-2 bg-blue/10 backdrop-blur-md rotate-z-10 -rotate-y-40 absolute ml-5 left-full top-full -translate-full'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt='discount'
                                    src='/icons/10-off.png'
                                    className='w-full h-full object-cover object-center'
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-4/5 w-2/5 flex items-center'>
                <div className='w-2/3 h-full rounded-2xl bg-light-blue/20 backdrop-blur-sm border-4 border-black/20 flex flex-col gap-5 items-center p-10'>
                    <input 
                        type="email" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Email Address'
                    />
                    <input 
                        type="text" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Full Name'
                    />
                    <input 
                        type="text" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Contact Number'
                    />
                    <input 
                        type="text" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Address'
                    />
                    <input 
                        type="password" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Password'
                    />
                    <input 
                        type="password" 
                        className='w-full py-3 rounded-lg border-2 border-light-blue/50 px-5 text-white/50 hover:border-light-blue hover:text-white ease-out duration-200'
                        placeholder='Confirm Password'
                    />
                    <button type="button" className='w-3/4 py-3 rounded-lg bg-blue text-white font-bold hover:bg-dark-blue focus:bg-violet ease-out duration-200'>Create Account</button>
                    <span className='text-white mt-auto'>or sign up using</span>
                    <button type="button" className='w-max px-10 py-3 rounded-lg bg-white flex items-center gap-3 border-2 border-transparent hover:border-light-blue focus:border-blue ease-out duration-200'><FcGoogle className='text-2xl'/></button>
                </div>
            </div>
        </div>
        <div className='w-full h-max flex flex-col relative overflow-hidden justify-center p-10 py-20 gap-20 z-50'>
            <span className='w-full h-full absolute top-1/2 left-1/2 -translate-1/2 opacity-50 brightness-125 blur-lg'>
                <Image
                    height={4096}
                    width={4096}
                    alt='background image'
                    src='/images/app-bg.png'
                    className='h-full w-full bg-contain bg-center backdrop-blur-2xl'
                />
            </span>
            <h2 className='text-light-blue text-5xl z-20'>Crafting Your Personalized OnTap Product</h2>
            <div className='w-full flex flex-col text-white items-center justify-center z-20 gap-3'>
                <div className='w-full flex items-center justify-center relative'>
                    <div className='absolute w-3/5 flex items-center justify-around z-1'>
                        <span className='w-1/4 h-1 rounded-full overflow-hidden flex items-center'>
                            <motion.span 
                            animate={{width: ['0%', '100%']}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                delay: 0,
                                repeat: Infinity,
                                repeatType: 'loop',
                                repeatDelay: 6
                            }}
                            className='h-full w-3 rounded-full bg-blue'></motion.span>
                        </span>
                        <span className='w-1/4 h-1 rounded-full overflow-hidden flex items-center'>
                            <motion.span 
                            animate={{width: ['0%', '100%']}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                delay: 3,
                                repeat: Infinity,
                                repeatType: 'loop',
                                repeatDelay: 3
                            }}
                            className='h-full w-3 rounded-full bg-blue'></motion.span>
                        </span>
                        <span className='w-1/4 h-1 rounded-full overflow-hidden flex items-center'>
                            <motion.span 
                            animate={{width: ['0%', '100%']}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                delay: 6,
                                repeat: Infinity,
                                repeatType: 'loop',
                                repeatDelay: 0
                            }}
                            className='h-full w-3 rounded-full bg-blue'></motion.span>
                        </span>
                    </div>
                    <span className='w-1/5 flex items-center justify-center z-10'>
                        <motion.span 
                        animate={{rotateZ: [0,360]}}
                        transition={{
                            duration: 3,
                            ease: 'linear',
                            repeat: Infinity,
                            repeatType: 'loop'
                        }}
                        className='h-16 aspect-square p-1.5 border-2 border-light-blue border-dashed rounded-full'
                        >
                            <motion.span 
                            animate={{rotateZ: [0, -360]}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='h-12 aspect-square rounded-full bg-blue flex items-center justify-center text-2xl font-extrabold -rotate-z-45'><PiHandPointingBold /></motion.span>
                        </motion.span>
                    </span>
                    <span className='w-1/5 flex items-center justify-center z-10'>
                        <motion.span 
                        animate={{rotateZ: [0,360]}}
                        transition={{
                            duration: 3,
                            ease: 'linear',
                            repeat: Infinity,
                            repeatType: 'loop'
                        }}
                        className='h-16 aspect-square p-1.5 border-2 border-light-blue border-dashed rounded-full'
                        >
                            <motion.span 
                            animate={{rotateZ: [0, -360]}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='h-12 aspect-square rounded-full bg-blue flex items-center justify-center text-2xl font-extrabold -rotate-z-45'><PiShoppingCartBold /></motion.span>
                        </motion.span>
                    </span>
                    <span className='w-1/5 flex items-center justify-center z-10'>
                        <motion.span 
                        animate={{rotateZ: [0,360]}}
                        transition={{
                            duration: 3,
                            ease: 'linear',
                            repeat: Infinity,
                            repeatType: 'loop'
                        }}
                        className='h-16 aspect-square p-1.5 border-2 border-light-blue border-dashed rounded-full'
                        >
                            <motion.span 
                            animate={{rotateZ: [0, -360]}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='h-12 aspect-square rounded-full bg-blue flex items-center justify-center text-2xl font-extrabold -rotate-z-45'><PiPenBold /></motion.span>
                        </motion.span>
                    </span>
                    <span className='w-1/5 flex items-center justify-center z-10'>
                        <motion.span 
                        animate={{rotateZ: [0,360]}}
                        transition={{
                            duration: 3,
                            ease: 'linear',
                            repeat: Infinity,
                            repeatType: 'loop'
                        }}
                        className='h-16 aspect-square p-1.5 border-2 border-light-blue border-dashed rounded-full'
                        >
                            <motion.span 
                            animate={{rotateZ: [0, -360]}}
                            transition={{
                                duration: 3,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='h-12 aspect-square rounded-full bg-blue flex items-center justify-center text-2xl font-extrabold -rotate-z-45'><PiPlugsConnectedBold /></motion.span>
                        </motion.span>
                    </span>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <span className='w-1/5 flex items-center justify-center'>
                        <p className='text-xl font-bold'>Choose your item and design</p>
                    </span>
                    <span className='w-1/5 flex items-center justify-center'>
                        <p className='text-xl font-bold'>Purchase selected items</p>
                    </span>
                    <span className='w-1/5 flex items-center justify-center'>
                        <p className='text-xl font-bold'>Set Up your Profile</p>
                    </span>
                    <span className='w-1/5 flex items-center justify-center'>
                        <p className='text-xl font-bold'>Connect Instantly</p>
                    </span>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <div className='h-full w-1/5 p-3 flex relative'>
                        <div className='w-full h-full p-3 flex flex-col bg-white shadow-md shadow-black/20 gap-3'>
                            <span className='w-full h-max py-5 flex flex-col items-center justify-center'>
                                <Image
                                    height={4096}
                                    width={4096}
                                    alt='card image'
                                    src='/images/card-2/front.png'
                                    className='w-2/3 aspect-[3/2] rounded-xl overflow-hidden object-cover'
                                />
                                <h3 className='text-left w-full px-3 mt-5 text-black'><strong>Carbon Fiber Digital Business Card</strong></h3>
                                <p className='px-3 text-sm text-black'>
                                    Upgrade your networking with the Carbon Fiber Digital Business Card — where luxury design meets smart technology.
                                </p>
                            </span>
                            <span className='w-full flex items-center gap-3'>
                                <motion.button 
                                    animate={{
                                        background: [
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(44, 69, 148, 1)', 
                                            'rgba(0, 0, 0, 0)',  
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(0, 0, 0, 0)'
                                        ],
                                        color: [
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(255, 255, 255, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                        ],
                                        border: [
                                            '2px solid rgba(81, 153, 211, 1)',
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                        ]
                                    }}
                                    transition={{
                                        duration: 5,
                                        ease: 'easeInOut',
                                        repeat: Infinity,
                                        repeatType: 'loop'
                                    }}
                                    type="button" 
                                    className='w-1/2 flex items-center gap-2 p-3 font-bold rounded-md'
                                ><PiMoneyWavyBold className='text-xl'/>Buy Now</motion.button>
                                <motion.button 
                                    animate={{
                                        background: [
                                            'rgba(0, 0, 0, 0)', 
                                            'rgba(44, 69, 148, 1)',
                                            'rgba(0, 0, 0, 0)',
                                            'rgba(44, 69, 148, 1)', 
                                            'rgba(44, 69, 148, 1)',  
                                            'rgba(90, 92, 168, 1)', 
                                            'rgba(44, 69, 148, 1)', 
                                            'rgba(0, 0, 0, 0)'
                                        ],
                                        color: [
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(255, 255, 255, 1)',
                                            'rgba(81, 153, 211, 1)', 
                                            'rgba(255, 255, 255, 1)', 
                                            'rgba(255, 255, 255, 1)', 
                                            'rgba(255, 255, 255, 1)', 
                                            'rgba(255, 255, 255, 1)', 
                                            'rgba(81, 153, 211, 1)', 
                                        ],
                                        border: [
                                            '2px solid rgba(81, 153, 211, 1)',
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(255, 255, 255, 1)', 
                                            '2px solid rgba(81, 153, 211, 1)', 
                                        ]
                                    }}
                                    transition={{
                                        duration: 5,
                                        ease: 'easeInOut',
                                        repeat: Infinity,
                                        repeatType: 'loop'
                                    }}
                                    type="button" 
                                    className='w-1/2 flex items-center gap-2 p-3 border-2 border-blue text-blue rounded-md'
                                ><PiShoppingCartSimpleBold className='text-xl'/>Add to Cart</motion.button>
                            </span>
                            <motion.div 
                            animate={{ 
                                x: [0, 40, -65, 100, 100, 100, 100, 0],
                                y: [0, 150, 150, 165, 165, 165, 165, 0],
                                scale: [1, 1, 1, 1, 0.7, 1.3, 1, 1]
                            }}
                            transition={{
                                duration: 5,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='absolute top-1/2 left-1/2 -translate-1/2 text-3xl text-footer-bg'
                            >
                                <FaArrowPointer />
                            </motion.div>
                        </div>
                        
                    </div>

                    <div className='h-full w-1/5 flex flex-col p-3 relative'>
                        <div className='h-full w-full bg-white flex flex-col p-3'>
                            <div className='h-max w-full flex flex-col gap-1'>
                                <motion.div 
                                    animate={{
                                        scale: [0.9, 1, 1.1, 1, 1, 1, 1],
                                        opacity: [0.7, 0.9, 1, 1, 1, 1, 1],
                                        filter: ['blur(3px)', 'blur(1px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        ease: 'easeInOut',
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                        repeatDelay: 6
                                    }}
                                    className='w-full h-12 bg-light-blue flex gap-2 p-1'
                                >
                                    <span className='h-full aspect-square bg-blue'></span>
                                    <span className='w-full h-full flex flex-col'>
                                        <strong className='text-dark-blue'>Polyvinyl Business Card</strong>
                                        <span className='w-full flex items-center justify-between'>
                                            <strong className='text-xs text-blue font-bold'>x 12</strong>
                                            <strong className='text-sm text-dark-blue font-extrabold'>
                                                ₱ 799
                                            </strong>
                                        </span>
                                    </span>
                                </motion.div>
                                <motion.div 
                                animate={{
                                        scale: [0.9, 1, 1.1, 1, 1, 1, 1],
                                        opacity: [0.7, 0.9, 1, 1, 1, 1, 1],
                                        filter: ['blur(3px)', 'blur(1px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        ease: 'easeInOut',
                                        delay: 0.5,
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                        repeatDelay: 6
                                    }}
                                className='w-full h-12 bg-light-blue flex gap-2 p-1'>
                                    <span className='h-full aspect-square bg-blue'></span>
                                    <span className='w-full h-full flex flex-col'>
                                        <strong className='text-dark-blue'>Polyvinyl Business Card</strong>
                                        <span className='w-full flex items-center justify-between'>
                                            <strong className='text-xs text-blue font-bold'>x 12</strong>
                                            <strong className='text-sm text-dark-blue font-extrabold'>
                                                ₱ 799
                                            </strong>
                                        </span>
                                    </span>
                                </motion.div>
                                <motion.div 
                                animate={{
                                        scale: [0.9, 1, 1.1, 1, 1, 1, 1],
                                        opacity: [0.7, 0.9, 1, 1, 1, 1, 1],
                                        filter: ['blur(3px)', 'blur(1px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        ease: 'easeInOut',
                                        delay: 1,
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                        repeatDelay: 6
                                    }}
                                className='w-full h-12 bg-light-blue flex gap-2 p-1'>
                                    <span className='h-full aspect-square bg-blue'></span>
                                    <span className='w-full h-full flex flex-col'>
                                        <strong className='text-dark-blue'>Polyvinyl Business Card</strong>
                                        <span className='w-full flex items-center justify-between'>
                                            <strong className='text-xs text-blue font-bold'>x 12</strong>
                                            <strong className='text-sm text-dark-blue font-extrabold'>
                                                ₱ 799
                                            </strong>
                                        </span>
                                    </span>
                                </motion.div>
                            </div>
                            <div className='w-full flex flex-col text-dark-blue p-3'>
                                <span className='w-full flex items-center justify-between'>
                                    <span>Subtotal</span>
                                    <strong className='font-extrabold'>₱ 28,764.00</strong>
                                </span>
                                <span className='w-full flex items-center justify-between'>
                                    <span>Discount (10%)</span>
                                    <strong className='font-extrabold'>₱ 2,876.40</strong>
                                </span>
                                <span className='w-full flex items-center justify-between font-extrabold'>
                                    <span>Total</span>
                                    <strong className='font-extrabold'>₱ 25,887.60</strong>
                                </span>
                            </div>
                            <motion.div 
                            animate={{
                                scale: [1, 1, 0.98, 1, 1],
                                background: [
                                    'rgba(0, 0, 0, 0)', 
                                    'rgba(44, 69, 148, 1)',
                                    'rgba(90, 92, 168, 1)', 
                                    'rgba(44, 69, 148, 1)', 
                                    'rgba(0, 0, 0, 0)'
                                ],
                                color: [
                                    'rgba(81, 153, 211, 1)', 
                                    'rgba(255, 255, 255, 1)',
                                    'rgba(255, 255, 255, 1)',
                                    'rgba(255, 255, 255, 1)',
                                    'rgba(81, 153, 211, 1)', 
                                ],
                                border: [
                                    '2px solid rgba(81, 153, 211, 1)',
                                    '2px solid rgba(255, 255, 255, 1)', 
                                    '2px solid rgba(255, 255, 255, 1)', 
                                    '2px solid rgba(255, 255, 255, 1)', 
                                    '2px solid rgba(81, 153, 211, 1)', 
                                ]
                            }}
                            transition={{
                                duration: 3,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='py-3 mt-12 w-full rounded-lg font-bold flex items-center justify-center'>
                                Checkout (3)
                            </motion.div>
                        </div>
                        <motion.div 
                            animate={{ 
                                x: [0, 50, 50, 50, 50],
                                y: [0, 175, 175, 175, 175],
                                scale: [1, 0.8, 1.3, 1, 1]
                            }}
                            transition={{
                                duration: 5,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'loop'
                            }}
                            className='absolute top-1/2 left-1/2 -translate-1/2 text-3xl text-footer-bg'
                            >
                                <FaArrowPointer />
                            </motion.div>
                    </div>

                    <div className='h-full w-1/5 flex flex-col p-3'>
                        <div className='h-full w-full flex items-center justify-center'>
                            <div className='h-full w-full bg-white flex flex-col items-center gap-3'>
                                <span className='h-28 w-full bg-dark-blue'>

                                </span>
                                
                                <span className='h-16 w-16 aspect-square rounded-full bg-black/20 items-center justify-center flex text-4xl mb-4'>
                                    <RiUserSmileLine />
                                </span>
                                <span className='h-10 w-full rounded-md bg-black/20'></span>
                                <span className='h-10 w-full rounded-md bg-black/20'></span>
                                <span className='h-32 w-full rounded-md bg-black/20'></span>
                            </div>
                        </div>
                    </div>

                    <div className='h-full w-1/5 rounded-tl-4xl rounded-xl col-span-1 flex flex-col p-3'>
                        <div className='flex flex-col gap-3 items-center h-max'>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full h-auto flex flex-col items-center p-20 pb-10 z-10 gap-20 bg-white'>
            <h2 className='text-5xl text-dark-blue'>Experience Shared by Our Valued Clients</h2>
            <div className='h-auto w-full flex flex-col items-center overflow-hidden'>
                <div className='h-max w-auto flex flex-nowrap items-center justify-start gap-5 relative
                before:h-full before:w-40 before:absolute before:left-0 before:bg-gradient-to-r before:from-white before:via-70% before:via-white/80 before:to-transparent before:z-10
                after:h-full after:w-40 after:absolute after:right-0 after:bg-gradient-to-l after:from-white after:via-70% after:via-white/80 after:to-transparent after:z-10'>
                    <AnimatePresence mode='wait'>
                        {Array.from({ length: 3 }).map((_,i) => (
                            feed === i && (
                                <div key={i} className='h-max min-w-[100vw] max-w-[100vw] overflow-y-hidden flex items-center justify-center gap-5 py-5 funnel'>
                                    {Array.from({ length: 3 }).map((_,j) => (
                                        <motion.div 
                                            initial={{ translateX: '80%', opacity: 0 }}
                                            animate={{ translateX: '0%', opacity: 1 }}
                                            exit={{ translateX: '-80%', opacity: 0 }}
                                            transition={{
                                                duration: 1,
                                                ease: 'easeInOut',
                                                delay: j/5
                                            }}
                                        key={j} 
                                        className='min-w-120 max-w-120 h-max max-h-80 bg-light-blue text-black p-3 rounded-xl shadow-md shadow-black/20 flex flex-col relative'
                                        >
                                            <span className='flex p-1.5 pl-2 pr-3 rounded-full rounded-br-xl items-center gap-2 text-white bg-dark-blue border-b-2 border-blue absolute top-0 -mt-5 right-0 shadow-md shadow-black/20 font-bold'>
                                                <LuSparkle className='text-xl'/>
                                                Efficient Service
                                            </span>
                                            <span className='h-max w-full relative'>
                                                <FaQuoteLeft className='text-4xl text-blue'/>
                                                <p className='py-3 px-5 font-bold text-justify'>OnTap completely transformed how we handle our digital workflows. Everything feels faster, more intuitive, and incredibly easy to use. It's rare to find tech that delivers both precision and simplicity, but OnTap does it with just a single tap.</p>
                                            </span>
                                            <span className='flex flex-col items-center'>
                                                <span className='p-3 text-2xl rounded-full bg-dark-blue border-2 border-blue text-light-blue'>
                                                    <RiBearSmileLine />
                                                </span>
                                                <span className='flex flex-col justify-center items-center'>
                                                    <strong className='text-dark-blue text-lg'>Client Name</strong>
                                                    <h3 className='text-sm text-blue -mt-1'>This Company</h3>
                                                </span>
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
                <div className='h-max w-auto flex flex-nowrap items-center justify-start gap-5 relative
                before:h-full before:w-40 before:absolute before:left-0 before:bg-gradient-to-r before:from-white before:via-70% before:via-white/80 before:to-transparent before:z-10
                after:h-full after:w-40 after:absolute after:right-0 after:bg-gradient-to-l after:from-white after:via-70% after:via-white/80 after:to-transparent after:z-10'>
                    <AnimatePresence mode='wait'>
                        {Array.from({ length: 3 }).map((_,i) => (
                            feed === i && (
                                <div key={i} className='h-max min-w-[100vw] max-w-[100vw] overflow-y-hidden flex items-center justify-center gap-5 py-5 funnel'>
                                    {Array.from({ length: 3 }).map((_,j) => (
                                        <motion.div 
                                            initial={{ translateX: '-80%', opacity: 0 }}
                                            animate={{ translateX: '0%', opacity: 1 }}
                                            exit={{ translateX: '80%', opacity: 0 }}
                                            transition={{
                                                duration: 1,
                                                ease: 'easeInOut',
                                                delay: (3 - j)/5
                                            }}
                                        key={j} 
                                        className='min-w-120 max-w-120 h-max max-h-80 bg-light-blue text-black p-3 rounded-xl shadow-md shadow-black/20 flex flex-col relative'
                                        >
                                            <span className='flex p-1.5 pl-2 pr-3 rounded-full rounded-br-xl items-center gap-2 text-white bg-dark-blue border-b-2 border-blue absolute top-0 -mt-5 right-0 shadow-md shadow-black/20 font-bold'>
                                                <LuSparkle className='text-xl'/>
                                                Efficient Service
                                            </span>
                                            <span className='h-max w-full relative'>
                                                <FaQuoteLeft className='text-4xl text-blue'/>
                                                <p className='py-3 px-5 font-bold text-justify'>OnTap completely transformed how we handle our digital workflows. Everything feels faster, more intuitive, and incredibly easy to use. It's rare to find tech that delivers both precision and simplicity, but OnTap does it with just a single tap.</p>
                                            </span>
                                            <span className='flex flex-col items-center'>
                                                <span className='p-3 text-2xl rounded-full bg-dark-blue border-2 border-blue text-light-blue'>
                                                    <RiBearSmileLine />
                                                </span>
                                                <span className='flex flex-col justify-center items-center'>
                                                    <strong className='text-dark-blue text-lg'>Client Name</strong>
                                                    <h3 className='text-sm text-blue -mt-1'>This Company</h3>
                                                </span>
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
                <div className='col-span-full w-full flex items-center justify-center gap-5 py-3'>
                    <span className='flex items-center gap-1.5'>
                        {Array.from({ length: 3 }).map((_,i) => (
                            <span key={i} className={`h-2 aspect-square rounded-full ${feed === i ? 'bg-dark-blue scale-200 mx-1' : 'bg-neutral-300'} delay-100 ease-out duration-200`}></span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
        <div className='w-full h-[100vh] flex flex-col relative overflow-hidden justify-center p-10 py-20 gap-20 z-50'>

        </div>
    </section>
  )
}

export default Funnel