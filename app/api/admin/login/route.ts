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
    console.log('Admin login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const staff = await prisma.staff.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!staff) {
      console.log('No staff found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    console.log('Staff found:', staff.staffID, staff.email, staff.role);

    const normalizedRole = normalizeRole(staff.role);
    if (!normalizedRole) {
      console.log('Invalid role:', staff.role);
      return NextResponse.json(
        { error: 'Unauthorized role.' },
        { status: 403 },
      );
    }

    let passwordMatches = false;

    if (staff.password) {
      passwordMatches = await bcrypt.compare(password, staff.password);
      console.log('Password match (hashed):', passwordMatches);
    } else {
      const legacyPassword = `${staff.firstName}_${staff.role}`;
      console.log('Trying legacy password:', legacyPassword);
      if (password === legacyPassword) {
        passwordMatches = true;
        const hashedLegacy = await bcrypt.hash(password, 10);
        await prisma.staff.update({
          where: { staffID: staff.staffID },
          data: { password: hashedLegacy },
        });
        console.log('Legacy password matched and updated');
      }
    }

    if (!passwordMatches) {
      console.log('Password does not match');
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const tokenPayload = {
      staffID: staff.staffID,
      email: staff.email,
      role: normalizedRole,
      firstName: staff.firstName,
      lastName: staff.lastName,
    };

    // Get JWT secret - FIXED: Use STAFF_JWT_SECRET
    const JWT_SECRET = process.env.STAFF_JWT_SECRET || process.env.JWT_SECRET || 'staff-secret-key-change-in-production';
    
    console.log('Using JWT secret:', JWT_SECRET ? 'Set' : 'Not set');
    console.log('Token payload:', tokenPayload);

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: STAFF_SESSION_DURATION_S },
    );

    console.log('Token generated successfully');

    // Get domain for cookie settings
    const isProduction = process.env.NODE_ENV === 'production';
    const host = request.headers.get('host') || '';
    const origin = request.headers.get('origin') || '';
    
    console.log('Host:', host, 'Origin:', origin, 'Production:', isProduction);

    // Determine domain for cookies
    let domain: string | undefined;
    if (isProduction) {
      if (host.includes('ontap-creatives-website.vercel.app') || origin.includes('ontap-creatives-website.vercel.app')) {
        domain = '.ontap-creatives-website.vercel.app';
      } else if (host.includes('ontap.ph') || origin.includes('ontap.ph')) {
        domain = '.ontap.ph';
      }
    }

    console.log('Cookie domain:', domain || 'localhost');

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

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'staff-auth-token',
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: STAFF_SESSION_DURATION_S,
      path: '/',
      domain: domain,
    });

    // Also set a client-readable cookie
    response.cookies.set({
      name: 'staff-session',
      value: JSON.stringify({
        staffID: staff.staffID,
        email: staff.email,
        role: normalizedRole,
        firstName: staff.firstName,
        lastName: staff.lastName,
        isLoggedIn: true,
      }),
      secure: isProduction,
      sameSite: 'lax',
      maxAge: STAFF_SESSION_DURATION_S,
      path: '/',
      domain: domain,
    });

    console.log('Cookies set successfully');

    return response;
  } catch (error: any) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 },
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}