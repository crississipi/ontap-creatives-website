import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, contactNumber, address, password, confirmPassword } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.client.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Handle optional contact number
    const cleanContactNumber = contactNumber ? contactNumber.replace(/\D/g, '').slice(0, 20) : null

    // Create user
    const user = await prisma.client.create({
      data: {
        clientName: name.trim(),
        email: email.toLowerCase().trim(),
        contactNumber: cleanContactNumber,
        address: address?.trim() || '',
        password: hashedPassword,
        adsAgree: false,
        emailVerified: false
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Send verification email request
    try {
      const verificationResponse = await fetch(`${request.nextUrl.origin}/api/email-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.clientName,
        }),
      });

      if (!verificationResponse.ok) {
        console.warn('Failed to send verification email, but user was created');
      }
    } catch (emailError) {
      console.warn('Error sending verification email:', emailError);
    }

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.', 
        user: userWithoutPassword,
        requiresVerification: true
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}