import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCorsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const body = await request.json()
    const { visitorUUID } = body

    if (!visitorUUID) {
      return NextResponse.json(
        { error: 'Visitor UUID is required' },
        { status: 400 }
      )
    }

    // Try to find visitor, create if not exists
    let visitor = await prisma.visitor.findUnique({
      where: { visitorUUID }
    })

    if (!visitor) {
      // Get client IP from request
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'

      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          visitorUUID: visitorUUID,
          firstVisit: new Date(),
          lastVisit: new Date(),
          isActive: true,
          userAgent: request.headers.get('user-agent') || '',
          ipAddress: clientIP
        }
      })
    } else {
      // Update last visit for existing visitor
      await prisma.visitor.update({
        where: { visitorUUID },
        data: {
          lastVisit: new Date(),
          isActive: true
        }
      })
    }

    // Get today's date at midnight (for consistent date comparison)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if session exists for today
    let session = await prisma.session.findFirst({
      where: {
        visitorID: visitor.visitorID,
        dateLeft: today
      }
    })

    if (session) {
      // Update existing session - increment visit count and reset timing
      session = await prisma.session.update({
        where: { sessionID: session.sessionID },
        data: {
          dateVisited: new Date(),
          dateLeft: null,
          duration: null
        }
      })
    } else {
      // Create new session for today
      session = await prisma.session.create({
        data: {
          visitorID: visitor.visitorID,
          dateVisited: new Date(),
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID,
      visitorID: visitor.visitorID,
    }, { headers: getCorsHeaders(origin) })
  } catch (error) {
    const origin = request.headers.get('origin') || null
    console.error('Session start error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getCorsHeaders(origin) }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}