"use client"

import React, { useEffect, useState } from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { RiArrowDownSLine, RiCalendarLine, RiExportFill, RiLoginBoxLine, RiQuestionAnswerLine, RiTimerLine, RiTrafficLightLine } from 'react-icons/ri'
import WebAnalysis from './WebAnalysis'
import UserRetention from './UserRetention'
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

const Cards = [
    {
        icon: <RiLoginBoxLine />,
        title: 'Visits',
        subTitle: 'No. of Visits',
        count: 100
    },
    {
        icon: <RiTimerLine />,
        title: 'Session',
        subTitle: 'Average Duration',
        count: '32.5s'
    },
    {
        icon: <RiQuestionAnswerLine />,
        title: 'Orders',
        subTitle: 'No. of Orders',
        count: 39
    },
    {
        icon: <RiTrafficLightLine />,
        title: 'Network Traffic',
        subTitle: 'Average Page Load',
        count: '5.19s'
    },
];

const Regions = [
  {
    region: "National Capital Region",
    abbr: "NCR",
    latitude: 14.5736,
    longitude: 121.03297,
    count: 113
  },
  {
    region: "Cordillera Administrative Region",
    abbr: "CAR",
    latitude: 17.35125,
    longitude: 121.17189,
    count: 26
  },
  {
    region: "Ilocos Region",
    abbr: "Region I",
    latitude: 16.08321,
    longitude: 120.61999,
    count: 13
  },
  {
    region: "Cagayan Valley",
    abbr: "Region II",
    latitude: 17.5751,
    longitude: 121.7269,
    count: 76
  },
  {
    region: "Central Luzon",
    abbr: "Region III",
    latitude: 15.48277,
    longitude: 120.71200,
    count: 120
  },
  {
    region: "CALABARZON",
    abbr: "Region IV-A",
    latitude: 14.10078,
    longitude: 121.07937,
    count: 17
  },
  {
    region: "MIMAROPA",
    abbr: "Region IV-B",
    latitude: 9.84321,
    longitude: 118.73648,
    count: 60
  },
  {
    region: "Bicol Region",
    abbr: "Region V",
    latitude: 13.42099,
    longitude: 123.41370,
    count: 44
  },
  {
    region: "Western Visayas",
    abbr: "Region VI",
    latitude: 11.00498,
    longitude: 122.53727,
    count: 16
  },
  {
    region: "Central Visayas",
    abbr: "Region VII",
    latitude: 9.81688,
    longitude: 124.06414,
    count: 11
  },
  {
    region: "Eastern Visayas",
    abbr: "Region VIII",
    latitude: 12.24455,
    longitude: 125.03882,
    count: 65
  },
  {
    region: "Zamboanga Peninsula",
    abbr: "Region IX",
    latitude: 8.15408,
    longitude: 123.25879,
    count: 2
  },
  {
    region: "Northern Mindanao",
    abbr: "Region X",
    latitude: 8.02016,
    longitude: 124.68565,
    count: 23
  },
  {
    region: "Davao Region",
    abbr: "Region XI",
    latitude: 7.30416,
    longitude: 126.08934,
    count: 8
  },
  {
    region: "SOCCSKSARGEN",
    abbr: "Region XII",
    latitude: 6.27066,
    longitude: 124.68565,
    count: 0
  },
  {
    region: "Caraga",
    abbr: "Region XIII",
    latitude: 8.80146,
    longitude: 125.74069,
    count: 0
  },
  {
    region: "Bangsamoro Autonomous Region in Muslim Mindanao",
    abbr: "BARMM",
    latitude: 6.95700,
    longitude: 124.24216,
    count: 12
  }
]


const Dashboard = () => {
  const [filter, setFilter] = useState(false);
  const [currFilter, setCurrFilter] = useState('Today');
  const [lat, setLat] = useState(12.8797);
  const [long, setLong] = useState(121.7740);
  const [zoom, setZoom] = useState(4.5);
  const [showMap, setShowMap] = useState(true);

  const changeLoc = (newLat: number, newLong: number, newZoom: number) => {
    setLat(newLat); 
    setLong(newLong); 
    setZoom(newZoom);
  }

  useEffect(() => {
    setShowMap(false);
    const timeout = setTimeout(() => {
      setShowMap(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [lat, long, zoom]); 

  return (
    <div className='w-full h-full max-h-[100vh] bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col md:overflow-hidden'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold pl-8'>Dashboard</h1>
            <div className='flex gap-3 text-sm md:text-base'>
                <div className='relative'>
                    <button type='button' className='p-2 px-4 pr-2.5 flex items-center gap-2 rounded-lg border border-neutral-400 hover:border-dark-blue hover:text-dark-blue focus:border-violet focus:text-violet ease-out duration-200' onClick={() => setFilter(!filter)}>
                        <RiCalendarLine />
                        <span>{currFilter}</span>
                        <RiArrowDownSLine className={`${!filter && 'rotate-90'}`}/>
                    </button>
                    {filter && (
                        <div className='flex flex-col absolute rounded-lg border border-neutral-400 w-full z-50 bg-neutral-200 mt-2 overflow-hidden'>
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
        <div className='w-full h-auto lg:h-full grid grid-cols-6 gap-3 lg:overflow-hidden'>
            <div className='col-span-full lg:col-span-4 flex flex-col gap-5 lg:overflow-hidden'>
                <div className='w-full flex gap-3 items-center flex-nowrap'>
                    {Cards.map((card, i) => (
                        <div key={`dashboard-card_${i}`} className='rounded-md px-3 py-2 shadow-md shadow-neutral-200 bg-white items-stretch h-full md:h-auto w-full flex flex-col'>
                            <div className='flex gap-2 items-center'>
                                <span className='text-xl text-violet'>{card.icon}</span>
                                <h2 className='font-semibold text-sm'>{card.title}</h2>
                            </div>
                            <p className='mt-3 text-neutral-500 text-xs md:text-sm'>{card.subTitle}</p>
                            <p className='md:text-xl font-semibold ml-auto lg:text-base lg:font-extrabold mt-auto md:mt-0'>{card.count}</p>
                        </div>
                    ))}
                </div>
                <div className='w-full min-h-100 lg:min-h-90 flex flex-col md:flex-row gap-3'>
                    <div className='w-full h-[45vh] md:w-2/3 md:h-full flex flex-col rounded-lg bg-white shadow-md shadow-neutral-200'>
                        <div className='flex w-full items-center justify-between p-5 py-4 pr-3'>
                            <h3 className='font-semibold text-sm'>Website Analytics</h3>
                            <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                        </div>
                        <div className='h-full w-full'>
                            <WebAnalysis />
                        </div>
                    </div>
                    <div className='md:h-full w-full pb-3 md:pb-0 md:w-1/3 flex flex-col items-end md:items-start rounded-lg bg-white shadow-md shadow-neutral-200 relative'>
                        <div className='col-span-full flex w-full items-center justify-between p-5 py-4 pr-3 md:absolute z-10 top-0'>
                            <h3 className='font-semibold text-sm'>User Retention</h3>
                            <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                        </div>
                        <div className='col-span-2 h-full md:h-1/2 w-80 md:w-full ml-5 md:ml-0 absolute -left-10 md:relative md:-left-0'>
                            <UserRetention accessedIn='dashboard'/>
                        </div>
                        <div className='col-span-3 h-max md:h-1/2 w-max md:w-full grid grid-cols-2 md:flex md:flex-col px-3 md:py-0 gap-1 text-sm md:mt-5 lg:mt-1'>
                            <span className='col-span-1 -mt w-full px-3 md:px-5 py-2 rounded-sm border border-violet flex flex-col md:flex-row items-center justify-between lg:px-3'>Placed Orders <strong className='ml-auto'>200</strong></span>
                            <span className='col-span-1 px-3 md:px-5 py-2 rounded-sm border border-dark-blue flex flex-col md:flex-row items-center justify-between lg:px-3'>Repeated Visits <strong className='ml-auto'>300</strong></span>
                            <span className='col-span-1 px-3 md:px-5 py-2 rounded-sm border border-blue flex flex-col md:flex-row items-center justify-between lg:px-3'>Finished Viewing <strong className='-mt-3 md:mt-0 ml-auto'>300</strong></span>
                            <span className='col-span-1 px-3 md:px-5 py-2 rounded-sm border border-footer-bg flex flex-col md:flex-row items-center justify-between lg:px-3'>&lt; Average Duration <strong className='ml-auto'>400</strong></span>
                        </div>
                    </div>
                </div>
                <div className='w-full md:h-full flex flex-col rounded-lg bg-white shadow-md shadow-neutral-200 overflow-hidden'>
                    <div className='flex w-full items-center justify-between p-5 pt-4 pb-0 pr-3'>
                        <h3 className='font-semibold text-sm'>Real-Time Activity</h3>
                        <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                    </div>
                    <div className='h-fit md:h-full w-full flex flex-col overflow-hidden px-2'>
                        <div className='h-10 w-full pr-1 grid grid-cols-6 border-b  border-neutral-300 overflow-hidden font-bold text-sm md:text-base lg:text-sm 2xl:text-base'>
                            <span className='col-span-1 py-2 text-center'>Visitor ID</span>
                            <span className='col-span-1 py-2 text-center'>Time Started</span>
                            <span className='col-span-1 py-2 text-center'>Session</span>
                            <span className='col-span-1 py-2 text-left'>Status</span>
                            <span className='col-span-2 py-2 text-center'>Location</span>
                        </div>
                        <div className='h-full max-h-[30vh] md:max-h-auto w-full flex flex-col overflow-x-hidden text-sm md:text-base lg:text-sm 2xl:text-base'>
                            {Array.from({ length: 10 }).map((_,i) => (
                                <button key={i} type='button' className='w-full py-3 pr-0 grid grid-cols-6 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'>
                                    <span className='col-span-1 font-bold'>CA35067</span>
                                    <span className='col-span-1'>10:09:30</span>
                                    <span className='col-span-1'>00:12:25</span>
                                    <span className='col-span-1 text-left overflow-hidden overflow-ellipsis text-nowrap'>Added to Cart</span>
                                    <span className='col-span-2 text-center'>Metro Manila</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-full max-h-full lg:col-span-2 gap-3 flex flex-col lg:overflow-hidden pb-10 md:pb-0'>
                <div className='w-full h-[50vh] md:h-3/5 rounded-lg bg-white shadow-md shadow-neutral-200 lg:overflow-hidden'>
                    {false && showMap && (
                        <WorldMap 
                            lat={lat}
                            long={long}
                            zoom={zoom}
                        />
                    )}
                </div>
                <div className='w-full md:h-2/5 rounded-lg bg-white shadow-md shadow-neutral-200 lg:overflow-x-hidden'>
                    <div className='flex w-full items-center justify-between p-5 pt-4 pb-3 pr-3'>
                        <h3 className='font-semibold text-sm'>Visitor's Area Locations</h3>
                        <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200'><HiDotsHorizontal /></button>
                    </div>
                    <div className='w-full h-auto grid grid-cols-3 overflow-x-hidden px-5'>
                        {Regions.map((val,i) => (
                            <button 
                                key={i} 
                                type='button' 
                                className='px-3 lg:px-1 py-2 flex items-center justify-between text-black hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                onClick={() => changeLoc(val.latitude, val.longitude, 7)}
                            >
                                <span className='lg:text-sm 2xl:text-base'>{val.abbr}</span>
                                <span className='font-semibold'>{val.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard