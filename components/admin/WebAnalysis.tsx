import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementData {
  name: string;
  visits: number;
  duration: number;
  formattedDuration?: string;
}

interface WebAnalysisProps {
  dataType: 'duration' | 'visits';
  timeFilter?: string;
}

// Format duration function
const formatDuration = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
  }
  return `${seconds.toFixed(1)}s`;
};

const WebAnalysis = ({ dataType = 'duration', timeFilter = 'Today' }: WebAnalysisProps) => {
  const [data, setData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/engagement?filter=${timeFilter}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Add formatted duration to the data
            const formattedData = result.data.map((item: EngagementData) => ({
              ...item,
              formattedDuration: formatDuration(item.duration)
            }));
            setData(formattedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch engagement data:', error);
        // Fallback to sample data if API fails
        setData(getSampleData(timeFilter));
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData();
  }, [dataType, timeFilter]);

  // Sample data fallback
  const getSampleData = (filter: string): EngagementData[] => {
    if (filter === 'Last 7 days') {
      return [
        { name: 'Mon', visits: 1245, duration: 156, formattedDuration: formatDuration(156) },
        { name: 'Tue', visits: 1890, duration: 201, formattedDuration: formatDuration(201) },
        { name: 'Wed', visits: 1567, duration: 178, formattedDuration: formatDuration(178) },
        { name: 'Thu', visits: 2341, duration: 245, formattedDuration: formatDuration(245) },
        { name: 'Fri', visits: 1987, duration: 189, formattedDuration: formatDuration(189) },
        { name: 'Sat', visits: 1678, duration: 167, formattedDuration: formatDuration(167) },
        { name: 'Sun', visits: 1456, duration: 154, formattedDuration: formatDuration(154) },
      ];
    }

    if (filter === 'Last 30 days') {
      return [
        { name: 'Week 1', visits: 8567, duration: 167, formattedDuration: formatDuration(167) },
        { name: 'Week 2', visits: 9234, duration: 189, formattedDuration: formatDuration(189) },
        { name: 'Week 3', visits: 7845, duration: 156, formattedDuration: formatDuration(156) },
        { name: 'Week 4', visits: 10234, duration: 201, formattedDuration: formatDuration(201) },
      ];
    }

    // Default hourly data for today/yesterday
    return [
      { name: '08:00', visits: 130, duration: 65.3, formattedDuration: formatDuration(65.3) },
      { name: '09:00', visits: 89, duration: 92.7, formattedDuration: formatDuration(92.7) },
      { name: '10:00', visits: 421, duration: 45.2, formattedDuration: formatDuration(45.2) },
      { name: '11:00', visits: 279, duration: 78.9, formattedDuration: formatDuration(78.9) },
      { name: '12:00', visits: 242, duration: 101.5, formattedDuration: formatDuration(101.5) },
      { name: '13:00', visits: 144, duration: 33.8, formattedDuration: formatDuration(33.8) },
      { name: '14:00', visits: 223, duration: 67.2, formattedDuration: formatDuration(67.2) },
      { name: '15:00', visits: 189, duration: 89.4, formattedDuration: formatDuration(89.4) },
      { name: '16:00', visits: 267, duration: 54.1, formattedDuration: formatDuration(54.1) },
      { name: '17:00', visits: 312, duration: 72.6, formattedDuration: formatDuration(72.6) },
      { name: '18:00', visits: 198, duration: 61.8, formattedDuration: formatDuration(61.8) },
      { name: '19:00', visits: 156, duration: 48.3, formattedDuration: formatDuration(48.3) },
    ];
  };

  // Custom tooltip formatter based on data type
  const getTooltipFormatter = (value: number, name: string) => {
    if (dataType === 'duration') {
      return [formatDuration(value), 'Avg Duration'];
    }
    return [value, 'Visits'];
  };

  // Custom tooltip label based on time filter
  const getTooltipLabel = (label: string) => {
    if (timeFilter === 'Last 7 days') {
      return `Day: ${label}`;
    } else if (timeFilter === 'Last 30 days') {
      return `Week: ${label}`;
    } else {
      return `Time: ${label}`;
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-neutral-500">Loading engagement data...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className='-z-10'>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: -10,
          bottom: 5,
        }}
      >
        <XAxis 
          dataKey="name" 
          className='text-sm'
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className='text-sm'
          tick={{ fontSize: 12 }}
          label={{
            value: `${dataType === 'duration' ? 'duration' : 'number of visits'}`,
            style: { textAnchor: 'middle' },
            angle: -90,
            position: 'left',
            offset: -20,
          }}
        />
        <Tooltip 
          formatter={getTooltipFormatter}
          labelFormatter={getTooltipLabel}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataType} 
          stroke="#5199D3" 
          strokeWidth={2}
          activeDot={{ r: 6 }} 
          name={dataType === 'duration' ? 'Average Session Duration' : 'Visits'}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WebAnalysis