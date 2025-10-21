// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, contact, password } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.client.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.client.create({
      data: {
        clientName: name,
        email,
        contactNumber: contact.replace(/\D/g, '') || '',
        address: '',
        password: hashedPassword,
        adsAgree: false
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}