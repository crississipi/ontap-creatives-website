"use client";

import React, { useState } from 'react';
import { RiExportFill, RiSearchLine } from 'react-icons/ri';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';

type SortKey =
  | "refid"
  | "name"
  | "email"
  | "contact"
  | "orders"
  | "amount"
  | "dateOrdered";

type SortState = {
  [key in SortKey]: boolean;
};

interface VisitorProps {
    changePage: (newPage: number) => void;
}

const SearchFilters = [""];

const VisitorsPage = ({ changePage }: VisitorProps) => {
    const [sort, sortItems] = useState<SortState>({
        name: false,
        company: false,
        email: false,
        contact: false,
        dateVisited: false,
        sessionTime: false,
        activity: false,
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
            cols: 3,
            title: 'Reference ID',
            tag: 'refid',
            sortName: sort.refid
        },
        {
            cols: 3,
            title: 'Client Name',
            tag: 'name',
            sortName: sort.name
        },
        {
            cols: 4,
            title: 'Email Address',
            tag: 'email',
            sortName: sort.email
        },
        {
            cols: 2,
            title: 'Contact Number',
            tag: 'contact',
            sortName: sort.contact
        },
        {
            cols: 2,
            title: 'Orders',
            tag: 'orders',
            sortName: sort.orders
        },
        {
            cols: 1,
            title: 'Amount',
            tag: 'amount',
            sortName: sort.amount
        },
        {
            cols: 1,
            title: 'Date Ordered',
            tag: 'dateOrdered',
            sortName: sort.dateOrdered
        },
    ]

  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col relative'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Orders</h1>
            <div className='flex gap-3 text-sm md:text-base'>
                <div className='flex gap-2 px-3 border border-violet items-center rounded-md w-60 md:w-80 text-violet'>
                    <RiSearchLine className='text-xl'/>
                    <input type="text" placeholder='Search...' className='outline-none w-full h-full text-black placeholder:text-violet'/>
                </div>
                <div>
                    <button type="button"></button>
                </div>
                <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill />Export</button>
            </div>
        </div>
        <div className='w-full h-full flex px-3 mt-10 md:overflow-hidden'>
            <div className='h-fit md:h-full w-full bg-violet rounded-xl shadow-md shadow-neutral-200 overflow-auto md:overflow-hidden'>
                <div className='w-max md:w-full grid grid-cols-19 py-1 pr-1 border-b border-neutral-600 bg-violet text-white'>
                    {TableHeaders.map((val, i) => (
                        <span key={i} className={`py-1 px-3 pr-1 col-span-${val.cols} text-sm font-bold ${(i < TableHeaders.length - 1) && 'border-r border-neutral-400'} flex items-center justify-between`}>
                            {val.title}
                            <button 
                                type="button" 
                                className='p-0.5 aspect-square rounded-md border border-transparent flex items-center justify-center text-lg hover:border-light-blue focus:bg-light-blue focus:text-violet ease-out duration-200'
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
                </div>
                <div className='w-max md:w-full max-h-[100vh] md:h-full bg-white flex md:overflow-x-hidden'>
                    <div className='w-full h-auto flex flex-col'>
                        {Array.from({ length: 30 }).map((_,i) => (
                            <div key={i} className='min-h-12 w-full grid grid-cols-19 items-center'>
                                <button 
                                    type="button" 
                                    className='col-span-19 grid grid-cols-19 text-xs md:text-base hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                    onDoubleClick={() => changePage(4)}
                                >
                                    <span className='h-12 col-span-3 text-nowrap px-3 flex items-center border-r border-neutral-200'>Juan Dela Cruz</span>
                                    <span className='h-12 col-span-3 text-nowrap px-3 flex items-center border-r border-neutral-200'>Panday</span>
                                    <span 
                                        className='h-12 col-span-4 text-nowrap px-3 flex items-center border-r border-neutral-200' 
                                    >jdelacruz@gmail.com</span>
                                    <span
                                        className='h-12 col-span-2 text-nowrap px-3 flex items-center border-r border-neutral-200' 
                                    >+63 918 346 5678</span>
                                    <span className='h-12 col-span-2 text-nowrap px-3 flex items-center border-r border-neutral-200'>19.09.25 08:10:30</span>
                                    <span className='h-12 col-span-1 text-nowrap px-3 flex items-center justify-center border-r border-neutral-200'>00:03:14</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VisitorsPage