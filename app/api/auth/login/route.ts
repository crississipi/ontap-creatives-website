import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { JWT_SECRET } from '@/lib/auth';

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.client.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.toString())

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please verify your email before logging in'
        },
        { status: 403 }
      )
    }

    // Create JWT token with 30 days expiry
    const token = jwt.sign(
      { 
        userId: user.clientID,
        email: user.email,
        name: user.clientName 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        user: userWithoutPassword 
      },
      { status: 200 }
    )

    // Determine domain based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const host = request.headers.get('host') || '';
    
    // For Vercel deployments, use the proper domain
    let domain: string | undefined;
    if (isProduction) {
      if (host.includes('ontap-creatives-website.vercel.app')) {
        domain = '.ontap-creatives-website.vercel.app';
      } else if (host.includes('ontap.ph')) {
        domain = '.ontap.ph';
      }
      // For other production domains, add them here
    }

    // Set HTTP-only cookie with proper configuration
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: isProduction, // true in production, false in localhost
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
      domain: domain, // Only set domain in production
    });

    // Also set a non-httpOnly cookie for client-side access
    response.cookies.set({
      name: 'user-session',
      value: JSON.stringify({
        userId: user.clientID,
        email: user.email,
        name: user.clientName,
        isLoggedIn: true
      }),
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      domain: domain,
    });

    console.log('Login successful for user:', user.email);
    console.log('Cookie domain set to:', domain || 'localhost (development)');

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}