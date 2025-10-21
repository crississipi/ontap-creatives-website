"use client"
import React, { useRef, useState } from 'react'
import { RiArrowRightLine, RiHeartFill, RiHeartLine, RiQuestionFill, RiShoppingCart2Line, RiStarFill, RiStarHalfFill } from 'react-icons/ri'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { TbCurrencyPeso } from 'react-icons/tb'
import { HiMiniLink, HiOutlineMinusSmall, HiOutlinePlusSmall } from 'react-icons/hi2'
import { useClickOutside, useScrollLock } from '@/hooks'
import { EditProps, ProductCardProps, ProductProps } from '@/types'
import { HiOutlineX } from 'react-icons/hi'
import AccountSignIn from './AccountSignIn'

interface ShowMoreInfoProps {
  // Accept either individual props OR a product object
  product?: ProductProps;
  // Individual props (for backward compatibility)
  productName?: string;
  productDesc?: React.ReactNode;
  frontImg?: string;
  backImg?: string;
  variableBackImg?: string;
  variableFrontImg?: string;
  price?: { ontap: number; custom?: number };
  ratings?: number;
  sold?: number;
  setInquireItem?: (inquire: boolean) => void;
  inquire?: boolean;
  imgUrl?: string;
  editable?: boolean;
}

const ShowMoreInfo = ({ 
  product,
  // Individual props (fallbacks)
  productName,
  productDesc,
  frontImg,
  backImg,
  variableBackImg,
  variableFrontImg,
  price,
  setInquireItem,
  inquire,
  imgUrl,
}: ShowMoreInfoProps) => {
  const [quantity, setQty] = useState(1);
  const [review, setReview] = useState('Latest');
  const [showMode, setShowMode] = useState(false);
  const [like, setLike] = useState(false);
  const [variable, setVariable] = useState<'white' | 'black'>('white')
  const [priceOption, setPriceOption] = useState<'ontap' | 'custom'>('ontap');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInfo, setFileInfo] = useState< {name: string; preview: string} | null>(null);
  const [logoSize, setLogoSize] = useState<'scale-100' | 'scale-125' | 'scale-150'>('scale-100');
  const [animationState, setAnimationState] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  useScrollLock(inquire!);
console.log(product)
  // Use product object if provided, otherwise use individual props
  const finalProductName = product?.name || productName || '';
  const finalProductDesc = product?.description ? <p>{product.description}</p> : productDesc;
  const finalFrontImg = product?.frontUrl || frontImg || '';
  const finalBackImg = product?.backUrl || backImg || '';
  const finalVariableFrontImg = product?.variableFrontImg || variableFrontImg || '';
  const finalVariableBackImg = product?.variableBackImg || variableBackImg || '';
  const finalImgUrl = product?.imgUrl || imgUrl || '';
  
  // Handle price - if product has customPrice, use it, otherwise use the individual price prop
  const finalPrice = product ? {
    ontap: product.price,
    custom: product.customPrice || product.price
  } : price || { ontap: 0 };

  // Detect outside click
  const clickRef = useClickOutside<HTMLDivElement>(() => setInquireItem?.(false), inquire);
  const cartOptions = useClickOutside<HTMLDivElement>(() => setShowCustomize(false), showCustomize);

  const CustomImg: Record<string, string[]> = {
    'Polyvinyl Business Card' : ['/images/card-1/custom.png', ''],
    'Carbon Fiber Digital Business Card' : ['/images/card-2/custom.png', ''],
    'Bamboo Digital Business Card' : ['/images/card-3/custom.png', ''],
    'Elite Digital Business Card' : ['/images/card-4/custom-front.png', '/images/card-4/custom-back.png']
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          processFile(file);
        }
      };
    
      const processFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFileInfo({
                name: file.name,
                preview: reader.result as string,
            })
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select a valid image file.");
        }
      };

  const openFilePicker = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className='h-full w-full fixed top-16 md:top-0 left-0 bg-white/15 backdrop-blur-sm z-100 flex items-center justify-center'>
        <div ref={!showLogin ? clickRef : null} className='h-full w-full md:h-4/5 lg:h-max md:w-4/5 lg:w-[90%] bg-white shadow-md rounded-2xl grid grid-cols-1 lg:grid-cols-10 lg:gap-1 lg:p-5 relative overflow-x-hidden lg:overflow-auto'>
            <div className='flex items-center gap-2 group transition-all duration-200 absolute top-5 left-5 z-50 bg-white/30 backdrop-blur-md pr-3 rounded-r-full'>
                <span className='rounded-full text-blue text-3xl flex items-center justify-center hover:ring-2 hover:ring-blue ease-out duration-200'><RiQuestionFill /></span>
                <div className='hidden group-hover:flex items-center gap-1'>
                    <span>Animate Card</span>
                    <button 
                        type="button" 
                        className='w-10 h-5 rounded-full bg-neutral-300 p-0.5 flex items-center group hover:bg-light-blue ease-out duration-200'
                        onClick={() => setAnimationState(!animationState)}
                    >
                        <span className={`h-full aspect-square ${animationState ? 'ml-auto bg-violet' : 'mr-auto bg-neutral-400'} rounded-full  group-focus:bg-violet ease-out duration-200`}></span>
                    </button>
                </div>
            </div>
            <button 
                type="button" 
                className='md:hidden absolute text-2xl z-50 right-5 top-5 hover:text-rose-300 focus:text-rose-500 focus:scale-125 ease-out duration-200' onClick={() => setInquireItem?.(false)}
            ><HiOutlineX /></button>
            <div className='col-span-1 md:col-span-3 h-full w-full flex lg:flex-col gap-2 [perspective:1000px] '>
                <div className="w-full h-[40vh] lg:h-2/3 flex lg:flex-col gap-3 px-3 flex-row items-center rounded-lg justify-center relative perspective-[1000px]">
                    {finalImgUrl !== '' ? 
                        <Image
                            height={500}
                            width={500}
                            alt='product image'
                            src={finalImgUrl}
                            className='w-3/5 object-cover object-center'
                        /> :
                        <AnimatePresence>
                            <>
                            {animationState ? 
                                <motion.div
                                    animate={{
                                        rotateY: [0, 360],
                                        y: [-20, -30, -20],
                                        scale: [1, 1.15, 1],
                                        rotateZ: [-55, -55, -55],
                                    }}
                                    transition={{
                                        duration: 10,
                                        ease: 'linear',
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                    }}
                                    className="w-1/2 md:w-1/3 card-size lg:w-5/6 xl:w-4/5 2xl:w-3/5 aspect-[3/2] rounded-xl z-30 relative mt-10"
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
                                        {priceOption === 'ontap' ? (
                                            <Image
                                                src={
                                                    finalVariableFrontImg && finalVariableBackImg
                                                    ? variable === 'white'
                                                        ? finalFrontImg
                                                        : finalVariableFrontImg
                                                    : finalFrontImg
                                                }
                                                alt="Front"
                                                fill
                                                className="object-cover rounded-xl shadow-lg"
                                                draggable={false}
                                            />
                                        ): (
                                            <div className='h-full w-full relative flex items-center justify-center'>
                                                {variable === 'white' ? (
                                                    <Image
                                                        src={CustomImg[finalProductName][0]}
                                                        alt="Back"
                                                        fill
                                                        className="object-cover rounded-xl shadow-lg absolute inset-0"
                                                        draggable={false}
                                                    />
                                                ) : (
                                                    <div className='w-full h-full rounded-xl bg-[#050505]'></div>
                                                )}
                                                <div className={`${logoSize} h-1/2 absolute inset-0 top-1/2 ${finalProductName === 'Elite Digital Business Card' ? '-left-2/5 -translate-y-1/2' : 'left-1/2 -translate-1/2'} z-20`}>
                                                    <Image
                                                        src={fileInfo?.preview ? fileInfo.preview : '/icons/logo-placeholder.png'}
                                                        alt={fileInfo?.preview ? fileInfo.name : 'logo placeholder'}
                                                        fill
                                                        className="h-full w-full aspect-auto object-contain object-center"
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        {priceOption === 'ontap' || finalProductName !== 'Elite Digital Business Card' ? (
                                            <Image
                                                src={
                                                    finalVariableFrontImg && finalVariableBackImg
                                                    ? variable === 'white'
                                                        ? finalBackImg
                                                        : finalVariableBackImg
                                                    : finalBackImg
                                                }
                                                alt="Back"
                                                fill
                                                className="object-cover rounded-xl shadow-lg"
                                                draggable={false}
                                            />
                                        ) : (
                                        finalProductName === 'Elite Digital Business Card' && (
                                            <div className='h-full w-full relative flex items-center justify-center'>
                                                <Image
                                                    src={CustomImg[finalProductName][1]}
                                                    alt="Back"
                                                    fill
                                                    className="object-cover rounded-xl shadow-lg absolute inset-0"
                                                    draggable={false}
                                                />
                                                <div className={`${logoSize} h-1/2 absolute inset-0 top-1/2 left-2/5 -translate-y-1/2  z-20`}>
                                                    <Image
                                                        src={fileInfo?.preview ? fileInfo.preview : '/icons/logo-placeholder.png'}
                                                        alt={fileInfo?.preview ? fileInfo.name : 'logo placeholder'}
                                                        fill
                                                        className="h-full w-full aspect-auto object-contain object-center"
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                        ) 
                                        )}
                                    </div>
                                </motion.div> : 
                                <>
                                    <div className="w-3/5 aspect-[3/2] md:w-1/3 lg:w-4/5 xl:w-3/4 2xl:w-3/5 rounded-xl z-30 relative">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(0deg)',
                                            }}
                                        >
                                            {priceOption === 'ontap' ? (
                                                <Image
                                                    src={
                                                        finalVariableFrontImg && finalVariableBackImg
                                                        ? variable === 'white'
                                                            ? finalFrontImg
                                                            : finalVariableFrontImg
                                                        : finalFrontImg
                                                    }
                                                    alt="Front"
                                                    fill
                                                    className="object-cover rounded-xl shadow-lg"
                                                    draggable={false}
                                                />
                                            ): (
                                                <div className='h-full w-full relative flex items-center justify-center'>
                                                    {variable === 'white' ? (
                                                        <Image
                                                            src={CustomImg[finalProductName][0]}
                                                            alt="Logo Placeholder"
                                                            fill
                                                            className="object-cover rounded-xl shadow-lg absolute inset-0"
                                                            draggable={false}
                                                        />
                                                    ) : (
                                                        <div className='w-full h-full bg-[#050505] rounded-xl'></div>
                                                    )}
                                                    <div className={`
                                                        ${finalProductName === 'Elite Digital Business Card' ? 
                                                        logoSize === 'scale-125' ? 'scale-110' : logoSize === 'scale-150' && 'scale-120' : 
                                                        logoSize} h-2/5 absolute inset-0 top-1/2 ${finalProductName === 'Elite Digital Business Card' ? '-left-2/5 -translate-y-1/2' : 'left-1/2 -translate-1/2'} z-20`}>
                                                        <Image
                                                            src={fileInfo?.preview ? fileInfo.preview : '/icons/logo-placeholder.png'}
                                                            alt={fileInfo?.preview ? fileInfo.name : 'logo placeholder'}
                                                            fill
                                                            className="h-full w-full aspect-auto object-contain object-center"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-3/5 aspect-[3/2] md:w-1/3 lg:w-4/5 xl:w-3/4 2xl:w-3/5 rounded-xl z-30 relative mt-3">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(0deg)',
                                            }}
                                        >
                                            {priceOption === 'ontap' || finalProductName !== 'Elite Digital Business Card' ? (
                                                <Image
                                                    src={
                                                        finalVariableFrontImg && finalVariableBackImg
                                                        ? variable === 'white'
                                                            ? finalBackImg
                                                            : finalVariableBackImg
                                                        : finalBackImg
                                                    }
                                                    alt="Back"
                                                    fill
                                                    className="object-cover rounded-xl shadow-lg"
                                                    draggable={false}
                                                />
                                            ) : (
                                            finalProductName === 'Elite Digital Business Card' && (
                                                <div className='h-full w-full relative flex items-center justify-center'>
                                                    <Image
                                                        src={CustomImg[finalProductName][1]}
                                                        alt="Back"
                                                        fill
                                                        className="object-cover rounded-xl shadow-lg absolute inset-0"
                                                        draggable={false}
                                                    />
                                                    <div className={`
                                                        ${finalProductName === 'Elite Digital Business Card' ? 
                                                        logoSize === 'scale-125' ? 'scale-110' : logoSize === 'scale-150' && 'scale-120' : 
                                                        logoSize} h-2/5 absolute inset-0 top-1/2 left-2/5 -translate-y-1/2 z-20 opacity-60`}>
                                                        <Image
                                                            src={fileInfo?.preview ? fileInfo.preview : '/icons/logo-placeholder.png'}
                                                            alt={fileInfo?.preview ? fileInfo.name : 'logo placeholder'}
                                                            fill
                                                            className="h-full w-full aspect-auto object-contain object-center"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                </div>
                                            ) 
                                            )}
                                        </div>
                                    </div>
                                </>
                            }

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
                <div className='hidden lg:block h-1/3 w-full rounded-lg border border-neutral-300'>
                    <span className='w-full py-2 px-3 flex items-center gap-1 text-amber-500 text-xl border-b border-neutral-300'>
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarFill />
                        <RiStarHalfFill />
                        {/* <p className='font-bold text-base text-black ml-auto'>{finalRatings}</p> */}
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
            <div className='col-span-7 h-full grid grid-cols-5 p-5 pb-0 pr-0 pl-0 lg:pl-5 lg:pt-3 gap-y-5 lg:overflow-x-hidden items-start'>
                
                <div className='col-span-full lg:col-span-3 w-full h-full flex flex-col justify-start px-5 lg:px-0 relative'>
                    <h1 className='col-span-full text-2xl lg:text-4xl font-extrabold text-black px-5 lg:px-0'>{finalProductName}</h1>
                    <span className='col-span-full leading-5 text-lg px-5 lg:px-0'>{finalProductDesc}</span>
                    <div className='mb-3 text-sm flex gap-20'>
                        {/* <span><strong className='font-extrabold'>{finalSold}</strong> sold</span> */}
                        {/* <span className='flex items-center gap-1'><RiStarFill className='text-amber-500'/><strong className='font-extrabold'>{finalRatings}</strong> (199 reviews)</span> */}
                    </div>
                    <span className='font-extrabold flex items-center mb-5'>
                       {finalPrice.ontap === 0 ? (
                        <p className='text-2xl'>Upon Inquiry</p>
                       ) : (
                        <>
                            <TbCurrencyPeso className='text-2xl'/>
                            <p className='hidden lg:block text-4xl'>{(priceOption === 'ontap' ? finalPrice.ontap * quantity : finalPrice.custom! * quantity).toLocaleString('en-US', { minimumFractionDigits: 2,maximumFractionDigits: 2, })}</p>
                            <p className='lg:hidden text-4xl'>{(priceOption === 'ontap' ? finalPrice.ontap: finalPrice.custom!).toLocaleString('en-US', { minimumFractionDigits: 2,maximumFractionDigits: 2, })}</p>
                        </>
                       )}
                    </span>
                    <div className='md:hidden lg:flex w-full flex-col h-max lg:min-h-3/4 lg:shadow-transparent fixed lg:relative bottom-0 mb-16 md:mb-0 left-0 z-50 transition-all ease-out duration-700'>
                        <div className={`hidden lg:flex w-full bg-neutral-100 md:bg-white flex-col mb-16`}>
                                {(finalVariableBackImg && finalVariableFrontImg) && (
                                    <div className='w-full flex flex-col p-5 pb-0 md:p-0'>
                                        <h2 className='font-semibold'>Variations</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'white' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setVariable('white'); e.preventDefault(); e.stopPropagation();}}
                                            >
                                                White
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'black' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setVariable('black'); e.preventDefault(); e.stopPropagation();}}
                                            >
                                                Black
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {finalImgUrl === '' && (
                                    <div className={`w-full flex flex-col px-5 md:p-0 ${finalProductName !== 'Polyvinyl Business Card' && 'pt-5'}`}>
                                        <h2 className='font-semibold'>Logo Style</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 text-base md:text-sm px-3 border border-neutral-200 group ${priceOption === 'ontap' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setPriceOption('ontap'); e.preventDefault(); e.stopPropagation();}}  
                                            >OnTap</button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col text-base md:text-sm gap-1 p-2 px-3 border border-neutral-200 group  ${priceOption === 'custom' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setPriceOption('custom'); e.preventDefault(); e.stopPropagation();}}  
                                            >Custom</button>
                                        </div>
                                    </div>
                                )}
                                {priceOption === 'custom' && (
                                    <div className='w-full flex flex-col md:flex-row gap-2 md:items-center mb-3 px-5 pt-3 p-0'>
                                        <button 
                                            type="button" 
                                            className='h-14 w-14 md:h-8 md:w-8 rounded-sm bg-neutral-200 flex items-center justify-center relative group hover:text-white hover:bg-blue focus:bg-violet ease-out duration-200'
                                            onClick={openFilePicker}
                                        >
                                            <HiMiniLink className='text-xl'/>
                                            <span className='hidden absolute left-full ml-2 group-hover:block bg-white text-black w-max'>Please attach your custom logo here.</span>
                                        </button>
                                        <div className='flex gap-1 items-center text-sm'>
                                            <span>Image Size: </span>
                                            <span className='flex items-center gap-0.5'>
                                                <button 
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-100' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-100'); e.preventDefault(); e.stopPropagation();}}
                                                >Small</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-125' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-125'); e.preventDefault(); e.stopPropagation();}}
                                                >Normal</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-150' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-150'); e.preventDefault(); e.stopPropagation();}}
                                                >Big</button>
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className='w-full flex items-center justify-between px-5 pb-5 md:p-0'>
                                    <div className='w-full flex flex-col'>
                                        <h2 className='font-semibold mb-1'>Quantity</h2>
                                        <div className='w-full flex items-center'>
                                            <button 
                                            type='button' 
                                            className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                                            onClick={(e) => {setQty((prev) => prev > 1 ? prev - 1 : 1); e.preventDefault(); e.stopPropagation();}}
                                            ><HiOutlineMinusSmall /></button>
                                            <input type="text" inputMode="numeric" className='w-10 text-center font-bold' value={quantity} onChange={(e) => {
                                                const intValue = parseInt(e.target.value, 10);
                                                setQty(isNaN(intValue) ? 1 : intValue);
                                            }}/>
                                            <button 
                                                type='button' 
                                                className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                                                onClick={(e) => {setQty((prev) => prev + 1); e.preventDefault(); e.stopPropagation();}}
                                            ><HiOutlinePlusSmall /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <AnimatePresence mode='wait'>
                            {showCustomize && (
                            <motion.div 
                            initial={{y:999}}
                            animate={{y:0}}
                            exit={{y:999}}
                            transition={{
                                duration: 0.7,
                                ease: 'easeOut'
                            }} 
                            ref={cartOptions} 
                            className={`2xl:hidden w-full bg-neutral-100 md:bg-white flex flex-col shadow-[0px_-3px_14px_#00000099] mb-16`}>
                                {(finalVariableBackImg && finalVariableFrontImg) && (
                                    <div className='w-full flex flex-col p-5 pb-0 md:p-0'>
                                        <h2 className='font-semibold'>Variations</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'white' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setVariable('white'); e.preventDefault(); e.stopPropagation();}}
                                            >
                                                White
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'black' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setVariable('black'); e.preventDefault(); e.stopPropagation();}}
                                            >
                                                Black
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {finalImgUrl === '' && (
                                    <div className={`w-full flex flex-col px-5 md:p-0 ${finalProductName !== 'Polyvinyl Business Card' && 'pt-5'}`}>
                                        <h2 className='font-semibold'>Logo Style</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 text-base md:text-sm px-3 border border-neutral-200 group ${priceOption === 'ontap' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setPriceOption('ontap'); e.preventDefault(); e.stopPropagation();}}  
                                            >OnTap</button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col text-base md:text-sm gap-1 p-2 px-3 border border-neutral-200 group  ${priceOption === 'custom' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={(e) => {setPriceOption('custom'); e.preventDefault(); e.stopPropagation();}}  
                                            >Custom</button>
                                        </div>
                                    </div>
                                )}
                                {priceOption === 'custom' && (
                                    <div className='w-full flex flex-col md:flex-row gap-2 md:items-center mb-3 px-5 pt-3 p-0'>
                                        <button 
                                            type="button" 
                                            className='h-14 w-14 md:h-8 md:w-8 rounded-sm bg-neutral-200 flex items-center justify-center relative group hover:text-white hover:bg-blue focus:bg-violet ease-out duration-200'
                                            onClick={openFilePicker}
                                        >
                                            <HiMiniLink className='text-xl'/>
                                            <span className='hidden absolute left-full ml-2 group-hover:block bg-white text-black w-max'>Please attach your custom logo here.</span>
                                        </button>
                                        <div className='flex gap-1 items-center text-sm'>
                                            <span>Image Size: </span>
                                            <span className='flex items-center gap-0.5'>
                                                <button 
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-100' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-100'); e.preventDefault(); e.stopPropagation();}}
                                                >Small</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-125' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-125'); e.preventDefault(); e.stopPropagation();}}
                                                >Normal</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-150' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={(e) => {setLogoSize('scale-150'); e.preventDefault(); e.stopPropagation();}}
                                                >Big</button>
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className='w-full flex items-center justify-between px-5 pb-5 md:p-0'>
                                    <div className='w-full flex flex-col'>
                                        <h2 className='font-semibold mb-1'>Quantity</h2>
                                        <div className='w-full flex items-center'>
                                            <button 
                                            type='button' 
                                            className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                                            onClick={(e) => {setQty((prev) => prev > 1 ? prev - 1 : 1); e.preventDefault(); e.stopPropagation();}}
                                            ><HiOutlineMinusSmall /></button>
                                            <input type="text" inputMode="numeric" className='w-10 text-center font-bold' value={quantity} onChange={(e) => {
                                                const intValue = parseInt(e.target.value, 10);
                                                setQty(isNaN(intValue) ? 1 : intValue);
                                            }}/>
                                            <button 
                                                type='button' 
                                                className='p-2 rounded-sm bg-neutral-200 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200'
                                                onClick={(e) => {setQty((prev) => prev + 1); e.preventDefault(); e.stopPropagation();}}
                                            ><HiOutlinePlusSmall /></button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-start justify-center leading-5'>
                                        <h2 className='font-extrabold'>Total</h2>
                                        <span className='font-extrabold flex items-center'>
                                        {finalPrice.ontap === 0 ? (
                                            <p className='text-2xl'>Upon Inquiry</p>
                                            ) : (
                                                <>
                                                    <TbCurrencyPeso className='text-xl md:text-2xl'/>
                                                    <p className='text-3xl md:text-4xl'>{(priceOption === 'ontap' ? finalPrice.ontap * quantity : finalPrice.custom! * quantity).toLocaleString('en-US', { minimumFractionDigits: 2,maximumFractionDigits: 2, })}</p>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <div className={`hidden lg:flex justify-end md:justify-start gap-3 w-full pt-3 md:py-0 absolute bottom-0 bg-white p-3 md:p-0 z-30 ${!showCustomize && 'shadow-[0px_-3px_14px_#00000099] lg:shadow-md lg:shadow-transparent'}`}>
                            <button 
                                type="button" 
                                className='px-5 py-3 rounded-md border border-neutral-300 text-black text-xl hover:bg-neutral-300 focus:text-white focus:bg-blue ease-out duration-200'
                                onClick={() => setShowLogin(true)}
                            ><RiShoppingCart2Line /></button>
                            <button 
                                type="button" 
                                className='pl-10 pr-7 md:pl-5 md:pr-3 py-3 rounded-md flex items-center gap-3 bg-dark-blue font-bold text-white hover:bg-violet focus:bg-footer-bg ease-out duration-200'
                                onClick={() => setShowLogin(true)}
                            >Buy now<RiArrowRightLine className='text-xl'/></button>
                        </div>
                    </div>
                </div>
                <div className='col-span-full lg:col-span-2 w-full h-full lg:max-h-140 md:rounded-lg flex flex-col p-3 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden mb-32 md:mb-0'>
                    <div className='w-full flex items-center justify-between'>
                        <p className='md:text-sm font-extrabold pl-2'>Feedbacks</p>
                        <div className='relative'>
                            <button 
                            type="button" 
                            className='px-4 py-1.5 md:text-sm font-semibold rounded-sm border hover:bg-blue focus:bg-violet hover:text-white ease-out duration-200'
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
                    <div className='h-full w-full flex flex-col gap-5 md:gap-3 mt-3 overflow-x-hidden'>
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
            <div className='flex lg:hidden w-full flex-col h-max lg:min-h-3/4 shadow-[0px_-3px_14px_#00000099] lg:shadow-transparent sticky bottom-16 md:bottom-0 bg-neutral-100 md:bg-white ml-0 left-0 z-50'>
                        {showCustomize && (
                            <div ref={cartOptions} className='w-full grid grid-cols-4 mb-24'>
                                {(finalVariableBackImg && finalVariableFrontImg) && (
                                    <div className='w-full flex flex-col p-5'>
                                        <h2 className='font-semibold'>Variations</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'white' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={() => setVariable('white')}
                                            >
                                                White
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 px-3 text-base md:text-sm border border-neutral-200 group ${variable === 'black' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} hover:bg-neutral-100 focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={() => setVariable('black')}
                                            >
                                                Black
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {finalImgUrl === '' && (
                                    <div className='w-full flex flex-col p-5'>
                                        <h2 className='font-semibold'>Logo Style</h2>
                                        <div className='flex gap-1 mt-1 mb-3'>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col gap-1 p-2 text-base md:text-sm px-3 border border-neutral-200 group ${priceOption === 'ontap' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={() => setPriceOption('ontap')}  
                                            >OnTap</button>
                                            <button 
                                                type="button" 
                                                className={`max-w-28 flex flex-col text-base md:text-sm gap-1 p-2 px-3 border border-neutral-200 group  ${priceOption === 'custom' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                onClick={() => setPriceOption('custom')}  
                                            >Custom</button>
                                        </div>
                                    </div>
                                )}
                                {priceOption === 'custom' && (
                                    <div className='col-span-2 w-full flex items-center flex-row gap-2 mb-3 px-5 pt-3 p-0'>
                                        <button 
                                            type="button" 
                                            className='h-14 w-14 rounded-sm bg-neutral-200 flex items-center justify-center relative group hover:text-white hover:bg-blue focus:bg-violet ease-out duration-200'
                                            onClick={openFilePicker}
                                        >
                                            <HiMiniLink className='text-xl'/>
                                            <span className='hidden absolute left-full ml-2 group-hover:block bg-white text-black w-max'>Please attach your custom logo here.</span>
                                        </button>
                                        <div className='flex gap-1 items-center text-sm'>
                                            <span>Image Size: </span>
                                            <span className='flex items-center gap-0.5'>
                                                <button 
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-100' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={() => setLogoSize('scale-100')}
                                                >Small</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-125' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={() => setLogoSize('scale-125')}
                                                >Normal</button>
                                                <button
                                                    type="button" 
                                                    className={`flex flex-col gap-1 p-1 text-sm px-3 border border-neutral-200 group ${logoSize === 'scale-150' ? 'bg-violet text-white' : 'hover:bg-neutral-100'} focus:bg-violet focus:text-white transition-all ease-out duration-200`}
                                                    onClick={() => setLogoSize('scale-150')}
                                                >Big</button>
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className='col-span-full w-full flex items-center justify-between px-5 pb-5'>
                                    <div className='w-full flex flex-col'>
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
                                    </div>
                                    <div className='flex flex-col items-start justify-center leading-5'>
                                        <h2 className='font-extrabold'>Total</h2>
                                        <span className='font-extrabold flex items-center'>
                                        {finalPrice.ontap === 0 ? (
                                            <p className='text-2xl'>Upon Inquiry</p>
                                            ) : (
                                                <>
                                                    <TbCurrencyPeso className='text-xl md:text-2xl'/>
                                                    <p className='text-3xl md:text-4xl'>{(priceOption === 'ontap' ? finalPrice.ontap * quantity : finalPrice.custom! * quantity).toLocaleString('en-US', { minimumFractionDigits: 2,maximumFractionDigits: 2, })}</p>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-3 w-full p-5 md:absolute bottom-0 bg-white'>
                            <button 
                                type="button" 
                                className='px-5 py-3 rounded-md border border-neutral-300 text-black text-xl hover:bg-neutral-300 focus:text-white focus:bg-blue ease-out duration-200'
                                onClick={() => setShowCustomize(true)}
                            ><RiShoppingCart2Line /></button>
                            <button 
                                type="button" 
                                className='pl-10 pr-7 md:pl-5 md:pr-3 py-3 rounded-md flex items-center gap-3 bg-dark-blue font-bold text-white hover:bg-violet focus:bg-footer-bg ease-out duration-200'
                                onClick={() => setShowCustomize(true)}
                            >Buy now<RiArrowRightLine className='text-xl'/></button>
                        </div>
                    </div>
        </div>
        {showLogin && <AccountSignIn setShowLogin={setShowLogin}/>}
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e)}
            className="hidden"
        />
    </div>
  )
}

export default ShowMoreInfo