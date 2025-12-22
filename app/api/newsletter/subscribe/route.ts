import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        )
      } else {
        // Reactivate the subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true, subscribedAt: new Date() }
        })

        // Send welcome back email
        await sendWelcomeEmail(email, existingSubscriber.unsubscribeToken)

        return NextResponse.json(
          { message: 'Subscription reactivated successfully!' },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    const newSubscriber = await prisma.newsletter.create({
      data: { email }
    })

    // Send welcome email
    await sendWelcomeEmail(email, newSubscriber.unsubscribeToken)

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/newsletter/unsubscribe?token=${unsubscribeToken}`

    await transporter.sendMail({
      from: `"Ontap Creatives Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Ontap Creatives Newsletter!",
      html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; background-color: #f8f9fa;">
          <table role="presentation" style="width: 100%;">
            <tr>
              <td style="text-align: center; padding: 20px 0;">
                <img src="https://github.com/burnboxprinting/ontap-website/raw/main/logo-ontap.png" alt="ontap-logo" style="max-width: 150px;"/>
              </td>
            </tr>
            <tr>
              <td style="background-color: white; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2E86C1; margin-top: 0;">Welcome to Our Newsletter!</h1>
                <p>Thank you for subscribing to the Ontap Creatives newsletter!</p>
                <p>You'll now receive updates about:</p>
                <ul style="line-height: 1.8;">
                  <li>New products and services</li>
                  <li>Special offers and promotions</li>
                  <li>Industry insights and tips</li>
                  <li>Company news and events</li>
                </ul>
                <p>We're excited to have you as part of our community!</p>
                <br>
                <p>Best regards,<br><strong>The OnTap Creatives Team</strong></p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">
                  If you wish to unsubscribe, <a href="${unsubscribeUrl}" style="color: #2E86C1;">click here</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Ontap Creatives. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </div>
      </div>`,
    })

    console.log('Welcome email sent to:', email)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw error - subscription was successful even if email fails
  }
}
