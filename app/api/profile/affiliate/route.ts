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
    
    // Get affiliate data
    const affiliate = await prisma.affiliate?.findUnique({
      where: { clientID: decoded.clientID }
    }).catch(() => null);

    if (!affiliate) {
      return NextResponse.json({ error: 'User is not an affiliate' }, { status: 404 });
    }

    // Get referred clients
    const referredClients = await prisma.client.findMany({
      where: { referredBy: affiliate.affiliateCode },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        dateCreated: true,
      },
      orderBy: { dateCreated: 'desc' }
    });

    // Calculate stats
    const stats = {
      totalEarnings: affiliate.totalEarnings || 0,
      pendingPayout: 0, // Calculate based on your business logic
      totalReferrals: referredClients.length,
      conversionRate: referredClients.length > 0 
        ? ((referredClients.length / 100) * 100).toFixed(1) + '%' 
        : '0%'
    };

    const referrals = referredClients.map(client => ({
      id: client.clientID,
      clientName: client.clientName || 'N/A',
      date: new Date(client.dateCreated).toLocaleDateString('en-US'),
      status: 'Active', // You can add actual status logic
      commission: 150.00 // Calculate based on your business logic
    }));

    return NextResponse.json({
      affiliateCode: affiliate.affiliateCode,
      stats,
      referrals
    });

  } catch (error) {
    console.error('Error fetching affiliate data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
