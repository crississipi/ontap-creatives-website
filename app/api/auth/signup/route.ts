// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Use a singleton pattern for Prisma to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: NextRequest) {
  try {
    const { name, email, contact, password } = await request.json()

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

    console.log('🔍 Checking for existing user:', email)

    // Check if user already exists
    const existingUser = await prisma.client.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('🔍 User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    console.log('🔍 Creating new user:', email)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Handle optional contact number
    const contactNumber = contact ? contact.replace(/\D/g, '') : null

    // Create user
    const user = await prisma.client.create({
      data: {
        clientName: name.trim(),
        email: email.toLowerCase().trim(),
        contactNumber: contactNumber,
        address: '',
        password: hashedPassword,
        adsAgree: false
      }
    })

    console.log('🔍 User created successfully:', user.email)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('🔍 Signup error:', error)
    
    // Handle specific Prisma errors
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
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}