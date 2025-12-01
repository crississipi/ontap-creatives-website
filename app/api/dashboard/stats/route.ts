import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to format currency with proper suffixes
function formatCurrency(value: number): string {
  if (value === 0) return '₱0'
  
  const absValue = Math.abs(value)
  
  if (absValue >= 1000000) {
    const millions = value / 1000000
    if (millions >= 100) {
      return `₱${Math.round(millions)}M`
    } else if (millions >= 10) {
      return `₱${millions.toFixed(1)}M`
    } else {
      return `₱${millions.toFixed(2)}M`
    }
  } else if (absValue >= 1000) {
    const thousands = value / 1000
    
    if (absValue >= 100000) {
      return `₱${Math.round(thousands)}K`
    } else if (absValue >= 10000) {
      return `₱${thousands.toFixed(1)}K`
    } else {
      return `₱${thousands.toFixed(1)}K`
    }
  } else {
    return `₱${Math.round(value).toLocaleString('en-PH')}`
  }
}

// Helper function to format numbers with K and M suffixes
function formatNumber(value: number): string {
  if (value === 0) return '0'
  
  const absValue = Math.abs(value)
  
  if (absValue >= 1000000) {
    const millions = value / 1000000
    if (millions >= 100) {
      return `${Math.round(millions)}M`
    } else if (millions >= 10) {
      return `${millions.toFixed(1)}M`
    } else {
      return `${millions.toFixed(2)}M`
    }
  } else if (absValue >= 1000) {
    const thousands = value / 1000
    
    if (absValue >= 100000) {
      return `${Math.round(thousands)}K`
    } else if (absValue >= 10000) {
      return `${thousands.toFixed(1)}K`
    } else {
      return `${thousands.toFixed(1)}K`
    }
  } else {
    return Math.round(value).toString()
  }
}

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

    const rangeDuration = Math.max(1, endDate.getTime() - startDate.getTime())
    const previousRangeEnd = new Date(startDate.getTime())
    const previousRangeStart = new Date(previousRangeEnd.getTime() - rangeDuration)

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

    // Define ALL possible paid status variations explicitly
    const paidStatuses = [
      'Paid',
      'paid',
      'PAID',
      'Payment Received',
      'payment received',
      'PAYMENT RECEIVED',
      'Payment Complete',
      'payment complete',
      'PAYMENT COMPLETE',
      'Completed', 
      'completed',
      'COMPLETED',
      'Delivered',
      'delivered',
      'DELIVERED',
      'Shipped',
      'shipped',
      'SHIPPED',
      'Processing',
      'processing',
      'PROCESSING',
      'Success',
      'success',
      'SUCCESS',
      'Finished',
      'finished',
      'FINISHED',
      'Done',
      'done',
      'DONE',
      'Confirmed',
      'confirmed',
      'CONFIRMED',
      'Approved',
      'approved',
      'APPROVED'
    ]

    // Create simple status conditions using only 'equals'
    const statusConditions = paidStatuses.map(status => ({
      status: {
        equals: status
      }
    }))

    // Calculate total earnings - ONLY include transactions with paid statuses
    const earningsPromise = prisma.transaction.aggregate({
      _sum: {
        subtotal: true
      },
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        },
        OR: statusConditions
      }
    })

    // Get count of paid orders for orders count
    const paidOrdersCountPromise = prisma.transaction.count({
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        },
        OR: statusConditions
      }
    })

    // Get all orders count (for reference)
    const allOrdersCountPromise = prisma.transaction.count({
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get detailed paid transactions for debugging
    const paidTransactionsPromise = prisma.transaction.findMany({
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        },
        OR: statusConditions
      },
      select: {
        orderID: true,
        status: true,
        subtotal: true,
        dateOrdered: true
      }
    })

    // Get ALL transactions to see what statuses actually exist
    const allTransactionsPromise = prisma.transaction.findMany({
      where: {
        dateOrdered: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        orderID: true,
        status: true,
        subtotal: true,
        dateOrdered: true
      },
      take: 50 // Limit to avoid too much data
    })

    const [
      earningsResult, 
      paidOrdersCount, 
      allOrdersCount, 
      paidTransactions,
      allTransactions
    ] = await Promise.all([
      earningsPromise, 
      paidOrdersCountPromise,
      allOrdersCountPromise,
      paidTransactionsPromise,
      allTransactionsPromise
    ])
    
    // Safely access aggregate results
    const earnings = earningsResult._sum?.subtotal || 0

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

    // Previous period metrics for trends
    const [
      visitsPrevious,
      earningsPreviousResult,
      paidOrdersPreviousCount,
      registeredPrevious
    ] = await Promise.all([
      prisma.visitor.count({
        where: {
          firstVisit: {
            gte: previousRangeStart,
            lte: previousRangeEnd
          }
        }
      }),
      prisma.transaction.aggregate({
        _sum: {
          subtotal: true
        },
        where: {
          dateOrdered: {
            gte: previousRangeStart,
            lte: previousRangeEnd
          },
          OR: statusConditions
        }
      }),
      prisma.transaction.count({
        where: {
          dateOrdered: {
            gte: previousRangeStart,
            lte: previousRangeEnd
          },
          OR: statusConditions
        }
      }),
      prisma.client.count({
        where: {
          dateCreated: {
            gte: previousRangeStart,
            lte: previousRangeEnd
          }
        }
      })
    ])

    // Safely access previous period aggregate results
    const earningsPrevious = earningsPreviousResult._sum?.subtotal || 0

    const calculateTrend = (current: number, previous: number) => {
      const difference = current - previous
      let percent = 0
      if (previous === 0) {
        percent = difference === 0 ? 0 : 100
      } else {
        percent = (difference / previous) * 100
      }
      return {
        difference,
        percent
      }
    }

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

    // Get unique statuses from all transactions for debugging
    const uniqueStatuses = [...new Set(allTransactions.map(t => t.status))]

    // Format the response data with proper number formatting
    return NextResponse.json({
      success: true,
      data: {
        visits,
        averageDuration: formatDuration(averageDuration),
        orders: paidOrdersCount, // Show count of paid orders
        pendingOrders,
        earnings, // This only includes paid transactions
        registered: registeredUsers,
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
        trends: {
          visits: calculateTrend(visits, visitsPrevious),
          earnings: calculateTrend(earnings, earningsPrevious),
          orders: calculateTrend(paidOrdersCount, paidOrdersPreviousCount),
          registered: calculateTrend(registeredUsers, registeredPrevious)
        },
        regionalData: regionalData.map(region => ({
          region: region.region,
          count: region._count.region
        })),
        // Add formatted versions for display
        formatted: {
          earnings: formatCurrency(earnings),
          visits: formatNumber(visits),
          orders: formatNumber(paidOrdersCount),
          registered: formatNumber(registeredUsers)
        },
        // Enhanced debugging info
        _debug: {
          totalOrders: allOrdersCount,
          paidOrders: paidOrdersCount,
          paidStatuses: paidStatuses,
          paidTransactionsFound: paidTransactions.length,
          paidTransactionsSample: paidTransactions.slice(0, 5),
          allStatusesFound: uniqueStatuses, // This will show you what statuses actually exist
          allTransactionsSample: allTransactions.slice(0, 10), // Sample of all transactions
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          }
        }
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