"use client";

import React, { useState, DragEvent, useRef } from "react";
import {
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiDiscountPercentLine,
  RiImageAddLine,
  RiLayoutLeft2Line,
} from "react-icons/ri";
import Image from "next/image";

const Promos = () => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
    preview: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [addPromo, setAddPromo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFileSelected(false);
    setFileInfo(null);
  };

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
        setFileSelected(true);
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result as string,
        });
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
    <div className="w-full h-full grid grid-cols-5 gap-3 relative">
      {addPromo ? (
        <div className="col-span-3 h-full rounded-md shadow-md shadow-neutral-200 p-5 bg-white overflow-hidden">
            <span className="flex items-start justify-between">
                <h3 className="font-semibold text-sm">Add New Promo</h3>
                <button 
                type="button" 
                className="text-xl p-2 rounded-xs hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200"
                onClick={() => setAddPromo(false)}
                >
                    <RiLayoutLeft2Line />
                </button>
            </span>
            <div className="h-full w-full flex items-center pt-3 pb-10 gap-5 overflow-hidden">
            <div className="w-1/2 h-full grid grid-cols-2 gap-3 py-5 items-center">
                <div className="col-span-full w-full flex flex-col">
                <span className="text-sm font-medium">Media</span>
                {!fileSelected ? (
                    <button
                    type="button"
                    onClick={openFilePicker}
                    className="px-5 py-3 rounded-md flex items-center justify-between h-full w-full border border-neutral-400 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200"
                    >
                    Click to select file
                    <RiImageAddLine className="text-xl" />
                    </button>
                ) : (
                    <div className="w-full flex p-2 pl-4 rounded-md border border-neutral-400 justify-between">
                    <span className="flex flex-col">
                        <h5 className="font-semibold text-sm">{fileInfo?.name}</h5>
                        <p className="text-xs">
                            {fileInfo &&
                            (fileInfo.size > 1024 * 1024
                                ? `${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${(fileInfo.size / 1024).toFixed(2)} KB`)}
                        </p>
                    </span>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="px-2 rounded-md hover:bg-light-blue hover:text-rose-500 focus:bg-violet focus:text-white text-xl ease-out duration-200"
                    >
                        <RiDeleteBinLine />
                    </button>
                    </div>
                )}
                </div>
                <span className="col-span-full flex flex-col">
                  <label htmlFor="promo-name" className="text-sm font-medium">
                      Title
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
                      className="min-h-80 max-h-100 resize-none rounded-md border border-neutral-400 py-3 px-5 text-black hover:border-blue focus:border-violet focus:text-violet focus:font-semibold ease-out duration-200"
                  />
                </span>
                <span className="col-span-1 flex flex-col">
                <label htmlFor="date-start" className="text-sm font-medium">
                    Start Date
                </label>
                <input
                    type="date"
                    name="date-start"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-md border border-neutral-400 py-3 px-5 text-black hover:border-blue focus:border-violet focus:text-violet focus:font-semibold ease-out duration-200"
                />
                </span>
                <span className="col-span-1 flex flex-col">
                <label htmlFor="date-end" className="text-sm font-medium">
                    End Date
                </label>
                <input
                    type="date"
                    name="date-end"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="rounded-md border border-neutral-400 py-3 px-5 text-black hover:border-blue focus:border-violet focus:text-violet focus:font-semibold ease-out duration-200"
                />
                </span>
                <div className="col-span-full flex items-center justify-end gap-3 mt-auto">
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

            <div
                className="rounded-sm h-full w-1/2 bg-white ml-auto shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex flex-col justify-start items-center overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {!fileSelected ? (
                <>
                    <div className="w-3/4 aspect-square border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center mt-16 relative group transition-all">
                      <RiImageAddLine className="text-7xl text-neutral-300" />
                      <p className="w-3/4 text-center">
                          You can drag your media here or{" "}
                          <button
                          type="button"
                          onClick={openFilePicker}
                          className="text-blue hover:underline hover:font-semibold focus:text-violet ease-out duration-200"
                          >
                          {/** add this button a function to open the file manager to manually select media */}
                          click here
                          </button>{" "}
                          to select your files.
                      </p>
                    </div>
                </>
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
          </div>
        </div>
      ) : (
        <button 
        type="button" 
        className="flex items-center gap-2 px-5 py-3 absolute bg-white shadow-md shadow-neutral-200 rounded-md z-30 hover:bg-light-blue focus:bg-violet focus:text-white ease-out duration-200"
        onClick={() => setAddPromo(true)}
        ><RiDiscountPercentLine className="text-xl"/> Add New Promo</button>
      )}
      <div className={`${!addPromo ? 'col-span-full' : 'col-span-2'} h-full flex flex-col gap-3 overflow-x-hidden`}>
        <h3 className="font-semibold text-sm">Existing Promos</h3>
        <div className={`w-full ${addPromo ? 'h-full grid grid-cols-2' : 'h-auto grid grid-cols-5'} gap-3 overflow-x-hidden`}>
            {Array.from({length: 10}).map((_, i) => (
                <button key={i} type="button" className="bg-white col-span-1 h-min rounded-md flex flex-col p-3 gap-3 shadow-md shadow-neutral-200">
                    <span className="rounded-xs w-full aspect-video bg-white ml-auto shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] "></span>
                    <div className="flex flex-col">
                        <h4 className="w-full text-left font-semibold">Promo Name</h4>
                        <span className="flex items-center justify-between text-sm">
                            <p>Date Started: </p>
                            <p className="font-semibold">08.08.25</p>
                        </span>
                        <span className="flex items-center justify-between text-sm">
                            <p>Date Ends: </p>
                            <p className="font-semibold">12.08.25</p>
                        </span>
                    </div>
                </button>
            ))}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Promos;
