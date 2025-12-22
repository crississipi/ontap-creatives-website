// app/api/visitor/update-session/route.ts
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
    const { sessionID, duration } = body

    if (!sessionID) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update session duration if provided
    const updateData: any = {}
    if (duration !== undefined) {
      updateData.duration = duration
    }

    const session = await prisma.session.update({
      where: { sessionID: sessionID },
      data: updateData
    })

    return NextResponse.json({ 
      success: true, 
      sessionID: session.sessionID 
    })
  } catch (error) {
    const prismaError = error as PrismaError;
    
    // If session doesn't exist, return success to prevent frontend errors
    if (prismaError.code === 'P2025') { // Record not found
      return NextResponse.json({ 
        success: true,
        error: 'Session not found' 
      })
    }
    console.error('Session update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add GET method if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}