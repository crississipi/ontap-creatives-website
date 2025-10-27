import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visitorUUID, pageUrl, pageTitle, metadata } = body

    console.log('🔍 Starting session for visitor:', visitorUUID);

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
      console.log('🔍 Visitor not found, creating new visitor...');
      
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
      
      console.log('🔍 New visitor created:', visitor.visitorID);
    } else {
      console.log('🔍 Found existing visitor:', visitor.visitorID);
      
      // Update last visit for existing visitor
      await prisma.visitor.update({
        where: { visitorUUID },
        data: {
          lastVisit: new Date(),
          isActive: true
        }
      })
    }

    // Create new session
    const session = await prisma.session.create({
      data: {
        visitorID: visitor.visitorID,
        pageUrl: pageUrl || null,
        pageTitle: pageTitle || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        dateVisited: new Date()
      }
    })

    console.log('🔍 Session created:', session.sessionID);

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID,
      visitorID: visitor.visitorID,
      visitorCreated: !visitor // Indicate if visitor was newly created
    })
  } catch (error) {
    console.error('🔍 Error starting session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}