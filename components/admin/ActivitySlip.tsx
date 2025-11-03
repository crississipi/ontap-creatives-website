import React, { useEffect, useState } from 'react'

interface ActivityData {
  clientName: string;
  email: string;
  contact: string;
  date: string;
  quantity?: number;
  total?: number;
  status?: string;
  location?: string;
}

interface ActivitySlipProps {
  activityFilter: 'Orders' | 'Registered';
  timeFilter: string;
  index?: number;
}

const ActivitySlip = ({ activityFilter, timeFilter, index = 0 }: ActivitySlipProps) => {
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/dashboard/activity?filter=${timeFilter}&activityType=${activityFilter}`
        )
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.length > index) {
            setActivityData(result.data[index])
          } else {
            // Use fallback data if no real data available
            setActivityData(getFallbackData(activityFilter, index))
          }
        } else {
          setActivityData(getFallbackData(activityFilter, index))
        }
      } catch (error) {
        console.error('Failed to fetch activity data:', error)
        setActivityData(getFallbackData(activityFilter, index))
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [activityFilter, timeFilter, index])

  // Fallback data generator
  const getFallbackData = (filter: 'Orders' | 'Registered', idx: number): ActivityData => {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Chris Brown']
    const emails = ['john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com', 'chris@example.com']
    const locations = ['Manila', 'Cebu', 'Davao', 'Cavite', 'Laguna']
    const statuses = ['Completed', 'Pending', 'Processing', 'Shipped']

    if (filter === 'Orders') {
      return {
        clientName: names[idx % names.length],
        email: emails[idx % emails.length],
        contact: `+63${9000000000 + idx}`,
        date: new Date(Date.now() - idx * 86400000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        quantity: Math.floor(Math.random() * 5) + 1,
        total: Math.floor(Math.random() * 5000) + 500,
        status: statuses[idx % statuses.length],
        location: locations[idx % locations.length]
      }
    } else {
      return {
        clientName: names[idx % names.length],
        email: emails[idx % emails.length],
        contact: `+63${9000000000 + idx}`,
        date: new Date(Date.now() - idx * 86400000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        location: locations[idx % locations.length]
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading || !activityData) {
    return (
      <div className={`w-full py-3 px-3 grid ${activityFilter === 'Orders' ? 'grid-cols-9' : 'grid-cols-7'} gap-2 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200`}>
        {Array.from({ length: activityFilter === 'Orders' ? 9 : 7 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <button 
      type='button' 
      className={`w-full py-3 px-3 grid ${activityFilter === 'Orders' ? 'grid-cols-9' : 'grid-cols-7'} gap-2 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200`}
    >
      {/* Client Name */}
      <span className='col-span-2 text-left overflow-hidden overflow-ellipsis text-nowrap font-medium'>
        {activityData.clientName}
      </span>
      
      {/* Email Address */}
      <span className='col-span-2 text-left overflow-hidden overflow-ellipsis text-nowrap text-sm'>
        {activityData.email}
      </span>
      
      {/* Contact */}
      <span className='col-span-1 text-left overflow-hidden overflow-ellipsis text-nowrap text-sm'>
        {activityData.contact}
      </span>
      
      {/* Date */}
      <span className='col-span-1 text-left overflow-hidden overflow-ellipsis text-nowrap text-sm'>
        {activityData.date}
      </span>
      
      {/* Quantity or Location */}
      <span className={`${activityFilter === 'Orders' ? 'text-center' : 'text-left'} col-span-1 text-sm`}>
        {activityFilter === 'Orders' ? activityData.quantity : activityData.location}
      </span>
      
      {/* Order-specific columns */}
      {activityFilter === 'Orders' && (
        <>
          {/* Total */}
          <span className='col-span-1 text-center font-medium text-sm'>
            {activityData.total ? formatCurrency(activityData.total) : 'N/A'}
          </span>
          
          {/* Status */}
          <span className='col-span-1 text-center'>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activityData.status || '')}`}>
              {activityData.status || 'N/A'}
            </span>
          </span>
        </>
      )}
    </button>
  )
}

export default ActivitySlip