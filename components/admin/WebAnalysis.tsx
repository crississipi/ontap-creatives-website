import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '08:00',
    visits: 130,
    duration: 210,
  },
  {
    name: '09:00',
    visits: 89,
    duration: 92,
  },
  {
    name: '10:00',
    visits: 421,
    duration: 564,
  },
  {
    name: '11:00',
    visits: 279,
    duration: 133,
  },
  {
    name: '12:00',
    visits: 242,
    duration: 101,
  },
  {
    name: '01:00',
    visits: 144,
    duration: 132,
  },
  {
    name: '02:00',
    visits: 223,
    duration: 114,
  },
];

const WebAnalysis = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <XAxis dataKey="name" className='text-sm'/>
        <YAxis className='text-sm'/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="duration" stroke="#5199D3" activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="visits" stroke="#5A5CA8" activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WebAnalysis