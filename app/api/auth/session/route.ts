// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      // Also check cookies as fallback
      const cookieHeader = headersList.get('cookie')
      const authCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('auth-token='))
      const tokenFromCookie = authCookie?.split('=')[1]
      
      if (!tokenFromCookie) {
        return NextResponse.json({ user: null }, { status: 200 })
      }
      
      // Use token from cookie
      const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET!) as { userId: number }
      
      const user = await prisma.client.findUnique({
        where: { clientID: decoded.userId },
        select: {
          clientID: true,
          clientName: true,
          email: true,
          contactNumber: true,
          address: true,
        }
      })

      return NextResponse.json({ user: user || null }, { status: 200 })
    }

    // Verify JWT token from header
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.userId },
      select: {
        clientID: true,
        clientName: true,
        email: true,
        contactNumber: true,
        address: true,
      }
    })

    return NextResponse.json({ user: user || null }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}