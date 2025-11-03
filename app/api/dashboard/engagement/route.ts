import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EngagementDataPoint {
  name: string;
  visits: number;
  duration: number;
}

// Format duration function for API
const formatDuration = (seconds: number): number => {
  return Number(seconds.toFixed(1)); // Return as number for chart, formatted in frontend
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'Today'

    // Calculate date ranges based on filter
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (filter) {
      case 'Yesterday':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'Last 7 days':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'Last 30 days':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 30)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'Today':
      default:
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
    }

    let engagementData: EngagementDataPoint[] = []

    switch (filter) {
      case 'Last 7 days':
        engagementData = await getLast7DaysData(startDate, endDate)
        break
      case 'Last 30 days':
        engagementData = await getLast30DaysData(startDate, endDate)
        break
      case 'Today':
      case 'Yesterday':
      default:
        engagementData = await getHourlyData(startDate, endDate)
        break
    }

    return NextResponse.json({
      success: true,
      data: engagementData
    }, { status: 200 })

  } catch (error) {
    console.error('Engagement data error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch engagement data' 
      },
      { status: 500 }
    )
  }
}

async function getHourlyData(startDate: Date, endDate: Date): Promise<EngagementDataPoint[]> {
  // Get visits per hour
  const hourlyVisits = await prisma.session.groupBy({
    by: ['dateVisited'],
    where: {
      dateVisited: {
        gte: startDate,
        lte: endDate
      }
    },
    _count: {
      sessionID: true
    }
  })

  // Get average duration per hour
  const hourlyDurations = await prisma.session.groupBy({
    by: ['dateVisited'],
    where: {
      dateVisited: {
        gte: startDate,
        lte: endDate
      },
      duration: {
        not: null
      }
    },
    _avg: {
      duration: true
    }
  })

  // Group by hour and format data
  const hourlyData: { [key: string]: { visits: number; totalDuration: number; count: number } } = {}

  // Initialize all hours with 0 values
  for (let hour = 0; hour < 24; hour++) {
    const hourLabel = hour.toString().padStart(2, '0') + ':00'
    hourlyData[hourLabel] = { visits: 0, totalDuration: 0, count: 0 }
  }

  // Process visits
  hourlyVisits.forEach(visit => {
    const hour = new Date(visit.dateVisited).getHours()
    const hourLabel = hour.toString().padStart(2, '0') + ':00'
    hourlyData[hourLabel].visits += visit._count.sessionID
  })

  // Process durations
  hourlyDurations.forEach(duration => {
    const hour = new Date(duration.dateVisited).getHours()
    const hourLabel = hour.toString().padStart(2, '0') + ':00'
    if (duration._avg.duration) {
      hourlyData[hourLabel].totalDuration += duration._avg.duration
      hourlyData[hourLabel].count += 1
    }
  })

  // Convert to array format and filter out hours with no data for today
  return Object.entries(hourlyData)
    .map(([name, data]) => ({
      name,
      visits: data.visits,
      duration: data.count > 0 ? formatDuration(data.totalDuration / data.count) : 0
    }))
    .filter(item => item.visits > 0 || item.duration > 0)
}

async function getLast7DaysData(startDate: Date, endDate: Date): Promise<EngagementDataPoint[]> {
  // Get all sessions for the last 7 days
  const sessions = await prisma.session.findMany({
    where: {
      dateVisited: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      dateVisited: true,
      duration: true
    }
  })

  // Initialize weekday data
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekdayData: { [key: string]: { visits: number; totalDuration: number; count: number } } = {}
  
  weekdays.forEach(day => {
    weekdayData[day] = { visits: 0, totalDuration: 0, count: 0 }
  })

  // Process each session
  sessions.forEach(session => {
    const dayOfWeek = new Date(session.dateVisited).getDay()
    const dayName = weekdays[dayOfWeek]
    
    weekdayData[dayName].visits += 1
    
    if (session.duration) {
      weekdayData[dayName].totalDuration += session.duration
      weekdayData[dayName].count += 1
    }
  })

  // Convert to array format in correct weekday order (starting from Monday)
  const orderedWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return orderedWeekdays.map(dayName => ({
    name: dayName,
    visits: weekdayData[dayName].visits,
    duration: weekdayData[dayName].count > 0 ? formatDuration(weekdayData[dayName].totalDuration / weekdayData[dayName].count) : 0
  }))
}

async function getLast30DaysData(startDate: Date, endDate: Date): Promise<EngagementDataPoint[]> {
  // Get all sessions for the last 30 days
  const sessions = await prisma.session.findMany({
    where: {
      dateVisited: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      dateVisited: true,
      duration: true
    }
  })

  // Group sessions by week
  const weeklyData: { [key: string]: { visits: number; totalDuration: number; count: number } } = {}
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.dateVisited)
    const weekStart = getWeekStartDate(sessionDate)
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { visits: 0, totalDuration: 0, count: 0 }
    }
    
    weeklyData[weekKey].visits += 1
    
    if (session.duration) {
      weeklyData[weekKey].totalDuration += session.duration
      weeklyData[weekKey].count += 1
    }
  })

  // Convert to array format with week labels
  const weekStarts = Object.keys(weeklyData).sort()
  return weekStarts.map((weekStart, index) => {
    const startDate = new Date(weekStart)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    return {
      name: `Week ${index + 1}`,
      visits: weeklyData[weekStart].visits,
      duration: weeklyData[weekStart].count > 0 ? formatDuration(weeklyData[weekStart].totalDuration / weeklyData[weekStart].count) : 0
    }
  })
}

// Helper function to get the Monday of the week for a given date
function getWeekStartDate(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(date.setDate(diff))
}