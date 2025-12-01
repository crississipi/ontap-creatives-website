import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to extract and verify JWT from cookies for staff
function getStaffIdFromRequest(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('staff-auth-token')?.value;
    if (!token) return null;

    const secret = process.env.STAFF_JWT_SECRET || process.env.JWT_SECRET || 'staff-secret';
    const decoded: any = jwt.verify(token, secret);
    return decoded?.staffID;
  } catch {
    return null;
  }
}

// POST - Change staff password
export async function POST(request: NextRequest) {
  const staffId = getStaffIdFromRequest(request);

  if (!staffId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { newPassword, confirmPassword } = await request.json();

    if (!newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // Optional: Add password strength validation here
    if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.staff.update({
      where: { staffID: staffId },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing staff password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
