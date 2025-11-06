import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pendingUpdates = new Map<number, NodeJS.Timeout>()

export async function PUT(request: NextRequest) {
  try {
    const { cartID, quantity, subtotal } = await request.json()

    // Validate required fields
    if (!cartID || quantity === undefined || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: cartID, quantity, and subtotal are required' },
        { status: 400 }
      )
    }

    // Cancel any pending update for this cart item
    if (pendingUpdates.has(cartID)) {
      clearTimeout(pendingUpdates.get(cartID))
      pendingUpdates.delete(cartID)
    }

    // Create a promise that resolves after 10 seconds
    const updatePromise = new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        try {
          const updatedCartItem = await prisma.cart.update({
            where: { cartID },
            data: {
              quantity,
              subtotal
            },
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          })

          pendingUpdates.delete(cartID)
          resolve(updatedCartItem)
        } catch (error) {
          // console.error('Database update error:', error)
          pendingUpdates.delete(cartID)
          resolve(null)
        }
      }, 10000)

      pendingUpdates.set(cartID, timeoutId)
    })

    return NextResponse.json(
      { 
        message: 'Quantity update scheduled', 
        cartID,
        scheduled: true
      },
      { status: 202 }
    )

  } catch (error) {
    // console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

process.on('SIGTERM', () => {
  for (const timeoutId of pendingUpdates.values()) {
    clearTimeout(timeoutId)
  }
  pendingUpdates.clear()
})