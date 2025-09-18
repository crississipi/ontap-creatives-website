"use client"

import React, { useState } from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { RiArrowDownSLine, RiCalendarLine, RiExportFill, RiLoginBoxLine, RiQuestionAnswerLine, RiTimerLine, RiTrafficLightLine } from 'react-icons/ri'

const Cards = [
    {
        icon: <RiLoginBoxLine />,
        title: 'Visits',
        subTitle: 'No. of Visits',
        count: 100
    },
    {
        icon: <RiTimerLine />,
        title: 'Duration',
        subTitle: 'Average Duration',
        count: '32.5s'
    },
    {
        icon: <RiQuestionAnswerLine />,
        title: 'Inquiry',
        subTitle: 'No. of Inquiries',
        count: 39
    },
    {
        icon: <RiTrafficLightLine />,
        title: 'Network Traffic',
        subTitle: 'Average Page Load',
        count: '5.19s'
    },
  ]

const Dashboard = () => {
  const [filter, setFilter] = useState(false);
  const [currFilter, setCurrFilter] = useState('Today');

  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Dashboard</h1>
            <div className='flex gap-3'>
                <div className='relative'>
                    <button type='button' className='p-2 px-4 pr-2.5 flex items-center gap-2 rounded-lg border border-neutral-400 hover:border-dark-blue hover:text-dark-blue focus:border-violet focus:text-violet ease-out duration-200' onClick={() => setFilter(!filter)}>
                        <RiCalendarLine />
                        <span>{currFilter}</span>
                        <RiArrowDownSLine className={`${!filter && 'rotate-90'}`}/>
                    </button>
                    {filter && (
                        <div className='flex flex-col absolute rounded-lg border border-neutral-400 w-full mt-2 overflow-hidden'>
                            <button 
                                type="button" 
                                className='py-2 hover:bg-light-blue focus:bg-blue focus:text-white ease-out duration-200'
                                onClick={() => 
                                    {setFilter(false); 
                                    setCurrFilter('Yesterday');
                                }}
                            >Yesterday</button>
                            <button 
                                type="button" 
                                className='py-2 hover:bg-light-blue focus:bg-blue focus:text-white ease-out duration-200'
                                onClick={() => 
                                    {setFilter(false); 
                                    setCurrFilter('Last 7 days');
                                }}
                            >Last 7 days</button>
                            <button 
                                type="button" 
                                className='py-2 hover:bg-light-blue focus:bg-blue focus:text-white ease-out duration-200'
                                onClick={() => 
                                    {setFilter(false); 
                                    setCurrFilter('Last 30 days');
                                }}
                            >Last 30 days</button>
                        </div>
                    )}
                </div>
                <button type="button" className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-2 hover:bg-violet focus:bg-dark-blue ease-out duration-200'><RiExportFill />Export</button>
            </div>
        </div>
        <div className='w-full h-full grid grid-cols-6 gap-3'>
            <div className='col-span-4 flex flex-col gap-5'>
                <div className='w-full flex gap-3 items-center flex-nowrap'>
                    {Cards.map((card, i) => (
                        <div key={`dashboard-card_${i}`} className='rounded-md px-3 py-2 shadow-md shadow-neutral-200 bg-white items-stretch w-full flex flex-col'>
                            <div className='flex gap-2 items-center'>
                                <span className='text-xl text-violet'>{card.icon}</span>
                                <h2 className='font-semibold text-sm'>{card.title}</h2>
                            </div>
                            <p className='mt-3 text-neutral-500 text-sm'>{card.subTitle}</p>
                            <p className='text-xl font-semibold ml-auto'>{card.count}</p>
                        </div>
                    ))}
                </div>
                <div className='w-full min-h-120 rounded-lg bg-white shadow-md shadow-neutral-200'>
                    <div className='flex w-full items-center justify-between p-5 py-4 pr-3'>
                        <h3 className='font-semibold text-sm'>Website Analytics</h3>
                        <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                    </div>
                </div>
                <div className='w-full h-full flex flex-col rounded-lg bg-white shadow-md shadow-neutral-200'>
                    <div className='flex w-full items-center justify-between p-5 py-4 pr-3'>
                        <h3 className='font-semibold text-sm'>Real-Time Activity</h3>
                        <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                    </div>
                </div>
            </div>
            <div className='col-span-2 gap-3 flex flex-col'>
                <div className='w-full h-68 rounded-lg bg-white shadow-md shadow-neutral-200'>

                </div>
                <div className='w-full aspect-square rounded-lg bg-white shadow-md shadow-neutral-200'></div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard