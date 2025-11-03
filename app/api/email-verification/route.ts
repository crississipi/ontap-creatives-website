import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateOtp, storeOtp } from '@/lib/otpStore'
import { corsHeaders } from '@/lib/corsHeaders'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Generate OTP
    const otp = generateOtp()
    
    // Store OTP in database for email verification
    await storeOtp(email, otp, 30) // 30 minutes for email verification

    // console.log('🔍 Verification OTP stored for email:', email, 'OTP:', otp)

    // Send verification email
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
      subject: "Ontap Creatives: Verify Your Email Address",
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
                <p>Hi <strong>${name || 'User'}</strong>,</p>
                <p>Welcome to OnTap Creatives! Thank you for creating an account.</p>
                <p>To complete your registration and verify your email address, please use the OTP below:</p>
                <br>
                <div style="text-align:center; font-size:24px; font-weight:bold; letter-spacing:6px; color:#2E86C1; margin: 20px 0;">${otp}</div>
                <br>
                <p>This OTP is valid for 30 minutes.</p>
                <p>If you didn't create an account with us, please ignore this email.</p>
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
      { message: 'Verification email sent successfully' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    // console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}