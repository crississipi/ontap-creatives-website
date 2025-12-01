"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { RiExportFill, RiPhoneLine, RiSearchLine } from 'react-icons/ri';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';

type SortKey =
  | "name"
  | "age"
  | "sex"
  | "location"
  | "contact"
  | "email";

type SortState = {
  [key in SortKey]: boolean;
};

interface VisitorProps {
    changePage: (newPage: number) => void;
}

const SearchFilters = [""];

const AffiliatesPage = ({ changePage }: VisitorProps) => {
  const [sort, sortItems] = useState<SortState>({
          name: false,
          age: false,
          email: false,
          contact: false,
          location: false,
          sex: false,
      });
      const [initial, setInitial] = useState(true);
      const setSort = (tag: SortKey, value: boolean) => {
          setInitial(false);
          sortItems((prev) => {
              const newSort: SortState = Object.keys(prev).reduce((acc, key) => {
              acc[key as SortKey] = false;
              return acc;
              }, {} as SortState);
  
              newSort[tag] = !value;
              return newSort;
          });
      };
  
      const TableHeaders = [
          {
              cols: 'col-span-2 lg:col-span-4',
              title: 'Full Name',
              tag: 'name',
              sortName: sort.name
          },
          {
              cols: 'hidden xl:block xl:col-span-1',
              title: 'Age',
              tag: 'company',
              sortName: sort.age
          },
          {
              cols: 'hidden xl:block xl:col-span-1',
              title: 'Sex',
              tag: 'email',
              sortName: sort.sex
          },
          {
              cols: 'hidden lg:block col-span-3',
              title: 'Contact Number',
              tag: 'contact',
              sortName: sort.contact
          },
          {
              cols: 'hidden lg:block col-span-5 xl:col-span-4',
              title: 'Email Address',
              tag: 'email',
              sortName: sort.email
          },
          {
              cols: 'col-span-2 md:col-span-3 lg:col-span-6 xl:col-span-5',
              title: 'Location',
              tag: 'location',
              sortName: sort.location
          },      
      ]
  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col relative md:pl-10 2xl:pl-5'>
            <div className='w-full flex items-center justify-between lg:pr-5'>
                <h1 className='text-2xl font-semibold'>Affiliates</h1>
                <div className='flex gap-3'>
                    <div className='flex gap-2 px-3 border border-violet items-center rounded-md w-80 text-violet'>
                        <RiSearchLine className='text-xl'/>
                        <input type="text" placeholder='Search...' className='outline-none w-full h-full text-black placeholder:text-violet'/>
                    </div>
                    <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill />Export</button>
                </div>
            </div>
            <div className='w-full h-full flex px-3 md:pr-0 xl:pr-3 mt-10 overflow-hidden'>
                <div className='h-full w-full bg-violet rounded-xl shadow-md shadow-neutral-200 overflow-hidden'>
                    <div className='w-full grid grid-cols-5 md:grid-cols-6 lg:grid-cols-19 py-1 pr-1 border-b border-neutral-600 bg-violet text-white'>
                        {TableHeaders.map((val, i) => (
                            <span key={i} className={`py-1 px-3 pr-1 ${val.cols} text-sm font-bold ${(i < TableHeaders.length - 1) && 'border-r border-neutral-400'} flex items-center justify-between flex-nowrap relative`}>
                                {val.title}
                                <button 
                                    type="button" 
                                    className='2xl:p-0.5 aspect-square absolute right-0 rounded-md border border-transparent text-lg hover:border-light-blue focus:bg-light-blue focus:text-violet ease-out duration-200'
                                    onClick={() => setSort(val.tag as SortKey, val.sortName)}
                                >
                                    {initial ? 
                                    <TiArrowUnsorted /> : 
                                    (val.sortName ? 
                                        (<TiArrowSortedUp />) : 
                                        (<TiArrowSortedDown />))
                                    }
                                </button>
                            </span>
                        ))}
                        <span className={`py-1 px-3 pr-1 col-span-1 w-full flex items-center justify-between text-sm`}>
                            Actions
                        </span>
                    </div>
                    <div className='w-full h-full bg-white flex overflow-x-hidden'>
                        <div className='w-full h-auto flex flex-col'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default AffiliatesPage