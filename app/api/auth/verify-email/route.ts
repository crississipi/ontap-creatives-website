// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAndDeleteOtp } from '@/lib/otpStore'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Verify OTP (this will delete it if valid)
    const otpResult = await verifyAndDeleteOtp(email, otp)
    if (!otpResult.isValid) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}