import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to extract and verify JWT from cookies for staff
function getStaffIdFromRequest(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('staff-auth-token')?.value;
    if (!token) {
      console.log('Staff auth token not found');
      return null;
    }

    const secret = process.env.STAFF_JWT_SECRET || process.env.JWT_SECRET || 'staff-secret';
    const decoded: any = jwt.verify(token, secret);
    return decoded?.staffID;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// GET - Fetch current staff's profile
export async function GET(request: NextRequest) {
  const staffId = getStaffIdFromRequest(request);

  if (!staffId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const staff = await prisma.staff.findUnique({
      where: { staffID: staffId },
      select: {
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
      },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update current staff's profile
export async function PUT(request: NextRequest) {
  const staffId = getStaffIdFromRequest(request);

  if (!staffId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, email, age, birthday } = await request.json();

    // Basic validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 });
    }
    
    // Birthday needs to be in ISO format for Prisma
    const birthdayDate = birthday ? new Date(birthday) : null;
    if (birthdayDate && isNaN(birthdayDate.getTime())) {
        return NextResponse.json({ error: 'Invalid birthday format.' }, { status: 400 });
    }

    const updatedStaff = await prisma.staff.update({
      where: { staffID: staffId },
      data: {
        firstName,
        lastName,
        email,
        age: age ? parseInt(age, 10) : null,
        birthday: birthdayDate,
      },
    });

    return NextResponse.json(updatedStaff, { status: 200 });
  } catch (error) {
    console.error('Error updating staff profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
