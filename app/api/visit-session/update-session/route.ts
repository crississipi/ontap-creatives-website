import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type for Prisma errors
interface PrismaError extends Error {
  code?: string
  meta?: any
  clientVersion?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionID, pageUrl, pageTitle, metadata } = body

    console.log('🔍 Updating session:', sessionID);

    if (!sessionID) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update session with new page information
    const session = await prisma.session.update({
      where: { sessionID: sessionID },
      data: {
        pageUrl: pageUrl || null,
        pageTitle: pageTitle || null,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    console.log('🔍 Session updated:', session.sessionID);

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID 
    })
  } catch (error) {
    console.error('🔍 Error updating session:', error)
    
    // Type guard to check if it's a Prisma error
    const prismaError = error as PrismaError;
    
    // If session doesn't exist, return success to prevent frontend errors
    if (prismaError.code === 'P2025') { // Record not found
      return NextResponse.json({ 
        success: true,
        error: 'Session not found' 
      })
    }
    
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