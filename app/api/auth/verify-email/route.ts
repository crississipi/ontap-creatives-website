import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAndDeleteOtp } from '@/lib/otpStore'
import { corsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

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

    console.log('🔍 Verifying email for:', email, 'OTP:', otp)

    // Verify OTP (this will delete it if valid)
    const otpResult = await verifyAndDeleteOtp(email, otp)
    if (!otpResult.isValid) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 400, headers: corsHeaders }
      )
    }

    // Update user as verified (you might want to add an 'emailVerified' field to your client model)
    // For now, we'll just mark the OTP as used and consider the email verified
    
    console.log('✅ Email verified successfully for:', email)

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}