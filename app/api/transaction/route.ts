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
    // Get authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view your orders.' },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('🔍 Fetching orders for user:', user.clientID, 'with filters:', { status, page, limit });

    // Build where clause based on status filter AND user ID
    const whereClause: any = {
      clientID: user.clientID // Only fetch orders for the authenticated user
    };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Fetch transactions with related data for the authenticated user only
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        cart: {
          include: {
            product: true
          }
        },
        client: true,
        billing: true,
        voucher: true
      },
      orderBy: {
        dateOrdered: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    console.log(`✅ Found ${transactions.length} transactions for user ${user.clientID}`);

    // Group transactions by transactionID
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

      // Determine status (you might want to add this field to your Transaction model)
      const status = determineOrderStatus(firstTransaction);

      // Generate tracking events based on status and dates
      const trackingEvents = generateTrackingEvents(firstTransaction, status);

      return {
        orderID: transactionID,
        customerName: firstTransaction.client.clientName || 'Customer',
        companyName: firstTransaction.client.clientName || '',
        contactNumber: firstTransaction.client.contactNumber || '',
        email: firstTransaction.client.email,
        deliveryAddress: firstTransaction.shipMethod === 'delivery' 
          ? (firstTransaction.client.address || 'Address not specified')
          : 'Store Pickup - 17 Vatican City Dr, Las Piñas, 1740 Metro Manila',
        items: transactionGroup.map((t: any) => ({
          name: t.cart.product.name,
          qty: t.cart.quantity,
          price: t.cart.product.price,
          subtotal: t.subtotal,
          logo: t.cart.logo,
          imgUrl: t.cart.product.imgUrl || '',
          frontImg: t.cart.product.frontUrl || ''
        })),
        shippingMethod: firstTransaction.shipMethod,
        shippingFee: shippingFee,
        paymentMethod: firstTransaction.billing.mode.toLowerCase(),
        discount: discountAmount,
        subtotal: itemsSubtotal,
        total: totalAmount,
        orderDate: firstTransaction.dateOrdered.toISOString(),
        status: status,
        trackingEvents: trackingEvents
      };
    });

    // Get total count for pagination (only count user's orders)
    const totalCount = await prisma.transaction.count({
      where: {
        clientID: user.clientID,
        ...(status && status !== 'all' && { status: status })
      }
    });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  } finally {
    await prisma.$disconnect();
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