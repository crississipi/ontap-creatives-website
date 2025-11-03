// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
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
    })
  } catch (error) {
    // console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}