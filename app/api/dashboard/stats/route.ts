import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'today'

    // Calculate date ranges based on filter
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (filter) {
      case 'yesterday':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'last-7-days':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'last-30-days':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 30)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'today':
      default:
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
    }

    // Get number of visits (unique visitors)
    const visits = await prisma.visitor.count({
      where: {
        firstVisit: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get average session duration
    const sessions = await prisma.session.findMany({
      where: {
        dateVisited: {
          gte: startDate,
          lte: endDate
        },
        duration: {
          not: null
        }
      },
      select: {
        duration: true
      }
    })

    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)
    const averageDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0

    // Format average duration
    const formatDuration = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    }

    // Get orders count (transactions)
    const orders = await prisma.transaction.count({
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get pending orders (carts with status)
    const pendingOrders = await prisma.cart.count({
      where: {
        status: 'pending',
        dateAdded: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get newly registered users
    const registeredUsers = await prisma.client.count({
      where: {
        dateCreated: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get real-time active sessions
    const activeSessions = await prisma.session.findMany({
      where: {
        dateLeft: null, // Sessions that haven't ended
        dateVisited: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        visitor: {
          select: {
            visitorUUID: true,
            region: true,
            city: true
          }
        }
      },
      orderBy: {
        dateVisited: 'desc'
      },
      take: 10
    })

    // Get regional data
    const regionalData = await prisma.visitor.groupBy({
      by: ['region'],
      where: {
        firstVisit: {
          gte: startDate,
          lte: endDate
        },
        region: {
          not: null
        }
      },
      _count: {
        region: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        visits,
        averageDuration: formatDuration(averageDuration),
        orders,
        pendingOrders,
        registered: registeredUsers, // Add this line
        activeSessions: activeSessions.map(session => ({
          visitorId: session.visitor.visitorUUID.substring(0, 7).toUpperCase(),
          timeStarted: session.dateVisited.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          sessionDuration: session.duration ? formatDuration(session.duration) : 'Active',
          status: 'Browsing',
          location: session.visitor.region || session.visitor.city || 'Unknown'
        })),
        regionalData: regionalData.map(region => ({
          region: region.region,
          count: region._count.region
        }))
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch dashboard statistics' 
      },
      { status: 500 }
    )
  }
}