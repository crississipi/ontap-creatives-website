import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to get user from token (same as before)
async function getAuthenticatedUser() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      const cookieHeader = headersList.get('cookie')
      const authCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('auth-token='))
      const tokenFromCookie = authCookie?.split('=')[1]
      
      if (!tokenFromCookie) {
        return null
      }
      
      const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET!) as { userId: number }
      const user = await prisma.client.findUnique({
        where: { clientID: decoded.userId }
      })
      return user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.userId }
    })
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

interface DirectOrderRequest {
  contactInfo: {
    firstName: string
    lastName: string
    companyName?: string
    contactNumber: string
    email: string
  }
  shippingInfo: {
    method: 'pickup' | 'delivery'
    address?: {
      house: string
      barangay: string
      city: string
      region: string
      zipCode: string
    }
  }
  paymentInfo: {
    method: 'cod' | 'card' | 'ewallet' | 'bank'
  }
  product: {
    productID: number
    name: string
    price: number
    quantity: number
    logo: string
    subtotal: number
  }
  totals: {
    subtotal: number
    shippingFee: number
    discount: number
    total: number
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 DIRECT ORDER API CALLED');
  
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: DirectOrderRequest = await request.json();
    
    console.log('📦 Direct order request:', body);

    // Generate unique IDs
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 12);
    const sharedTransactionID = `TXN-${timestamp}-${randomSuffix}`;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create billing record
      const billing = await tx.billing.create({
        data: {
          mode: body.paymentInfo.method.toUpperCase(),
          referenceNo: `REF-${timestamp}-${Math.random().toString(36).substr(2, 8)}`,
          sender: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
          receiver: 'Burnbox Printing',
          amount: body.totals.total,
          dateAdded: new Date()
        }
      });

      // 2. Create tracking record
      const tracking = await tx.tracking.create({
        data: {
          status: 'Order Placed',
          info: `You purchased ${body.product.quantity} ${body.product.quantity === 1 ? 'item' : 'items'}`,
          time: new Date(),
          date: new Date()
        }
      });

      // 3. Create a temporary cart item for the order
      const cartItem = await tx.cart.create({
        data: {
          productID: body.product.productID,
          clientID: user.clientID,
          quantity: body.product.quantity,
          subtotal: body.product.subtotal,
          status: 'ordered', // Mark as ordered immediately
          logo: body.product.logo || 'Default'
        }
      });

      // 4. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionID: sharedTransactionID,
          shipMethod: body.shippingInfo.method,
          subtotal: body.product.subtotal,
          dateOrdered: new Date(),
          cart: {
            connect: { cartID: cartItem.cartID }
          },
          billing: {
            connect: { billingID: billing.billingID }
          },
          client: {
            connect: { clientID: user.clientID }
          },
          tracking: {
            connect: { trackingID: tracking.trackingID }
          }
        }
      });

      return {
        transaction,
        billing,
        tracking,
        cartItem,
        transactionId: sharedTransactionID
      }
    });

    console.log('✅ Direct order completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      transactionId: result.transactionId,
      orderId: result.transaction.orderID
    });

  } catch (error: any) {
    console.error('❌ Direct order error:', error);
    
    return NextResponse.json(
      { error: 'Failed to place order: ' + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}