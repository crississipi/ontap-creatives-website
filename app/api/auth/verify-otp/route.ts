// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpWithoutDelete } from '@/lib/otpStore'
import { corsHeaders } from '@/lib/corsHeaders'

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('🔍 Verifying OTP for email:', email, 'OTP:', otp)

    const result = await verifyOtpWithoutDelete(email, otp)

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}