import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productID: string }> }
) {
  try {
    // Await the params Promise
    const { productID } = await params
    const productIdNumber = parseInt(productID)

    // Validate productID
    if (isNaN(productIdNumber)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check if product exists and get feedback count
    const productWithFeedbacks = await prisma.products.findUnique({
      where: {
        productID: productIdNumber
      },
      include: {
        feedbacks: {
          select: {
            feedbackID: true,
            rate: true,
            comment: true,
            dateAdded: true,
            client: {
              select: {
                clientName: true
              }
            }
          },
          orderBy: {
            dateAdded: 'desc'
          }
        }
      }
    })

    if (!productWithFeedbacks) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const hasFeedbacks = productWithFeedbacks.feedbacks.length > 0
    const feedbackCount = productWithFeedbacks.feedbacks.length

    return NextResponse.json({ 
      hasFeedbacks,
      feedbackCount,
      feedbacks: productWithFeedbacks.feedbacks
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}