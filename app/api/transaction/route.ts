// app/api/transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getCorsHeaders } from '@/lib/corsHeaders';
import { JWT_SECRET } from '@/lib/auth';

const prisma = new PrismaClient();

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  logo: string;
  imgUrl: string;
  frontImg: string;
}

interface TrackingEvent {
  timestamp: string;
  title: string;
  description?: string;
}

interface Order {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: OrderItem[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  trackingEvents: TrackingEvent[];
}

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      // Also check cookies as fallback
      const cookieHeader = headersList.get('cookie')
      const authCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('auth-token='))
      const tokenFromCookie = authCookie?.split('=')[1]
      
      if (!tokenFromCookie) {
        return null
      }
      
      const decoded = jwt.verify(tokenFromCookie, JWT_SECRET) as { userId: number }
      const user = await prisma.client.findUnique({
        where: { clientID: decoded.userId }
      })
      return user
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.userId }
    })
    return user
  } catch (error) {
    return null
  }
}

export async function OPTIONS() {
  return new Response(null, {status: 200})
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getCorsHeaders(origin) });
    }

    // Fetch transactions with tracking data
    const transactions = await prisma.transaction.findMany({
      where: { clientID: user.clientID },
      include: {
        cart: {
          include: {
            product: true
          }
        },
        client: true,
        billing: true,
        voucher: true,
        tracking: true // Include tracking data
      },
      orderBy: {
        dateOrdered: 'desc'
      }
    });

    // Group transactions by transactionID to combine items from the same order
    const transactionGroups = new Map();
    
    transactions.forEach(transaction => {
      const group = transactionGroups.get(transaction.transactionID) || [];
      group.push(transaction);
      transactionGroups.set(transaction.transactionID, group);
    });

    // Transform data into order format
    const orders: Order[] = Array.from(transactionGroups.entries()).map(([transactionID, transactionGroup]) => {
      const firstTransaction = transactionGroup[0];
      
      // Calculate totals
      const itemsSubtotal = transactionGroup.reduce((sum: number, t: any) => sum + t.subtotal, 0);
      const discountAmount = firstTransaction.voucher ? (itemsSubtotal * firstTransaction.voucher.discount / 100) : 0;
      const shippingFee = firstTransaction.shipMethod === 'delivery' ? 250 : 0;
      const totalAmount = itemsSubtotal - discountAmount + shippingFee;

      // Determine status
      const status = determineOrderStatus(firstTransaction);

      // Get tracking events from database or generate default ones
      const trackingEvents = firstTransaction.tracking ? [
        {
          timestamp: firstTransaction.tracking.date.toISOString(),
          title: firstTransaction.tracking.status,
          description: firstTransaction.tracking.info
        }
      ] : [
        {
          timestamp: firstTransaction.dateOrdered.toISOString(),
          title: 'Order Placed',
          description: 'Your order has been received'
        }
      ];

      // Transform items
      const items: OrderItem[] = transactionGroup.map((t: any) => ({
        name: t.cart?.product?.name || 'Unknown Product',
        qty: t.cart?.quantity || 1,
        price: t.cart?.product?.price || 0,
        subtotal: t.subtotal || 0,
        logo: t.cart?.logo || 'Standard',
        imgUrl: t.cart?.product?.imgUrl || '',
        frontImg: t.cart?.product?.frontUrl || ''
      }));

      return {
        orderID: transactionID,
        customerName: firstTransaction.client?.clientName || 'Customer',
        companyName: firstTransaction.client?.companyName || '',
        contactNumber: firstTransaction.client?.contactNumber || '',
        email: firstTransaction.client?.email || '',
        deliveryAddress: firstTransaction.shipMethod === 'delivery' 
          ? (firstTransaction.client?.address || 'Address not specified')
          : 'Store Pickup - 17 Vatican City Dr, Las Piñas, 1740 Metro Manila',
        items: items,
        shippingMethod: firstTransaction.shipMethod,
        shippingFee: shippingFee,
        paymentMethod: firstTransaction.billing?.mode?.toLowerCase() || 'cod',
        discount: discountAmount,
        subtotal: itemsSubtotal,
        total: totalAmount,
        orderDate: firstTransaction.dateOrdered.toISOString(),
        status: status,
        trackingEvents: trackingEvents
      };
    });

    return NextResponse.json({ 
      success: true,
      orders 
    }, { headers: getCorsHeaders(origin) });

  } catch (error) {
    const origin = request.headers.get('origin') || null
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {status: 500, headers: getCorsHeaders(origin)}
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to determine order status
function determineOrderStatus(transaction: any): Order['status'] {
  // You can implement your actual status logic here
  // For now, using a simple time-based approach
  const orderDate = new Date(transaction.dateOrdered);
  const now = new Date();
  const daysSinceOrder = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceOrder < 1) return 'pending';
  if (daysSinceOrder < 3) return 'approved';
  if (daysSinceOrder < 7) return 'in_progress';
  return 'completed';
}

// Helper function to generate tracking events
function generateTrackingEvents(transaction: any, status: Order['status']): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const orderDate = new Date(transaction.dateOrdered);

  // Order placed
  events.push({
    timestamp: orderDate.toISOString(),
    title: 'Order Placed',
    description: 'Your order has been received'
  });

  // Add events based on status
  if (status !== 'pending') {
    events.push({
      timestamp: new Date(orderDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes later
      title: 'Order Confirmed',
      description: 'Your order has been confirmed'
    });
  }

  if (status === 'in_progress' || status === 'completed') {
    events.push({
      timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      title: 'Processing',
      description: 'Your order is being processed'
    });
  }

  if (status === 'completed') {
    events.push({
      timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day later
      title: 'Shipped',
      description: 'Your order has been shipped'
    });
    events.push({
      timestamp: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(), // 2 days later
      title: 'Delivered',
      description: 'Your order has been delivered'
    });
  }

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}