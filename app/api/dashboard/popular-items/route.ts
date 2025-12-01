// app/api/dashboard/popular-items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface BarChartItem {
  name: string
  quantitySold: number  // Total quantity sold
  uniqueBuyers: number  // Number of individual buyers
  productID: number
}

// Helper to extract and verify JWT from cookies
function getUserIdFromRequest(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    return decoded?.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7', 10)
    const isYesterday = searchParams.get('isYesterday') === 'true'
    const limit = parseInt(searchParams.get('limit') || '8', 10)

    // Calculate the date range
    const now = new Date()
    now.setHours(23, 59, 59, 999) // End of today

    let startDate: Date
    let endDate: Date = new Date(now)

    if (isYesterday) {
      // Yesterday: from 00:00 to 23:59 of yesterday
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
    } else if (days === 1) {
      // Today: from 00:00 to now
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      endDate = new Date(now)
    } else {
      // Last N days
      startDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
      startDate.setHours(0, 0, 0, 0)
    }

    // Fetch transactions for the logged-in client within the date range
    const transactions = await prisma.transaction.findMany({
      where: {
        clientID: userId,
        dateOrdered: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        product: {
          select: {
            productID: true,
            name: true
          }
        }
      }
    })

    // Group by product and aggregate
    const itemMap = new Map<number, { name: string; quantitySold: number; uniqueBuyers: Set<number> }>()

    for (const transaction of transactions) {
      if (!transaction.product) continue

      const productId = transaction.product.productID
      const quantity = transaction.quantity || 1

      if (itemMap.has(productId)) {
        const item = itemMap.get(productId)!
        item.quantitySold += quantity
      } else {
        itemMap.set(productId, {
          name: transaction.product.name,
          quantitySold: quantity,
          uniqueBuyers: new Set<number>()
        })
      }
    }

    // Convert to array and sort by quantity sold
    const popularItems: BarChartItem[] = Array.from(itemMap.entries())
      .map(([productId, item]) => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        quantitySold: item.quantitySold,
        uniqueBuyers: item.uniqueBuyers.size,
        productID: productId
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit)

    // If no data, return empty array
    if (popularItems.length === 0) {
      return NextResponse.json({ 
        data: [],
        message: 'No sales data available for the selected period'
      })
    }

    return NextResponse.json({ 
      data: popularItems,
      totalProducts: popularItems.length,
      summary: {
        totalQuantitySold: popularItems.reduce((sum, item) => sum + item.quantitySold, 0)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching popular items:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch popular items data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}