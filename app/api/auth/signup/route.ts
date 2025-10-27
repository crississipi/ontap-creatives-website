// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { corsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    // headers: corsHeaders
  })
}

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
        { 
          status: 400,
          // headers: corsHeaders
        }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Handle optional contact number - fix the error here
    const contactNumber = contact ? contact.replace(/\D/g, '') : ''

    // Create user
    const user = await prisma.client.create({
      data: {
        clientName: name,
        email,
        contactNumber: contactNumber, // Use the safely processed contact number
        address: '',
        password: hashedPassword,
        adsAgree: false
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { 
        status: 201,
        // headers: corsHeaders
      }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        // headers: corsHeaders
      }
    )
  }
}