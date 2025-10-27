// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyAndDeleteOtp } from '@/lib/otpStore'
import { corsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('🔍 Reset password request for:', email, 'with OTP:', otp)

    // Verify OTP first (this will delete it if valid)
    const otpResult = await verifyAndDeleteOtp(email, otp)
    if (!otpResult.isValid) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if user exists
    const user = await prisma.client.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await prisma.client.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log('✅ Password reset successfully for:', email)

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}