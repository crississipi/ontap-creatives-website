// app/api/visitor/init/route.ts
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
}

interface RequestBody {
  visitorUUID?: string
  geoData?: GeoData
  userAgent?: string
  ipAddress?: string
}

/**
 * Initialize or update visitor record
 * Location data should come from client (GPS or IP geolocation)
 */
export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { visitorUUID, geoData, userAgent, ipAddress } = body;

    // Get client IP from request
    const clientIP = getClientIP(request);
    
    // Generate a new UUID if none provided
    const finalVisitorUUID = visitorUUID || uuidv4();
    
    // Find existing visitor
    let visitor = await prisma.visitor.findUnique({
      where: { visitorUUID: finalVisitorUUID }
    });

    // Prepare update data
    const updateData: any = {
      lastVisit: new Date(),
      isActive: true,
      userAgent: userAgent || request.headers.get('user-agent') || '',
      ipAddress: ipAddress || clientIP
    };

    // Update location data if provided from client
    if (geoData?.latitude && geoData?.longitude) {
      updateData.latitude = geoData.latitude;
      updateData.longitude = geoData.longitude;
      if (geoData.city) updateData.city = geoData.city;
      if (geoData.region) updateData.region = geoData.region;
      if (geoData.country) updateData.country = geoData.country;
    }

    try {
      if (visitor) {
        // Update existing visitor
        visitor = await prisma.visitor.update({
          where: { visitorUUID: finalVisitorUUID },
          data: updateData
        });
      } else {
        // Create new visitor
        visitor = await prisma.visitor.create({
          data: {
            visitorUUID: finalVisitorUUID,
            firstVisit: new Date(),
            ...updateData
          }
        });
      }
    } catch (dbError: any) {
      // Handle unique constraint violation
      if (dbError.code === 'P2002') {
        visitor = await prisma.visitor.update({
          where: { visitorUUID: finalVisitorUUID },
          data: updateData
        });
      } else {
        throw dbError;
      }
    }

    return NextResponse.json({ 
      success: true, 
      visitorUUID: visitor.visitorUUID,
      visitorID: visitor.visitorID,
      locationSaved: !!(visitor.latitude && visitor.longitude),
      message: 'Visitor initialized successfully'
    });

  } catch (error) {
    console.error('Error in visitor init API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || 
         forwarded?.split(',')[0].trim() || 
         realIP || 
         'unknown';
}
