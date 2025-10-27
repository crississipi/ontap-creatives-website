// lib/otpStore.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database
export async function storeOtp(email: string, otp: string, expiresInMinutes = 10): Promise<void> {
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  
  // Delete any existing OTP for this email
  await prisma.otp.deleteMany({
    where: { email }
  })

  // Store new OTP
  await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt,
    }
  })
}

// Verify OTP without deleting it (for the verify step)
export async function verifyOtpWithoutDelete(email: string, otp: string): Promise<{ isValid: boolean; message: string }> {
  try {
    const record = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    })

    if (!record) {
      return { isValid: false, message: 'No OTP requested for this email' }
    }

    if (new Date() > record.expiresAt) {
      // Clean up expired OTP
      await prisma.otp.delete({
        where: { id: record.id }
      })
      return { isValid: false, message: 'OTP expired' }
    }

    if (record.otp !== otp) {
      return { isValid: false, message: 'Invalid OTP' }
    }

    // DON'T delete the OTP here - we need it for the password reset step
    return { isValid: true, message: 'OTP verified successfully' }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { isValid: false, message: 'Internal server error' }
  }
}

// Verify and delete OTP (for the final reset step)
export async function verifyAndDeleteOtp(email: string, otp: string): Promise<{ isValid: boolean; message: string }> {
  try {
    const record = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    })

    if (!record) {
      return { isValid: false, message: 'No OTP requested for this email' }
    }

    if (new Date() > record.expiresAt) {
      // Clean up expired OTP
      await prisma.otp.delete({
        where: { id: record.id }
      })
      return { isValid: false, message: 'OTP expired' }
    }

    if (record.otp !== otp) {
      return { isValid: false, message: 'Invalid OTP' }
    }

    // Delete the OTP after successful verification (final step)
    await prisma.otp.delete({
      where: { id: record.id }
    })

    return { isValid: true, message: 'OTP verified successfully' }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { isValid: false, message: 'Internal server error' }
  }
}

// Clean up expired OTPs
export async function cleanupExpiredOtps(): Promise<void> {
  try {
    await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  } catch (error) {
    console.error('OTP cleanup error:', error)
  }
}