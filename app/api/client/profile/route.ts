import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Helper to extract and verify JWT from cookies
function getUserIdFromRequest(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    return decoded?.userId
  } catch {
    return null
  }
}

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
      where: { clientID: userId },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true,
        dateCreated: true,
        emailVerified: true
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ client }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clientName, email, contactNumber, address } = await request.json()

    const updatedClient = await prisma.client.update({
      where: { clientID: userId },
      data: {
        ...(clientName && { clientName }),
        ...(email && { email }),
        ...(contactNumber && { contactNumber }),
        ...(address && { address })
      },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true
      }
    })

    return NextResponse.json({ client: updatedClient }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
