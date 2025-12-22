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

    if (!sessionID) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get current session to calculate average duration
    const currentSession = await prisma.session.findUnique({
      where: { sessionID: sessionID }
    })

    if (!currentSession) {
      return NextResponse.json({ 
        success: true,
        error: 'Session not found' 
      })
    }

    // Calculate average duration if there were multiple visits
    const currentDuration = currentSession.duration || 0
    
    // If multiple visits, calculate weighted average
    // (previous_avg * (count-1) + new_duration) / count
    const newAverageDuration = (currentDuration + duration) / 2;

    // Update session with end time and average duration
    const session = await prisma.session.update({
      where: { sessionID: sessionID },
      data: {
        dateLeft: new Date(dateLeft),
        duration: newAverageDuration
      }
    })

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID,
      duration: session.duration,
    })
  } catch (error) {
    
    // Type guard to check if it's a Prisma error
    const prismaError = error as PrismaError;
    
    // If session doesn't exist, return success to prevent frontend errors
    if (prismaError.code === 'P2025') { // Record not found
      return NextResponse.json({ 
        success: true,
        error: 'Session not found' 
      })
    }
    
    console.error('Session end error:', error)
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