// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: NextRequest) {
  try {
    const { name, email, contactNumber, address, password, confirmPassword } = await request.json()

    console.log('🔍 Signup request received:', { name, email, contactNumber, address, passwordLength: password?.length })

    // Validate required fields
    if (!name || !email || !password) {
      console.log('🔍 Missing required fields:', { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('🔍 Invalid email format:', email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      console.log('🔍 Password too short:', password.length)
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate password confirmation (if provided)
    if (confirmPassword && password !== confirmPassword) {
      console.log('🔍 Passwords do not match')
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking for existing user:', email)

    // Check if user already exists
    const existingUser = await prisma.client.findUnique({
      where: { email: email.toLowerCase().trim() }
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

    // Handle optional contact number - clean it up
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
        emailVerified: false // Explicitly set to false for new users
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