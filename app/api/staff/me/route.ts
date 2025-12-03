import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to extract and verify JWT from cookies
function getStaffIdFromRequest(request: NextRequest): number | null {
  try {
    console.log('Checking for staff auth token...');
    
    // Get token from cookie
    const token = request.cookies.get('staff-auth-token')?.value;
    
    if (!token) {
      console.log('No staff-auth-token cookie found');
      
      // Also check for regular auth-token (common mistake)
      const userToken = request.cookies.get('auth-token')?.value;
      if (userToken) {
        console.log('Found auth-token (user token) instead of staff-auth-token');
      }
      
      return null;
    }

    console.log('Token found (first 20 chars):', token.substring(0, 20) + '...');
    
    // Try multiple secrets in order
    const secrets = [
      process.env.STAFF_JWT_SECRET,
      process.env.JWT_SECRET,
      'staff-secret-key-change-in-production' // Fallback for development
    ].filter(Boolean) as string[];
    
    console.log('Trying secrets:', secrets.map(s => s ? 'Set' : 'Not set'));

    let decoded: any = null;
    
    for (const secret of secrets) {
      try {
        console.log('Trying secret:', secret ? 'Present' : 'Missing');
        decoded = jwt.verify(token, secret);
        if (decoded) {
          console.log('Token verified with secret');
          break;
        }
      } catch (err: any) {
        console.log('Secret failed:', err.message);
        continue;
      }
    }
    
    if (!decoded) {
      console.log('All secrets failed to verify token');
      return null;
    }

    console.log('Token decoded:', decoded);
    
    // Return staffID
    return decoded.staffID || null;
    
  } catch (error: any) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

export async function GET(request: NextRequest) {
  console.log('=== /api/staff/me called ===');
  
  try {
    const staffId = getStaffIdFromRequest(request);

    if (!staffId) {
      console.log('No valid staff ID found, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized - No valid token' }, 
        { status: 401 }
      );
    }

    console.log('Fetching staff with ID:', staffId);

    const staff = await prisma.staff.findUnique({
      where: { staffID: staffId },
      select: {
        staffID: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        birthday: true,
        role: true,
        viewDashboard: true,
        viewOrders: true,
        viewClients: true,
        viewAffiliates: true,
        addProducts: true,
        changeContent: true,
        addOffers: true,
        dateAdded: true,
      },
    });

    if (!staff) {
      console.log('Staff not found in database for ID:', staffId);
      return NextResponse.json(
        { error: 'Staff not found' }, 
        { status: 404 }
      );
    }

    console.log('Staff found:', staff.email, staff.role);
    
    return NextResponse.json(staff, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching staff profile:', error.message);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}