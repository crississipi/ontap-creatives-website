"use client"

import React, { JSX, useEffect, useState } from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { RiArrowDownSLine, RiCalendarLine, RiExportFill, RiLoginBoxLine, RiQuestionAnswerLine, RiTimerLine, RiUserCommunityLine } from 'react-icons/ri'
import WebAnalysis from './WebAnalysis'
import dynamic from "next/dynamic";
import { useClickOutside } from '@/hooks'
import { ActivitySlip, ResizableContainer, ResizableCard } from '.'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { TbArrowUpDashed } from 'react-icons/tb'
import { Area, AreaChart, Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

type MetricKey = 'visits' | 'earnings' | 'orders' | 'registered';

interface MetricTrend {
  difference: number;
  percent: number;
}

interface DashboardStats {
  visits: number;
  earnings: number;
  averageDuration: string;
  orders: number;
  pendingOrders: number;
  registered: number;
  trends: Record<MetricKey, MetricTrend>;
  activeSessions: Array<{
    visitorId: string;
    timeStarted: string;
    sessionDuration: string;
    status: string;
    location: string;
  }>;
  regionalData: Array<{
    region: string;
    count: number;
  }>;
}

interface CardConfig {
  icon: JSX.Element;
  title: string;
  subTitle: string;
  count: number | string;
  key: MetricKey;
}

interface BarChartItem {
  name: string
  quantitySold: number
  uniqueBuyers: number
  productID: number
}

const Cards: CardConfig[] = [
    {
        icon: <RiLoginBoxLine />,
        title: 'Total Visitors',
        subTitle: '',
        count: 0,
        key: 'visits'
    },
    {
        icon: <RiTimerLine />,
        title: 'Earnings',
        subTitle: 'Total Revenue',
        count: 0,
        key: 'earnings'
    },
    {
        icon: <RiQuestionAnswerLine />,
        title: 'Orders',
        subTitle: 'No. of Orders',
        count: 0,
        key: 'orders'
    },
    {
        icon: <RiUserCommunityLine />,
        title: 'Registered',
        subTitle: 'Newly Registered',
        count: 0,
        key: 'registered'
    },
];

const defaultRegions = [
  {
    region: "National Capital Region",
    abbr: "NCR",
    latitude: 14.5736,
    longitude: 121.03297,
    count: 0
  },
  {
    region: "Cordillera Administrative Region",
    abbr: "CAR",
    latitude: 17.35125,
    longitude: 121.17189,
    count: 0
  },
  {
    region: "Ilocos Region",
    abbr: "Region I",
    latitude: 16.08321,
    longitude: 120.61999,
    count: 0
  },
  {
    region: "Cagayan Valley",
    abbr: "Region II",
    latitude: 17.5751,
    longitude: 121.7269,
    count: 0
  },
  {
    region: "Central Luzon",
    abbr: "Region III",
    latitude: 15.48277,
    longitude: 120.71200,
    count: 0
  },
  {
    region: "CALABARZON",
    abbr: "Region IV-A",
    latitude: 14.10078,
    longitude: 121.07937,
    count: 0
  },
  {
    region: "MIMAROPA",
    abbr: "Region IV-B",
    latitude: 9.84321,
    longitude: 118.73648,
    count: 0
  },
  {
    region: "Bicol Region",
    abbr: "Region V",
    latitude: 13.42099,
    longitude: 123.41370,
    count: 0
  },
  {
    region: "Western Visayas",
    abbr: "Region VI",
    latitude: 11.00498,
    longitude: 122.53727,
    count: 0
  },
  {
    region: "Central Visayas",
    abbr: "Region VII",
    latitude: 9.81688,
    longitude: 124.06414,
    count: 0
  },
  {
    region: "Eastern Visayas",
    abbr: "Region VIII",
    latitude: 12.24455,
    longitude: 125.03882,
    count: 0
  },
  {
    region: "Zamboanga Peninsula",
    abbr: "Region IX",
    latitude: 8.15408,
    longitude: 123.25879,
    count: 0
  },
  {
    region: "Northern Mindanao",
    abbr: "Region X",
    latitude: 8.02016,
    longitude: 124.68565,
    count: 0
  },
  {
    region: "Davao Region",
    abbr: "Region XI",
    latitude: 7.30416,
    longitude: 126.08934,
    count: 0
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
    count: 0
  }
]

const regionColors = [
  { bg: 'rgba(239, 68, 68, 0.3)', hover: 'rgba(239, 68, 68, 0.5)', text: 'text-red-800' }, // NCR
  { bg: 'rgba(34, 197, 94, 0.3)', hover: 'rgba(34, 197, 94, 0.5)', text: 'text-green-800' }, // CAR
  { bg: 'rgba(59, 130, 246, 0.3)', hover: 'rgba(59, 130, 246, 0.5)', text: 'text-blue-800' }, // Region I
  { bg: 'rgba(168, 85, 247, 0.3)', hover: 'rgba(168, 85, 247, 0.5)', text: 'text-purple-800' }, // Region II
  { bg: 'rgba(236, 72, 153, 0.3)', hover: 'rgba(236, 72, 153, 0.5)', text: 'text-pink-800' }, // Region III
  { bg: 'rgba(249, 115, 22, 0.3)', hover: 'rgba(249, 115, 22, 0.5)', text: 'text-orange-800' }, // Region IV-A
  { bg: 'rgba(132, 204, 22, 0.3)', hover: 'rgba(132, 204, 22, 0.5)', text: 'text-lime-800' }, // Region IV-B
  { bg: 'rgba(20, 184, 166, 0.3)', hover: 'rgba(20, 184, 166, 0.5)', text: 'text-teal-800' }, // Region V
  { bg: 'rgba(139, 69, 19, 0.3)', hover: 'rgba(139, 69, 19, 0.5)', text: 'text-amber-900' }, // Region VI
  { bg: 'rgba(99, 102, 241, 0.3)', hover: 'rgba(99, 102, 241, 0.5)', text: 'text-indigo-800' }, // Region VII
  { bg: 'rgba(14, 165, 233, 0.3)', hover: 'rgba(14, 165, 233, 0.5)', text: 'text-cyan-800' }, // Region VIII
  { bg: 'rgba(232, 121, 249, 0.3)', hover: 'rgba(232, 121, 249, 0.5)', text: 'text-fuchsia-800' }, // Region IX
  { bg: 'rgba(190, 18, 60, 0.3)', hover: 'rgba(190, 18, 60, 0.5)', text: 'text-rose-800' }, // Region X
  { bg: 'rgba(6, 182, 212, 0.3)', hover: 'rgba(6, 182, 212, 0.5)', text: 'text-cyan-800' }, // Region XI
  { bg: 'rgba(217, 119, 6, 0.3)', hover: 'rgba(217, 119, 6, 0.5)', text: 'text-amber-800' }, // Region XII
  { bg: 'rgba(101, 163, 13, 0.3)', hover: 'rgba(101, 163, 13, 0.5)', text: 'text-lime-800' }, // Region XIII
  { bg: 'rgba(180, 83, 9, 0.3)', hover: 'rgba(180, 83, 9, 0.5)', text: 'text-orange-900' }, // BARMM
]

type RegionDefinition = (typeof defaultRegions)[number];

const Dashboard = () => {
  const [showMap, setShowMap] = useState(true);
  const [data, setData] = useState<BarChartItem[]>([])
  const [engagementOptions, showEngagementOptions] = useState(false);
  const [dataType, setDataType] = useState<'duration' | 'visits'>('duration');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState(defaultRegions);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null);

  const [filter, setFilter] = useState(false);
  const [currFilter, setCurrFilter] = useState('Today');

  const [activityOptions, showActivityOptions] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'Orders' | 'Registered'>('Orders');

  const { location: locationData, loading: locationLoading, requestLocation } = useLocationTracking();
  
  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);
  
  // Convert location format for compatibility
  const location = {
    latitude: locationData?.latitude || null,
    longitude: locationData?.longitude || null,
    accuracy: null,
    loading: locationLoading,
    error: locationData?.error || null,
    method: locationData?.method || null
  };
  
  // State for all resizable components
  const [mainContentSize, setMainContentSize] = useState(4);
  const [sidebarSize, setSidebarSize] = useState(2);
  const [userEngagementHeight, setUserEngagementHeight] = useState(1);
  const [activityHeight, setActivityHeight] = useState(1);

  const outsideClickRef = useClickOutside<HTMLDivElement>(() => showEngagementOptions(false), engagementOptions);
  const outsideActivityClick = useClickOutside<HTMLDivElement>(() => showActivityOptions(false), activityOptions);

  const getFilterParam = (filter: string) => {
    switch (filter) {
      case 'Yesterday': return 'yesterday';
      case 'Last 7 days': return 'last-7-days';
      case 'Last 30 days': return 'last-30-days';
      case 'Today':
      default: return 'today';
    }
  };

  const fetchDashboardData = async (filterParam: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://ontap-creatives-website.vercel.app/api/dashboard/stats?filter=${filterParam}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      // console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterParam = getFilterParam(currFilter);
    fetchDashboardData(filterParam);
  }, [currFilter]);

  const getDaysFromFilter = (filter: string): number => {
    switch (filter) {
      case 'Today': return 1
      case 'Yesterday': return 1 // You might want special handling for yesterday
      case 'Last 7 days': return 7
      case 'Last 30 days': return 30
      default: return 1
    }
  }

  const fetchPopularItems = async (filter: string) => {
    try {
      setLoading(true)
      const days = getDaysFromFilter(filter)
      const response = await fetch(`https://ontap-creatives-website.vercel.app/api/dashboard/popular-items?days=${days}&limit=8`)
      const result = await response.json()
      
      if (response.ok) {
        setData(result.data)
      } else {
        // console.error('Failed to fetch popular items:', result.error)
      }
    } catch (error) {
      // console.error('Error fetching popular items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPopularItems(currFilter)
  }, [currFilter])

  // Color palette for bars
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#ff8042']

  const getCardValue = (card: CardConfig): string => {
    if (!stats) return '...';
    
    const value = stats[card.key];
    
    if (card.key === 'earnings' && typeof value === 'number') {
      return value.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (typeof value === 'number') {
      return value.toLocaleString('en-US');
    } else if (typeof value === 'string') {
      return value;
    }
    
    return '...';
  };

  const getTrend = (key: MetricKey): MetricTrend => {
    if (!stats?.trends?.[key]) {
      return { difference: 0, percent: 0 };
    }
    return stats.trends[key];
  };

  const formatDifference = (key: MetricKey, trend: MetricTrend) => {
    if (!trend) return '+0';
    if (trend.difference === 0) return '+0';
    const prefix = trend.difference > 0 ? '+' : '-';
    const absValue = Math.abs(trend.difference);
    if (key === 'earnings') {
      return `${prefix}${absValue.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `${prefix}${absValue.toLocaleString('en-US')}`;
  };

  const formatPercent = (trend: MetricTrend) => {
    if (!trend) return '0%';
    if (trend.percent === 0) return '0%';
    const prefix = trend.percent > 0 ? '+' : '';
    return `${prefix}${trend.percent.toFixed(1)}%`;
  };

  const handleMainContentResize = (newSize: number) => {
    setMainContentSize(newSize);
    // Adjust sidebar size to maintain total grid columns (6)
    setSidebarSize(6 - newSize);
  };

  // Fetch region data with visitor counts
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const days = getDaysFromFilter(currFilter);
        const response = await fetch(`https://ontap-creatives-website.vercel.app/api/visitor/regions?days=${days}`)
        const data = await response.json()
        
        if (data.regions) {
          // Match regions with actual data, handling case-insensitive and partial matches
          const updatedRegions = defaultRegions.map(defaultRegion => {
            const matchedRegion = data.regions.find((r: any) => {
              const defaultRegionName = defaultRegion.region.toLowerCase();
              const apiRegionName = (r.region || '').toLowerCase();
              return (
                defaultRegionName === apiRegionName ||
                defaultRegionName.includes(apiRegionName) ||
                apiRegionName.includes(defaultRegionName) ||
                defaultRegion.abbr.toLowerCase() === (r.abbr || '').toLowerCase()
              );
            });
            return {
              ...defaultRegion,
              count: matchedRegion?.count || 0
            };
          });
          setRegions(updatedRegions);
        }
      } catch (error) {
        console.error('Error fetching region data:', error)
      }
    }

    fetchRegionData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchRegionData, 30000)
    return () => clearInterval(interval)
  }, [currFilter])

  const handleRegionClick = (region: RegionDefinition) => {
    setSelectedRegionName(prev => {
      // If clicking the same region, clear the selection
      if (prev === region.region) {
        return null;
      }
      // Otherwise select the new region
      return region.region;
    });
  };

  const clearRegionSelection = () => setSelectedRegionName(null);

  return (
    <div className='w-full h-full md:max-h-[100vh] bg-neutral-100 px-5 py-10 pb-5 gap-5 flex flex-col overflow-x-hidden md:pl-10 2xl:pl-5'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Dashboard</h1>
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
                                    setCurrFilter('Today');
                                }}
                            >Today</button>
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
        <div className='w-full h-max lg:h-full grid grid-cols-6 gap-3 lg:overflow-hidden'>
            <div className='col-span-full lg:col-span-4 flex flex-col gap-5 lg:overflow-hidden'>
              <ResizableContainer
                defaultSize={mainContentSize}
                minSize={2}
                maxSize={5}
                onResize={handleMainContentResize}
                direction="horizontal"
                className="flex flex-col gap-5 overflow-hidden"
              >
                <div className='w-full grid grid-cols-2 lg:flex gap-3 items-center flex-nowrap'>
                    {Cards.map((card, i) => {
                      const trend = getTrend(card.key);
                      const differenceLabel = formatDifference(card.key, trend);
                      const percentLabel = formatPercent(trend);
                      const isPositive = trend.difference >= 0;
                      const percentColor = isPositive ? 'text-emerald-500' : 'text-rose-500';
                      return (
                        <div key={`dashboard-card_${i}`} className='rounded-md p-3 shadow-md shadow-neutral-200 bg-white items-stretch h-full md:h-auto w-full flex flex-col relative'>
                          <div className='flex gap-2 items-start justify-between'>
                            <div className='flex flex-col'>
                              <h2 className='font-semibold text-sm text-violet'>{card.title}</h2>
                              <span className='flex items-end gap-1'>
                                <p className='md:text-xl font-semibold lg:text-3xl lg:font-extrabold'>
                                  {loading ? '...' : getCardValue(card)}
                                </p>
                                <span className={`text-xs font-extrabold mb-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {differenceLabel}
                                </span>
                              </span>
                            </div>
                            <span className='text-2xl text-dark-blue'>{card.icon}</span>
                          </div>
                          <div className='flex mt-3'>
                            <span className={`flex gap-0.5 items-center font-bold text-sm ${percentColor}`}>
                              <TbArrowUpDashed className={!isPositive ? 'rotate-180' : ''}/>
                              {percentLabel}
                            </span>
                          </div>
                          <div className='absolute z-10 h-14 w-30 right-1 bottom-1 flex items-center justify-end overflow-hidden rounded-sm'>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={data}
                                margin={{
                                  top: 2,
                                  right: 0,
                                  left: 3,
                                  bottom: 0,
                                }}
                              >
                                <Area type="monotone" dataKey="pv" stroke="#00a6f4" fill="#00a6f4" fillOpacity={0.2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                <div className='min-h-2/5 w-full grid grid-cols-5 gap-3'>
                  {/* User Engagement - Resizable Height */}
                  <ResizableCard
                      defaultSize={userEngagementHeight}
                      minSize={0.5}
                      maxSize={3}
                      onResize={setUserEngagementHeight}
                      direction="vertical"
                      className="flex flex-col h-68 lg:h-auto rounded-lg col-span-full lg:col-span-3"
                      resizeEdges={['right']}
                  >
                      <div className='flex w-full items-center justify-between pr-3'>
                          <h3 className='font-bold text-base pb-3'>User Engagement</h3>
                          <div className='relative'>
                              <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => showEngagementOptions(!engagementOptions)}><HiDotsHorizontal /></button>
                              {engagementOptions && (
                                  <span ref={outsideClickRef} className='text-sm absolute right-0 flex flex-col rounded-lg bg-white border border-black/20 overflow-hidden z-99 mt-1'>
                                      <button type="button" className='py-2 px-5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setDataType('duration')}>Duration</button>
                                      <button type="button" className='py-2 px-5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setDataType('visits')}>Visits</button>
                                  </span>
                              )}
                          </div>
                      </div>
                      <div className='h-full w-full flex-1'>
                          <WebAnalysis dataType={dataType} timeFilter={currFilter}/>
                      </div>
                  </ResizableCard>

                  <ResizableCard
                    defaultSize={userEngagementHeight}
                    minSize={0.5}
                    maxSize={3}
                    onResize={setUserEngagementHeight}
                    direction="vertical"
                    className="flex flex-col rounded-lg col-span-full lg:col-span-2"
                    resizeEdges={['right']}
                  >
                    <div className='flex w-full items-center justify-between pr-3'>
                      <h3 className='font-bold text-base pb-3'>Popular Items</h3>
                    </div>
                    <div className='h-full w-full flex-1'>
                      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <BarChart
                          data={data}
                          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                          barSize={35}
                        >
                          <XAxis 
                            dataKey="name" 
                            textAnchor="end"
                            interval={0}
                            fontSize={12}
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === 'quantitySold') return [value, 'Quantity Sold']
                              if (name === 'uniqueBuyers') return [value, 'Unique Buyers']
                              return [value, name]
                            }}
                            labelFormatter={(label) => `Product: ${label}`}
                          />
                          <Bar 
                            dataKey="quantitySold" 
                            name="Quantity Sold"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                            <LabelList dataKey="quantitySold" position="top" fontSize={12} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ResizableCard>
                </div>
                
                {/* Activity Section - Resizable Height */}
                <ResizableCard
                    defaultSize={activityHeight}
                    minSize={0.8}
                    maxSize={3}
                    onResize={setActivityHeight}
                    direction="vertical"
                    className="flex flex-col rounded-lg overflow-hidden"
                    resizeEdges={['bottom']}
                >
                    <div className='flex w-full items-center justify-between pr-3'>
                        <h3 className='font-bold text-base pb-3'><strong>Recent Activity <span className='text-sm font-black'>&gt;</span> {activityFilter === 'Orders' ? 'Orders' : 'Registered'}</strong></h3>
                        <div className='relative'>
                          <button type="button" className='p-2 rounded-md border border-transparent hover:border-violet focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => showActivityOptions(!activityOptions)}><HiDotsHorizontal /></button>
                          {activityOptions && (
                            <span ref={outsideActivityClick} className='text-sm absolute right-0 flex flex-col rounded-lg bg-white border border-black/20 overflow-hidden z-99 mt-1'>
                              <button type="button" className='py-2 px-5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setActivityFilter('Orders')}>Orders</button>
                              <button type="button" className='py-2 px-5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={() => setActivityFilter('Registered')}>Registered</button>
                            </span>
                          )}
                        </div>
                    </div>
                    <div className='h-fit md:h-full w-full flex flex-col overflow-hidden px-2 flex-1'>
                        <div className={`h-10 w-full px-3 grid ${activityFilter === 'Orders' ? 'grid-cols-9' : 'grid-cols-7'} border-b gap-2 border-neutral-300 overflow-hidden font-bold text-sm md:text-base lg:text-sm bg-dark-blue text-white items-center rounded-md`}>
                            <span className='col-span-2 py-2 text-left'>Client Name</span>
                            <span className='col-span-2 py-2 text-left'>Email Address</span>
                            <span className='col-span-1 py-2 text-left'>Contact</span>
                            <span className='col-span-1 py-2 text-left'>Date</span>
                            <span className={`${activityFilter === 'Orders' ? 'text-center' : 'text-left'} col-span-1 py-2`}>{activityFilter === 'Orders' ? 'Quantity' : 'Location'}</span>
                            {activityFilter === 'Orders' && (
                            <>
                              <span className='col-span-1 py-2 text-center'>Total</span>
                              <span className='col-span-1 py-2 text-center'>Status</span>
                            </>
                            )}
                        </div>
                        <div className='h-full max-h-[30vh] md:max-h-auto w-full flex flex-col overflow-x-hidden text-sm md:text-base lg:text-sm 2xl:text-base flex-1'>
                            <div className='h-full max-h-[30vh] md:max-h-auto w-full flex flex-col overflow-x-hidden text-sm md:text-base lg:text-sm 2xl:text-base'>
                              {Array.from({ length: 10 }).map((_, i) => (
                                <ActivitySlip 
                                  key={i} 
                                  activityFilter={activityFilter}
                                  timeFilter={currFilter}
                                  index={i}
                                />
                              ))}
                            </div>
                        </div>
                    </div>
                </ResizableCard>
            </ResizableContainer>
            </div>

            {/* Sidebar Area - Resizable */}
            <ResizableContainer
              defaultSize={sidebarSize}
              minSize={1}
              maxSize={4}
              onResize={setSidebarSize}
              direction="horizontal"
              className="flex flex-col gap-3 overflow-hidden pb-10 md:pb-0 col-span-full lg:col-span-2"
            >
              {/* World Map Card */}
              <ResizableCard
                defaultSize={2}
                minSize={1}
                maxSize={4}
                onResize={() => {}}
                direction="vertical"
                className="rounded-lg lg:overflow-hidden max-h-100 lg:h-auto"
                resizeEdges={['bottom']}
              >
                <div className="w-full h-full">
                  {showMap && (
                    <WorldMap 
                      selectedRegion={selectedRegionName}
                      viewMode="points"
                      days={getDaysFromFilter(currFilter)}
                      onClearRegion={clearRegionSelection}
                    />
                  )}
                  {location.loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                        <div className="text-lg">Loading visitor data...</div>
                      </div>
                    )}

                    {!location.loading && regions.every(region => region.count === 0) && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No visitor location data available for the selected period.
                      </div>
                    )}
                </div>
              </ResizableCard>

              {/* Rest of your component remains the same */}
              <ResizableCard
                defaultSize={1}
                minSize={0.8}
                maxSize={3}
                onResize={() => {}}
                direction="vertical"
                className="rounded-lg lg:overflow-x-hidden"
                resizeEdges={['bottom']}
              >
                <div className='flex w-full items-center justify-between p-0 pb-3 pr-3'>
                  <h3 className='font-semibold text-sm'>Visitor's Area Locations</h3>
                </div>
                <div className='w-full h-auto grid grid-cols-3 overflow-x-hidden px-5 gap-3'>
                  {regions.map((region, i) => {
                    const color = regionColors[i % regionColors.length];
                    const isSelected = selectedRegionName === region.region;
                    return (
                    <button 
                      key={region.abbr}
                      type='button' 
                      className={`px-2 py-3 flex flex-col items-center justify-center gap-1 rounded-md transition-all duration-200 hover:scale-105 ${
                        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-200' : ''
                      }`}
                      style={{
                        backgroundColor: color.bg,
                      }}
                      onClick={() => handleRegionClick(region)}
                    >
                      <span className={`font-bold text-lg ${color.text}`}>
                        {region.count.toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium ${color.text}`}>
                        {region.abbr}
                      </span>
                    </button>
                  )})}
                </div>
              </ResizableCard>
            </ResizableContainer>
        </div>
    </div>
  )
}

export default Dashboard