import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visitorUUID, clientID } = body

    const visitor = await prisma.visitor.findUnique({
      where: { visitorUUID }
    })

    if (!visitor) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      )
    }

    const updatedVisitor = await prisma.visitor.update({
      where: { visitorUUID },
      data: {
        clientID: clientID,
        lastVisit: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Visitor updated with client ID',
      visitor: updatedVisitor 
    })
  } catch (error) {
    // console.error('Error updating visitor client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}