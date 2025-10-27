import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

interface GeoData {
  latitude?: number
  longitude?: number
  city?: string
  region?: string
  country?: string
  accuracy?: string // Add accuracy field
}

interface RequestBody {
  visitorUUID?: string
  geoData?: GeoData
  userAgent?: string
  ipAddress?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { visitorUUID, geoData, userAgent, ipAddress } = body

    // Get client IP from request
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Generate a new UUID if none provided
    const finalVisitorUUID = visitorUUID || uuidv4()
    
    console.log('🔍 Initializing visitor with UUID:', finalVisitorUUID);
    console.log('🔍 Received geoData:', geoData);

    // Try to find visitor, create if not exists
    let visitor = await prisma.visitor.findUnique({
      where: { visitorUUID: finalVisitorUUID }
    })

    // Prepare update data
    const updateData: any = {
      lastVisit: new Date(),
      isActive: true,
      userAgent: userAgent || request.headers.get('user-agent') || '',
      ipAddress: ipAddress || clientIP
    }

    // Add geolocation data if available
    if (geoData) {
      if (geoData.latitude !== undefined) updateData.latitude = geoData.latitude
      if (geoData.longitude !== undefined) updateData.longitude = geoData.longitude
      if (geoData.city) updateData.city = geoData.city
      if (geoData.region) updateData.region = geoData.region
      if (geoData.country) updateData.country = geoData.country
      // Store accuracy in metadata if needed, or add a field to your schema
    }

    if (visitor) {
      // Update existing visitor
      console.log('🔍 Updating existing visitor:', visitor.visitorID);
      visitor = await prisma.visitor.update({
        where: { visitorUUID: finalVisitorUUID },
        data: updateData
      })
    } else {
      // Create new visitor
      console.log('🔍 Creating new visitor with UUID:', finalVisitorUUID);
      visitor = await prisma.visitor.create({
        data: {
          visitorUUID: finalVisitorUUID,
          firstVisit: new Date(),
          lastVisit: new Date(),
          ...updateData
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      visitorUUID: visitor.visitorUUID,
      visitorID: visitor.visitorID,
      locationSaved: !!geoData?.latitude && !!geoData?.longitude,
      locationAccuracy: geoData?.accuracy || 'unknown'
    })
  } catch (error) {
    console.error('🔍 Error initializing visitor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}