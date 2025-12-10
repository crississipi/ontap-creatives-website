import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCorsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const { productID, clientID, quantity, subtotal, logo } = await request.json()

    // Validate required fields
    if (!productID || !clientID || !quantity || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: productID, clientID, quantity, and subtotal are required' },
        { status: 400, headers: getCorsHeaders(origin) }
      )
    }

    // Check if the product exists
    const product = await prisma.products.findUnique({
      where: { productID }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      )
    }

    // Check if the client exists
    const client = await prisma.client.findUnique({
      where: { clientID }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      )
    }

    // Check if the product is already in the client's cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        productID,
        clientID,
        status: 'onCart',
        logo: logo || 'Default'
      }
    })

    let cartItem

    if (existingCartItem) {
      // Update existing cart item
      cartItem = await prisma.cart.update({
        where: { cartID: existingCartItem.cartID },
        data: {
          quantity: existingCartItem.quantity + quantity,
          subtotal: existingCartItem.subtotal + subtotal
        },
        include: {
          product: {
            select: {
              name: true,
              price: true,
              imgUrl: true
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cart.create({
        data: {
          productID,
          clientID,
          quantity,
          subtotal,
          status: 'onCart',
          logo: logo || 'Default'
        },
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
    }

    return NextResponse.json(
      { 
        message: existingCartItem ? 'Cart item updated successfully' : 'Item added to cart successfully',
        cartItem 
      },
      { status: 200, headers: getCorsHeaders(origin) }
    )

  } catch (error) {
    const origin = request.headers.get('origin') || null
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getCorsHeaders(origin) }
    )
  }
}