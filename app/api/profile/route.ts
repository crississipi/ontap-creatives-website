import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { clientID: number };
    
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.clientID },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true,
        profileImage: true,
        coverImage: true,
        emailVerified: true,
        referredBy: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is an affiliate
    const affiliate = await prisma.affiliate?.findUnique({
      where: { clientID: user.clientID }
    }).catch(() => null);

    return NextResponse.json({
      ...user,
      isAffiliate: !!affiliate,
      affiliateCode: affiliate?.affiliateCode || null
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { clientID: number };
    const { clientName, email, contactNumber, address } = await request.json();

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.client.findFirst({
        where: {
          email,
          clientID: { not: decoded.clientID }
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.client.update({
      where: { clientID: decoded.clientID },
      data: {
        clientName: clientName || null,
        email: email || undefined,
        contactNumber: contactNumber || null,
        address: address || null,
      },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true,
        profileImage: true,
        coverImage: true,
        emailVerified: true,
      }
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { clientID: number };
    const { confirmation, keepUpdated } = await request.json();

    if (confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 });
    }

    // If keepUpdated is true, store email in newsletter before deletion
    if (keepUpdated) {
      const user = await prisma.client.findUnique({
        where: { clientID: decoded.clientID },
        select: { email: true }
      });

      if (user?.email) {
        await prisma.newsletter.upsert({
          where: { email: user.email },
          update: { isActive: true },
          create: {
            email: user.email,
            isActive: true,
          }
        }).catch(() => {
          // Ignore errors if newsletter table doesn't exist
        });
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.client.delete({
      where: { clientID: decoded.clientID }
    });

    const response = NextResponse.json({ 
      message: 'Account deleted successfully' 
    });

    // Clear the auth cookie
    response.cookies.set('token', '', { maxAge: 0 });

    return response;

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
