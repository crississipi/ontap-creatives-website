import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getCorsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null;
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Also check Authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7);
        try {
          const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
          const decoded = jwt.verify(bearerToken, secret) as { userId: number };
          
          const user = await prisma.client.findUnique({
            where: { clientID: decoded.userId },
            select: {
              clientID: true,
              clientName: true,
              email: true,
              contactNumber: true,
              address: true,
              emailVerified: true,
            }
          });

          if (!user) {
            return NextResponse.json({ user: null }, { status: 200, headers: getCorsHeaders(origin) });
          }

          return NextResponse.json({ user }, { status: 200, headers: getCorsHeaders(origin) });
        } catch (error) {
          return NextResponse.json({ user: null }, { status: 200, headers: getCorsHeaders(origin) });
        }
      }
      return NextResponse.json({ user: null }, { status: 200, headers: getCorsHeaders(origin) });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret) as { userId: number };
    
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.userId },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true,
        emailVerified: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200, headers: getCorsHeaders(origin) });
    }

    return NextResponse.json({ user }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error('Error fetching user:', error);
    const origin = request.headers.get('origin') || null;
    return NextResponse.json({ user: null }, { status: 200, headers: getCorsHeaders(origin) });
  }
}