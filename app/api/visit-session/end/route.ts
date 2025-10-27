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
    const { sessionID, dateLeft, duration } = body

    console.log('🔍 Ending session:', sessionID);

    if (!sessionID) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update session with end time and duration
    const session = await prisma.session.update({
      where: { sessionID: sessionID },
      data: {
        dateLeft: new Date(dateLeft),
        duration: duration
      }
    })

    console.log('🔍 Session ended:', session.sessionID, 'Duration:', duration, 'seconds');

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID,
      duration: session.duration
    })
  } catch (error) {
    console.error('🔍 Error ending session:', error)
    
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