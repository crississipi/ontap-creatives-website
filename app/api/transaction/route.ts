import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { corsHeaders } from '@/lib/corsHeaders';

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

interface TrackingEvent {
  timestamp: string;
  title: string;
  description?: string;
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

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  })
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Transform data to include tracking events
    const orders = transactions.map(transaction => ({
      // ... other order data ...
      trackingEvents: transaction.tracking ? [
        {
          timestamp: transaction.tracking.date.toISOString(),
          title: transaction.tracking.status,
          description: transaction.tracking.info
        }
      ] : [
        {
          timestamp: transaction.dateOrdered.toISOString(),
          title: 'Order Placed',
          description: 'Your order has been received'
        }
      ]
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to determine order status
function determineOrderStatus(transaction: any): Order['status'] {
  // You'll need to implement your actual status logic here
  // This is a simplified example - adjust based on your business logic
  
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