// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateOtp, storeOtp } from '@/lib/otpStore'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.client.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOtp()
    
    // Store OTP in database (persistent)
    await storeOtp(email, otp, 10) // 10 minutes

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Ontap Creatives Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Ontap Creatives: Password Reset OTP",
      html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
        <div style="padding: 15px 0;">
          <table role="presentation">
            <tr>
              <td style="vertical-align: top; text-align: center">
                <div style="padding: 6px 10px; margin: 0 10px; border-radius: 5px;" role="img">
                  <img src="https://github.com/burnboxprinting/ontap-website/raw/main/logo-ontap.png" alt="ontap-logo"/>
                </div>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top">
                <p>Hi <strong>${user.clientName || 'User'}</strong>,</p>
                <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                <br>
                <div style="text-align:center; font-size:24px; font-weight:bold; letter-spacing:6px; color:#2E86C1; margin: 20px 0;">${otp}</div>
                <br>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br><br>
                <p>Best regards,<br><strong>The OnTap Creatives Team</strong></p>
                <p style="color: #2E86C1; font-size: 12px; padding: 10px 0px; border-top: 1px solid #2E86C1">
                  This is an automated message. Please do not reply to this email.
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>`,
    })

    return NextResponse.json(
      { message: 'OTP sent to your email' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// No need for OPTIONS handler - middleware handles it!