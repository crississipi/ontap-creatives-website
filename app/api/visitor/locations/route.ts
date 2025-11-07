// app/api/visitors/locations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const clientId = searchParams.get('clientId')
    
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    const whereClause: any = {
      lastVisit: { gte: sinceDate },
      isActive: true,
      latitude: { not: null },
      longitude: { not: null }
    }

    if (clientId) {
      whereClause.clientID = parseInt(clientId)
    }

    const visitors = await prisma.visitor.findMany({
      where: whereClause,
      select: {
        visitorID: true,
        visitorUUID: true,
        latitude: true,
        longitude: true,
        city: true,
        region: true,
        country: true,
        lastVisit: true,
        client: {
          select: {
            clientName: true
          }
        }
      },
      orderBy: {
        lastVisit: 'desc'
      }
    })

    // Transform data for frontend
    const locations = visitors.map(visitor => ({
      id: visitor.visitorID,
      uuid: visitor.visitorUUID,
      position: [visitor.longitude, visitor.latitude],
      city: visitor.city,
      region: visitor.region,
      country: visitor.country,
      lastVisit: visitor.lastVisit,
      clientName: visitor.client?.clientName || 'Unknown'
    }))

    return NextResponse.json({ locations })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch visitor locations' },
      { status: 500 }
    )
  }
}