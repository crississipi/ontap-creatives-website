"use client"
import React, { useEffect, useRef, useState } from 'react'
import { RiArrowRightLine, RiHeartFill, RiHeartLine, RiShoppingCart2Line, RiStarFill, RiStarHalfFill } from 'react-icons/ri'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { TbCurrencyPeso } from 'react-icons/tb'
import { HiMiniLink, HiOutlineMinusSmall, HiOutlinePlusSmall } from 'react-icons/hi2'
import { useClickOutside, useScrollLock } from '@/hooks'
import { EditProps, ProductCardProps, ProductProps } from '@/types'

type ShowMoreInfoProps = ProductCardProps & EditProps & ProductProps

const ShowMoreInfo = ({ productName, productDesc, frontImg, backImg, variableBackImg, variableFrontImg, price, ratings, sold, setInquireItem, inquire, imgUrl }: ShowMoreInfoProps ) => {
  const [quantity, setQty] = useState(1);
  const [review, setReview] = useState('Latest');
  const [showMode, setShowMode] = useState(false);
  const [like, setLike] = useState(false);
  const [variable, setVariable] = useState<'white' | 'black'>('white')
  const [priceOption, setPriceOption] = useState<'ontap' | 'custom'>('ontap');
  
  useScrollLock(inquire);

  // Detect outside click
  const clickRef = useClickOutside<HTMLDivElement>(() => setInquireItem(false), inquire);

  return (
    <div className='h-full w-full fixed top-0 left-0 bg-white/15 backdrop-blur-sm z-100 flex items-center justify-center'>
        <div ref={clickRef} className='h-2/3 w-2/3 bg-white shadow-md rounded-2xl grid grid-cols-10 gap-1 p-5'>
            <div className='col-span-3 h-full w-full flex flex-col gap-2 [perspective:1000px] '>
                <div className="w-full h-2/3 flex flex-col items-center rounded-lg justify-center relative perspective-[800px] overflow-hidden">
                    {imgUrl !== '' ? 
                        <Image
                            height={500}
                            width={500}
                            alt='product image'
                            src={imgUrl!}
                            className='w-3/5 object-cover object-center'
                        /> :
                        <AnimatePresence>
                            <>
                            <motion.div
                            animate={{
                                rotateY: [0, 360],
                                y: [0, -30, 0],
                                scale: [1, 1.15, 1],
                                rotateZ: [-55, -55, -55],
                            }}
                            transition={{
                                duration: 10,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatType: 'loop',
                            }}
                            className="w-3/4 aspect-[3/2] rounded-xl z-30 relative"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            >
                            <div
                                className="absolute inset-0"
                                style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(0deg)',
                                }}
                            >
                                <Image
                                src={
                                    variableFrontImg && variableBackImg
                                    ? variable === 'white'
                                        ? frontImg
                                        : variableFrontImg
                                    : frontImg
                                }
                                alt="Front"
                                fill
                                className="object-cover rounded-xl shadow-lg"
                                draggable={false}
                                />
                            </div>
                            <div
                                className="absolute inset-0"
                                style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                }}
                            >
                                <Image
                                src={
                                    variableFrontImg && variableBackImg
                                    ? variable === 'white'
                                        ? backImg
                                        : variableBackImg
                                    : backImg
                                }
                                alt="Back"
                                fill
                                className="object-cover rounded-xl shadow-lg"
                                draggable={false}
                                />
                            </div>
                            </motion.div>

                            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                                <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-300 via-white to-white z-0" />

                                <motion.div
                                animate={{
                                    scaleX: [1, 0.9, 1],
                                    opacity: [0.2, 0.35, 0.2],
                                }}
                                transition={{
                                    duration: 10,
                                    ease: 'linear',
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                }}
                                className="absolute top-1/4 h-1/2 w-[90%] bg-black/20 blur-2xl z-10 rounded-xl"
                                style={{
                                    transform: 'rotateX(75deg)',
                                    transformOrigin: 'top',
                                }}
                                />
                                <motion.div
                                animate={{
                                    y: [0, -5, 0],
                                    scale: [1, 0.95, 1],
                                    opacity: [0.2, 0.35, 0.2],
                                }}
                                transition={{
                                    duration: 10,
                                    ease: 'linear',
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                }}
                                className="absolute bottom-10 w-1/2 h-24 bg-black/50 blur-2xl rounded-full z-10"
                                />
                            </div>
                            </>
                        </AnimatePresence>
                    }
                </div>
                <div className='h-1/3 w-full rounded-lg border border-neutral-300'>
                    <span className='w-full py-2 px-3 flex items-center gap-1 text-amber-500 text-xl border-b border-neutral-300'>
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarHalfFill />
                        <p className='font-bold text-base text-black ml-auto'>{ratings}</p>
                    </span>
                    <div className='w-full flex flex-col p-3 gap-2'>
                        <div className='w-full grid grid-cols-10 items-center gap-3 text-sm font-extrabold'>
                            <p className='col-span-1'>5</p>
                            <div className='col-span-8 w-full h-3 flex items-center rounded-full bg-neutral-300 overflow-hidden'>
                                <span className='w-9/10 h-full rounded-full bg-amber-500'></span>
                            </div>
                            <p className='col-span-1'>178</p>
                        </div>
                        <div className='w-full grid grid-cols-10 items-center gap-3 text-sm font-extrabold'>
                            <p className='col-span-1'>4</p>
                            <div className='col-span-8 w-full h-3 flex items-center rounded-full bg-neutral-300 overflow-hidden'>
                                <span className='w-5 h-full rounded-full bg-amber-500'></span>
                            </div>
                            <p className='col-span-1'>5</p>
                        </div>
                        <div className='w-full grid grid-cols-10 items-center gap-3 text-sm font-extrabold'>
                            <p className='col-span-1'>3</p>
                            <div className='col-span-8 w-full h-3 flex items-center rounded-full bg-neutral-300 overflow-hidden'>
                                <span className='w-2 h-full rounded-full bg-amber-500'></span>
                            </div>
                            <p className='col-span-1'>2</p>
                        </div>
                        <div className='w-full grid grid-cols-10 items-center gap-3 text-sm font-extrabold'>
                            <p className='col-span-1'>2</p>
                            <div className='col-span-8 w-full h-3 flex items-center rounded-full bg-neutral-300 overflow-hidden'>
                            </div>
                            <p className='col-span-1'>0</p>
                        </div>
                        <div className='w-full grid grid-cols-10 items-center gap-3 text-sm font-extrabold'>
                            <p className='col-span-1'>1</p>
                            <div className='col-span-8 w-full h-3 flex items-center rounded-full bg-neutral-300 overflow-hidden'>
                            </div>
                            <p className='col-span-1'>0</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-7 h-full grid grid-cols-5 p-5 pb-0 pr-0 gap-y-5 overflow-x-hidden overflow-y-scroll items-start'>
                <h1 className='col-span-full text-4xl font-extrabold text-black'>{productName}</h1>
                <span className='col-span-full leading-5'>{productDesc}</span>
                <div className='col-span-2 w-full h-full flex flex-col justify-start'>
                    <div className='mb-3 text-sm flex gap-20'>
                        <span><strong className='font-extrabold'>{sold}</strong> sold</span>
                        <span className='flex items-center gap-1'><RiStarFill className='text-amber-500'/><strong className='font-extrabold'>{ratings}</strong> (199 reviews)</span>
                    </div>
                    <span className='font-extrabold flex items-center mb-5'>
                       {price.ontap === 0 ? (
                        <p className='text-2xl'>Upon Inquiry</p>
                       ) : (
                        <>
                            <TbCurrencyPeso className='text-2xl'/>
                            <p className='text-4xl'>{(priceOption === 'ontap' ? price.ontap * quantity : price.custom! * quantity).toLocaleString()}</p>
                        </>
                       )}
                    </span>
                    {(variableBackImg && variableFrontImg) && (
                        <>
                            <h2 className='font-semibold'>Variations</h2>
                            <div className='flex gap-1 mt-1 mb-3'>
                                <button 
                                    type="button" 
                                    className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-sm border border-neutral-200 group ${variable === 'white' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                    onClick={() => setVariable('white')}
                                >
                                    White
                                </button>
                                <button 
                                    type="button" 
                                    className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-sm border border-neutral-200 group ${variable === 'black' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                    onClick={() => setVariable('black')}
                                >
                                    Black
                                </button>
                            </div>
                        </>
                    )}
                    {imgUrl === '' && (
                        <>
                            <h2 className='font-semibold'>Logo Style</h2>
                            <div className='flex gap-1 mt-1 mb-3'>
                                <button 
                                    type="button" 
                                    className={`max-w-28 flex flex-col gap-1 p-2 text-sm px-3 border border-neutral-200 group ${priceOption === 'ontap' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                    onClick={() => setPriceOption('ontap')}  
                                >OnTap</button>
                                <button 
                                    type="button" 
                                    className={`max-w-28 flex flex-col text-sm gap-1 p-2 px-3 border border-neutral-200 group  ${priceOption === 'custom' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                    onClick={() => setPriceOption('custom')}  
                                >Custom</button>
                            </div>
                        </>
                    )}
                    {priceOption === 'custom' && (
                        <button type="button" className='h-8 w-8 mb-3 rounded-sm bg-neutral-200 flex items-center justify-center relative group hover:text-white hover:bg-blue focus:bg-violet ease-out duration-200'>
                            <HiMiniLink className='text-xl'/>
                            <span className='hidden absolute left-full ml-2 group-hover:block bg-white text-black w-max'>Please attach your custom logo here.</span>
                        </button>
                    )}
                    <h2 className='font-semibold mb-1'>Quantity</h2>
                    <div className='w-full flex items-center'>
                        <button 
                        type='button' 
                        className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                        onClick={() => setQty((prev) => prev > 1 ? prev - 1 : 1)}
                        ><HiOutlineMinusSmall /></button>
                        <input type="text" inputMode="numeric" className='w-10 text-center font-bold' value={quantity} onChange={(e) => {
                            const intValue = parseInt(e.target.value, 10);
                            setQty(isNaN(intValue) ? 1 : intValue);
                        }}/>
                        <button 
                            type='button' 
                            className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                            onClick={() => setQty((prev) => prev + 1)}
                        ><HiOutlinePlusSmall /></button>
                    </div>
                    <div className='mt-auto flex gap-3'>
                        <button type="button" className='px-5 py-3 rounded-md border  border-neutral-300 text-black text-xl hover:bg-neutral-300 focus:text-white focus:bg-blue ease-out duration-200'><RiShoppingCart2Line /></button>
                        <button type="button" className='pl-5 pr-3 py-3 rounded-md flex items-center gap-3 bg-dark-blue font-bold text-white hover:bg-violet focus:bg-footer-bg ease-out duration-200'>Buy now<RiArrowRightLine className='text-xl'/></button>
                    </div>
                </div>
                <div className='col-span-3 w-full h-full rounded-lg flex flex-col p-3 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden'>
                    <div className='w-full flex items-center justify-between'>
                        <p className='text-sm font-extrabold pl-2'>Feedbacks</p>
                        <div className='relative'>
                            <button 
                            type="button" 
                            className='px-4 py-1.5 text-sm font-semibold rounded-sm border hover:bg-blue focus:bg-violet hover:text-white ease-out duration-200'
                            onClick={() => setShowMode(!showMode)}
                            >
                                {review}
                            </button>
                            {showMode && (
                                <span className='absolute flex flex-col rounded-md border w-max right-0 mt-1 overflow-hidden text-sm bg-white'>
                                    <button 
                                        type="button" 
                                        className='py-1.5 px-4 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                        onClick={() => {setReview('Latest'); setShowMode(false);}}
                                    >Latest</button>
                                    <button 
                                        type="button" 
                                        className='py-1.5 px-4 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                        onClick={() => {setReview('Most Popular'); setShowMode(false);}}
                                    >Most Popular</button>
                                    <button 
                                        type="button" 
                                        className='py-1.5 px-4 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                        onClick={() => {setReview('Oldest'); setShowMode(false);}}
                                    >Oldest</button>
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='h-full w-full flex flex-col gap-3 mt-3 overflow-x-hidden'>
                        {Array.from({ length: 5 }).map((_,i) => (
                            <div key={i} className='flex flex-col w-full px-2 border-b border-neutral-200'>
                                <div className='w-full flex items-center gap-3'>
                                    <span className='h-10 w-10 rounded-full bg-neutral-400'></span>
                                    <span className='font-semibold'>
                                        <h3>Juan Dela Cruz</h3>
                                        <p className='text-sm text-neutral-500'>Company Name</p>
                                    </span>
                                    <div className='flex flex-col items-end ml-auto'>
                                        <span className='flex items-center gap-1 text-amber-500'>
                                            <RiStarFill />
                                            <RiStarFill />
                                            <RiStarFill />
                                            <RiStarFill />
                                            <RiStarHalfFill />
                                        </span>
                                        <span className='font-semibold text-neutral-500 text-sm'>09.16.25</span>
                                    </div>
                                </div>
                                
                                <p className='text-sm my-2'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                                <div>
                                    <button type="button" className='text-2xl' onClick={() => setLike(!like)}>
                                        {like ? <RiHeartFill /> : <RiHeartLine />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowMoreInfo