// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCorsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const products = await prisma.products.findMany({
      orderBy: {
        dateAdded: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        ...product,
        // Make sure to include ALL fields that your frontend needs
        price: {
          ontap: product.price,
          custom: product.customPrice || product.price
        },
        // Include the category field
        category: product.category || 'Uncategorized' // Add fallback
      }))
    }, { headers: getCorsHeaders(origin) })
  } catch (error) {
    // console.error('Failed to fetch products:', error)
    const origin = request.headers.get('origin') || null
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500, headers: getCorsHeaders(origin) }
    )
  }
}