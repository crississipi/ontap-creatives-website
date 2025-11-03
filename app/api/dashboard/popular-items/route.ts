// app/api/analytics/popular-items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BarChartItem {
  name: string
  quantitySold: number  // Total quantity sold
  uniqueBuyers: number  // Number of individual buyers
  productID: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '1')
    const filterType = searchParams.get('filter') || 'today' // Optional: pass filter type
    const limit = parseInt(searchParams.get('limit') || '8')

    const sinceDate = new Date()
    
    if (filterType === 'yesterday') {
      sinceDate.setDate(sinceDate.getDate() - 1)
      sinceDate.setHours(0, 0, 0, 0) // Start of yesterday
    } else {
      sinceDate.setDate(sinceDate.getDate() - days)
    }

    // Get product order statistics with optimized query
    const productStats = await prisma.cart.groupBy({
      by: ['productID'],
      where: {
        transactions: {
          some: {
            dateOrdered: {
              gte: sinceDate
            }
          }
        }
      },
      _sum: {
        quantity: true
      },
      _count: {
        clientID: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    })

    // Get product names
    const productDetails = await prisma.products.findMany({
      where: {
        productID: {
          in: productStats.map(stat => stat.productID)
        }
      },
      select: {
        productID: true,
        name: true
      }
    })

    // Create a map for quick lookup
    const productMap = new Map(productDetails.map(p => [p.productID, p.name]))
    
    // Process data for bar chart
    const barChartData: BarChartItem[] = productStats.map(stat => {
      const productName = productMap.get(stat.productID) || `Product ${stat.productID}`
      
      return {
        name: productName.length > 20 ? `${productName.substring(0, 20)}...` : productName,
        quantitySold: stat._sum.quantity || 0,
        uniqueBuyers: stat._count.clientID,
        productID: stat.productID
      }
    })

    // If no data, return sample data
    if (barChartData.length === 0) {
      const sampleData: BarChartItem[] = [
        { name: 'Product 1', quantitySold: 1, uniqueBuyers: 1, productID: 0 },
        { name: 'Product 2', quantitySold: 1, uniqueBuyers: 1, productID: 0 }
      ]
      return NextResponse.json({ 
        data: sampleData, 
        message: 'No sales data available for the selected period'
      })
    }

    return NextResponse.json({ 
      data: barChartData,
      totalProducts: productStats.length,
      timeRange: `${days} days`,
      summary: {
        totalQuantitySold: barChartData.reduce((sum, item) => sum + item.quantitySold, 0),
        totalUniqueBuyers: new Set(productStats.flatMap(stat => stat._count)).size
      }
    })

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