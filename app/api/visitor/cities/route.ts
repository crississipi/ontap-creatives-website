// app/api/visitors/cities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    const cityData = await prisma.visitor.groupBy({
      by: ['city', 'region', 'country', 'latitude', 'longitude'],
      where: {
        lastVisit: { gte: sinceDate },
        isActive: true,
        city: { not: null },
        latitude: { not: null },
        longitude: { not: null }
      },
      _count: {
        visitorID: true
      },
      having: {
        city: { not: null }
      }
    })

    const cities = cityData.map(city => ({
      city: city.city,
      region: city.region,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      visitorCount: city._count.visitorID
    }))

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Error fetching city data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch city data' },
      { status: 500 }
    )
  }
}