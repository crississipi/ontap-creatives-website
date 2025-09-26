"use client"

import React, { useState, DragEvent, useRef } from 'react'
import { RiArrowDownSLine, RiCheckboxCircleLine, RiImageAddLine } from 'react-icons/ri';
import Image from 'next/image';

const ProductPage = () => {
  const [prodType, setProdtype] = useState('Card');
  const [opt, showOpt] = useState(false);

  const [fileSelected, setFileSelected] = useState(false);
  const [fileSelected1, setFileSelected1] = useState(false);
  const [fileSelected2, setFileSelected2] = useState(false);

  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
    preview: string;
  } | null>(null);
  const [fileInfo1, setFileInfo1] = useState<{
    name: string;
    size: number;
    type: string;
    preview: string;
  } | null>(null);
  const [fileInfo2, setFileInfo2] = useState<{
    name: string;
    size: number;
    type: string;
    preview: string;
  } | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>, card: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file, card);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, card: number) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file, card);
      }
    };
  
    const processFile = (file: File, card: number) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          card === 0 ? (
            <>
                {setFileSelected1(true)}
                {setFileInfo1({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result as string,
                })}
            </>
          ) : card === 1 ? (
            <>
                {setFileSelected2(true)}
                {setFileInfo2({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result as string,
                })}
            </>
          ) : (
            <>
                {setFileSelected(true)}
                {setFileInfo({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result as string,
                })}
            </>
          )
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
    <div className="w-full h-full grid grid-cols-5 gap-3">
        <div className="col-span-2 h-full rounded-md shadow-md shadow-neutral-200 p-5 bg-white overflow-hidden flex flex-col gap-5">
            <div className='flex items-start justify-between'>
                <h3 className="font-semibold text-sm">Add New Product</h3>
                <div className='relative'>
                    <button type="button" className='py-2 px-4 pr-2 rounded-md flex items-center gap-1 border border-neutral-400 hover:border-dark-blue hover:text-dark-blue focus:border-violet focus:text-violet ease-out duration-200' onClick={() => showOpt(!opt)}>{prodType}<RiArrowDownSLine className={`${!opt && 'rotate-90'} text-xl`}/></button>
                    {opt && <span className='absolute rounded-md top-full mt-1 bg-white shadow-md right-0 flex flex-col z-50'>
                        <button 
                            type="button" 
                            className='text-nowrap text-left px-3 py-2' 
                            onClick={() => { 
                                setProdtype('Card'); 
                                showOpt(false); 
                                setFileSelected(false); 
                            }}
                        >Card</button>
                        <button 
                            type="button" 
                            className='text-nowrap text-left px-3 py-2' 
                            onClick={() => { 
                                setProdtype('Other Products'); 
                                showOpt(false); 
                                setFileSelected1(false); 
                                setFileSelected2(false); 
                            }}
                        >Other Products</button>
                    </span>}
                </div>
            </div>
            <div className='h-full w-full flex flex-col gap-5 overflow-hidden'>
                <div className='w-full grid grid-cols-2 gap-3 overflow-hidden'>
                    {prodType === 'Card' ? (
                        <>
                            <div 
                                className={`h-60 col-span-1 rounded-md bg-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center relative ${!fileSelected1 && 'before:h-full before:w-full before:absolute before:bg-white/30'}`} 
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, 0)}
                            >
                                <h4 className='w-full text-left pl-5 text-sm font-semibold absolute top-3 z-20'>Front Card</h4>
                                <span className='aspect-[3/2] w-4/5 rounded-lg border-2 border-dashed border-neutral-500 overflow-hidden'>
                                    {!fileSelected1 ? (
                                        <Image
                                            height={500}
                                            width={500}
                                            alt='card sample template'
                                            src='/images/card-2/front.png'
                                            className='w-full h-full object-cover object-center opacity-70'
                                            draggable={false}
                                        />
                                    ) : (
                                        fileInfo1?.preview && (
                                            <Image
                                                height={500}
                                                width={500}
                                                src={fileInfo1.preview}
                                                alt={fileInfo1.name}
                                                className="object-contain object-center w-full h-full"
                                            />
                                        )
                                    )}
                                </span>
                            </div>
                            <div 
                                className={`h-60 col-span-1 rounded-md bg-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center relative ${!fileSelected2 && 'before:h-full before:w-full before:absolute before:bg-white/30'}`} 
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, 1)}
                            >
                                <h4 className='w-full text-left pl-5 text-sm font-semibold absolute top-3 z-20'>Back Card</h4>
                                <span className='aspect-[3/2] w-4/5 rounded-lg border-2 border-dashed border-neutral-500 overflow-hidden'>
                                    {!fileSelected2 ? 
                                        <Image
                                            height={500}
                                            width={500}
                                            alt='card sample template'
                                            src='/images/card-2/back.png'
                                            className='w-full h-full object-cover object-center opacity-70'
                                            draggable={false}
                                        /> : 
                                        fileInfo2?.preview && (
                                            <Image
                                                height={500}
                                                width={500}
                                                src={fileInfo2.preview}
                                                alt={fileInfo2.name}
                                                className="object-contain object-center w-full h-full"
                                            />
                                        )
                                    }
                                </span>
                            </div>
                            <span className='col-span-full'>*Note: it is recommended to attach image like the example above to achieve the animation effect.</span>
                        </>
                    ) : (
                        <div
                            className="col-span-full min-h-80 max-h-80 rounded-sm w-2/3 bg-white mx-auto shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex justify-center items-center"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 2)}
                        >
                            {!fileSelected ? (
                                <div className="w-60 aspect-square border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center group transition-all z">
                                    <RiImageAddLine className="text-7xl text-neutral-300" />
                                    <p className="w-3/4 text-center">
                                        You can drag your media here or{" "}
                                        <button
                                            type="button"
                                            onClick={openFilePicker}
                                            className="text-blue hover:underline hover:font-semibold focus:text-violet ease-out duration-200"
                                        >
                                            click here
                                        </button>{" "}
                                        to select your files.
                                    </p>
                                </div>
                            ) : (
                            fileInfo?.preview && (
                                <Image
                                    height={500}
                                    width={500}
                                    src={fileInfo.preview}
                                    alt={fileInfo.name}
                                    className="object-contain object-center w-full h-full"
                                />
                            )
                            )}
                        </div>
                    )}
                </div>
                <div className='w-full h-auto flex flex-col gap-5'>
                    <span className="col-span-full flex flex-col">
                        <label htmlFor="promo-name" className="text-sm font-medium">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="promo-name"
                            className="rounded-md border border-neutral-400 py-3 px-5 text-black hover:border-blue focus:border-violet focus:text-violet focus:font-semibold ease-out duration-200"
                        />
                    </span>
                    <span className="col-span-full h-full flex flex-col">
                        <label htmlFor="promo-desc" className="text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            name="promo-desc"
                            className="min-h-60 max-h-80 resize-none rounded-md border border-neutral-400 py-3 px-5 text-black hover:border-blue focus:border-violet focus:text-violet focus:font-semibold ease-out duration-200"
                        />
                    </span>
                    <div className="w-full flex items-center justify-end gap-3 mt-auto">
                        <button
                            type="button"
                            className="flex items-center gap-3 rounded-lg border border-neutral-300 text-neutral-400 px-4 py-2 hover:border-black hover:text-black focus:bg-footer-bg focus:text-white ease-out duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-3 rounded-lg bg-blue text-white px-4 pl-2 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200"
                        >
                            <RiCheckboxCircleLine className="text-2xl" />
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-span-3 h-full rounded-md p-5 pt-0 overflow-hidden flex flex-col gap-3">
            <h3 className="font-semibold text-base">Product List</h3>
            <div className='w-full grid grid-cols-3 gap-1 gap-y-18 overflow-x-hidden h-max'>
                {Array.from({length: 10}).map((_, i) => (
                    <button key={i} type="button" className="col-span-1 w-full aspect-[3/2] px-1 flex flex-col items-center justify-center group relative overflow-y-hidden">
                        <span className='w-full rounded-lg overflow-hidden'>
                            <Image
                                height={500}
                                width={500}
                                alt='product image'
                                src='/images/card-2/front.png'
                                className='h-full w-full object-center object-contain'
                                draggable={false}
                            />
                        </span>
                        <span className='w-full h-2/3 left-0 bg-gradient-to-t from-neutral-200 via-neutral-200 to-transparent absolute top-full group-hover:top-1/3 ease-out duration-200 flex items-end p-3 px-4 font-semibold rounded-b-xl'>Product Name</span>
                    </button>
                ))}
            </div>
        </div>
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef1}
            onChange={(e) => handleFileChange(e, 0)}
            className="hidden"
        />
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef2}
            onChange={(e) => handleFileChange(e, 1)}
            className="hidden"
        />
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, 2)}
            className="hidden"
        />
        {/** to be continued, may problema sa isang drag and drop */}
    </div>
  )
}

export default ProductPage