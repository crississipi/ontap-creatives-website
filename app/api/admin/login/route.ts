import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import {
  normalizeRole,
  StaffRole,
  ALWAYS_ALLOWED_ROLES,
} from '@/constants/staffRoles';

const prisma = new PrismaClient();
const STAFF_SESSION_DURATION_S = 30 * 24 * 60 * 60; // 30 days

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const staff = await prisma.staff.findFirst({
      where: { email },
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const normalizedRole = normalizeRole(staff.role);
    if (!normalizedRole) {
      return NextResponse.json(
        { error: 'Unauthorized role.' },
        { status: 403 },
      );
    }

    // if (!ALWAYS_ALLOWED_ROLES.includes(normalizedRole)) {
    //   return NextResponse.json(
    //     { error: 'Access restricted to administrators.' },
    //     { status: 403 },
    //   );
    // }

    let passwordMatches = false;

    if (staff.password) {
      passwordMatches = await bcrypt.compare(password, staff.password);
    } else {
      const legacyPassword = `${staff.firstName}_${staff.role}`;
      if (password === legacyPassword) {
        passwordMatches = true;
        const hashedLegacy = await bcrypt.hash(password, 10);
        await prisma.staff.update({
          where: { staffID: staff.staffID },
          data: { password: hashedLegacy },
        });
      }
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const tokenPayload = {
      staffID: staff.staffID,
      email: staff.email,
      role: normalizedRole,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.STAFF_JWT_SECRET || process.env.JWT_SECRET || 'staff-secret',
      { expiresIn: STAFF_SESSION_DURATION_S },
    );

    const response = NextResponse.json(
      {
        message: 'Staff login successful.',
        staff: {
          staffID: staff.staffID,
          email: staff.email,
          role: normalizedRole,
          firstName: staff.firstName,
          lastName: staff.lastName,
        },
      },
      { status: 200 },
    );

    response.cookies.set('staff-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: STAFF_SESSION_DURATION_S,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}

