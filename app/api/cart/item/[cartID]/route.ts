import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cartID: string }> }
) {
  try {
    // Await the params Promise
    const { cartID } = await params
    const cartIdNumber = parseInt(cartID)

    // Validate cartID
    if (isNaN(cartIdNumber)) {
      return NextResponse.json(
        { error: 'Invalid cart ID' },
        { status: 400 }
      )
    }

    // Check if cart item exists
    const existingCartItem = await prisma.cart.findUnique({
      where: { cartID: cartIdNumber }
    })

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Delete the cart item
    await prisma.cart.delete({
      where: { cartID: cartIdNumber }
    })

    return NextResponse.json(
      { message: 'Item removed from cart successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET for individual cart items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cartID: string }> }
) {
  try {
    // Await the params Promise
    const { cartID } = await params
    const cartIdNumber = parseInt(cartID)

    if (isNaN(cartIdNumber)) {
      return NextResponse.json(
        { error: 'Invalid cart ID' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cart.findUnique({
      where: { cartID: cartIdNumber },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            imgUrl: true,
            frontUrl: true,
          }
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ cartItem }, { status: 200 })
    
  } catch (error) {
    console.error('Get cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}