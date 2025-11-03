import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'Today'
    const activityType = searchParams.get('activityType') || 'Orders'

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

    let activityData: ActivityData[] = []

    if (activityType === 'Orders') {
      activityData = await getOrdersData(startDate, endDate)
    } else {
      activityData = await getRegisteredUsersData(startDate, endDate)
    }

    return NextResponse.json({
      success: true,
      data: activityData
    }, { status: 200 })

  } catch (error) {
    console.error('Activity data error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch activity data' 
      },
      { status: 500 }
    )
  }
}

async function getOrdersData(startDate: Date, endDate: Date): Promise<ActivityData[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      dateOrdered: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      client: {
        select: {
          clientName: true,
          email: true,
          contactNumber: true,
          address: true
        }
      },
      cart: {
        select: {
          quantity: true,
          subtotal: true,
          status: true
        }
      }
    },
    orderBy: {
      dateOrdered: 'desc'
    },
    take: 10 // Limit to 10 most recent orders
  })

  return transactions.map(transaction => ({
    clientName: transaction.client.clientName || 'N/A',
    email: transaction.client.email,
    contact: transaction.client.contactNumber || 'N/A',
    date: transaction.dateOrdered.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    quantity: transaction.cart.quantity,
    total: transaction.cart.subtotal,
    status: transaction.cart.status,
    location: transaction.client.address ? 
      transaction.client.address.split(',')[0] : 'N/A' // Get first part of address
  }))
}

async function getRegisteredUsersData(startDate: Date, endDate: Date): Promise<ActivityData[]> {
  const clients = await prisma.client.findMany({
    where: {
      dateCreated: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      clientName: true,
      email: true,
      contactNumber: true,
      dateCreated: true,
      address: true
    },
    orderBy: {
      dateCreated: 'desc'
    },
    take: 10 // Limit to 10 most recent registrations
  })

  return clients.map(client => ({
    clientName: client.clientName || 'N/A',
    email: client.email,
    contact: client.contactNumber || 'N/A',
    date: client.dateCreated.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    location: client.address ? 
      client.address.split(',')[0] : 'N/A' // Get first part of address
  }))
}