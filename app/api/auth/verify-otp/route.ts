// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpWithoutDelete } from '@/lib/otpStore'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const result = await verifyOtpWithoutDelete(email, otp)

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}