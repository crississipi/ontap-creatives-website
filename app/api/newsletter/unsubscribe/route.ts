import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      )
    }

    // Find subscriber by token
    const subscriber = await prisma.newsletter.findUnique({
      where: { unsubscribeToken: token }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      )
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { message: 'You are already unsubscribed' },
        { status: 200 }
      )
    }

    // Deactivate subscription
    await prisma.newsletter.update({
      where: { unsubscribeToken: token },
      data: { isActive: false }
    })

    // Return a simple HTML page
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed - Ontap Creatives</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #2E86C1;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          .checkmark {
            font-size: 4rem;
            color: #2E86C1;
            margin-bottom: 1rem;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #2E86C1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
          }
          .button:hover {
            background: #1a5490;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="checkmark">✓</div>
          <h1>Successfully Unsubscribed</h1>
          <p>You have been unsubscribed from the Ontap Creatives newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again on our website.</p>
          <a href="/" class="button">Return to Homepage</a>
        </div>
      </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
