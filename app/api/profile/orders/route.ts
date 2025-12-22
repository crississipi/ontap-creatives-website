import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { clientID: number };
    
    // Get user orders
    const orders = await prisma.transaction.findMany({
      where: { clientID: decoded.clientID },
      include: {
        product: {
          select: {
            name: true,
            imgUrl: true
          }
        },
        tracking: {
          select: {
            status: true
          }
        }
      },
      orderBy: { dateOrdered: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.transactionID,
      date: new Date(order.dateOrdered).toLocaleDateString('en-US'),
      items: order.quantity || 1,
      total: order.subtotal,
      status: order.status,
      productName: order.product?.name || 'N/A',
      productImage: order.product?.imgUrl || null
    }));

    return NextResponse.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
