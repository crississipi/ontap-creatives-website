import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { clientID: string } }
) {
  try {
    const clientID = parseInt(params.clientID)

    // Validate clientID
    if (isNaN(clientID)) {
      return NextResponse.json(
        { error: 'Invalid client ID' },
        { status: 400 }
      )
    }

    const cartItems = await prisma.cart.findMany({
      where: {
        clientID,
        status: 'onCart'
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            customPrice: true,
            imgUrl: true,
            frontUrl: true,
          }
        }
      },
      orderBy: {
        dateAdded: 'desc'
      }
    })
    return NextResponse.json({ cartItems }, { status: 200 })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}