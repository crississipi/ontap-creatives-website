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
  accuracy?: number
}

interface RequestBody {
  visitorUUID?: string
  geoData?: GeoData
  userAgent?: string
  ipAddress?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { visitorUUID, geoData, userAgent, ipAddress } = body;

    // Get client IP from request
    const clientIP = getClientIP(request);
    
    // Generate a new UUID if none provided
    const finalVisitorUUID = visitorUUID || uuidv4();
    
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

    let locationMethod = 'none';
    let locationData = null;

    // Use provided geoData if available (from browser GPS)
    if (geoData?.latitude && geoData?.longitude) {
      locationData = geoData;
      locationMethod = 'gps';
    } else {
      // Fallback to IP geolocation with better services
      locationData = await getIPLocation(clientIP);
      locationMethod = locationData ? 'ip' : 'none';
    }

    // Update location data if available
    if (locationData) {
      if (locationData.latitude !== undefined) updateData.latitude = locationData.latitude;
      if (locationData.longitude !== undefined) updateData.longitude = locationData.longitude;
      if (locationData.city) updateData.city = locationData.city;
      if (locationData.region) updateData.region = locationData.region;
      if (locationData.country) updateData.country = locationData.country;
    }

    try {
      if (visitor) {
        visitor = await prisma.visitor.update({
          where: { visitorUUID: finalVisitorUUID },
          data: updateData
        });
      } else {
        visitor = await prisma.visitor.create({
          data: {
            visitorUUID: finalVisitorUUID,
            firstVisit: new Date(),
            ...updateData
          }
        });
      }
    } catch (dbError: any) {
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
      locationMethod,
      message: 'Visitor initialized successfully'
    });

  } catch (error) {
    // console.error('Error in visitor init API:', error);
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

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || 
         forwarded?.split(',')[0].trim() || 
         realIP || 
         'unknown';
}

// UPDATED: API KEY SERVICES AT THE TOP
async function getIPLocation(ip: string): Promise<GeoData | null> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    // console.log('Skipping IP geolocation for local IP:', ip);
    return getFallbackLocation();
  }

  try {
    // PRIORITY ORDER: API Key Services First, then Free Services
    const services = [
      { name: 'IPGeolocation (API Key)', fn: tryIPGeolocation }, // Your API key service
      { name: 'IPStack (API Key)', fn: tryIPStack }, // Your API key service
      { name: 'IPInfoDB (API Key)', fn: tryIPInfoDB }, // Your API key service
      { name: 'IPWhois', fn: tryIPWhois }, // New reliable free service
      { name: 'GeoJS', fn: tryGeoJS }, // New service - very reliable
      { name: 'BigDataCloud', fn: tryBigDataCloud }, // Free service
      { name: 'FreeIPAPI', fn: tryFreeIPAPI }, // New free service
      { name: 'IPAPI (Backup)', fn: tryIPAPIBackup } // Last resort
    ];

    for (const service of services) {
      try {
        // console.log(`Trying ${service.name}...`);
        const location = await service.fn(ip);
        if (location) {
          // console.log(`✅ Success with ${service.name}`);
          return location;
        }
      } catch (error) {
        // console.warn(`❌ ${service.name} failed:`, error instanceof Error ? error.message : error);
      }
    }

    // console.log('All services failed, using fallback location');
    return getFallbackLocation();

  } catch (error) {
    // console.error('IP geolocation failed:', error);
    return getFallbackLocation();
  }
}

// FALLBACK: Return a default location when all services fail
function getFallbackLocation(): GeoData {
  // console.log('Using Metro Manila fallback location');
  return {
    latitude: 14.5995, // Metro Manila coordinates
    longitude: 120.9842,
    city: 'Metro Manila',
    region: 'Metropolitan Manila',
    country: 'Philippines',
    accuracy: 1000 // Low accuracy flag
  };
}

// SERVICE 1: IPGeolocation.io - YOUR API KEY SERVICE (HIGHEST PRIORITY)
async function tryIPGeolocation(ip: string): Promise<GeoData | null> {
  const apiKey = process.env.IPGEOLOCATION_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&fields=geo,time_zone`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (response.status === 401) {
      throw new Error('Invalid API key');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        city: data.city,
        region: data.state_prov,
        country: data.country_name,
        accuracy: data.accuracy_radius || 20 // High accuracy with API key
      };
    }
    
    throw new Error('Incomplete location data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 2: IPStack - YOUR API KEY SERVICE (HIGH PRIORITY)
async function tryIPStack(ip: string): Promise<GeoData | null> {
  const apiKey = process.env.IPSTACK_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    // Use HTTPS for IPStack
    const response = await fetch(`https://api.ipstack.com/${ip}?access_key=${apiKey}&fields=latitude,longitude,city,region_name,country_name,connection`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`IPStack: ${data.error.info || 'Unknown error'}`);
    }
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        region: data.region_name,
        country: data.country_name,
        accuracy: data.connection?.asn ? 25 : 50 // Higher accuracy with API key
      };
    }
    
    throw new Error('Incomplete location data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 3: IPInfoDB - YOUR API KEY SERVICE
async function tryIPInfoDB(ip: string): Promise<GeoData | null> {
  const apiKey = process.env.IPINFODB_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.ipinfodb.com/v3/ip-city/?key=${apiKey}&ip=${ip}&format=json`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.statusCode === 'OK' && data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        city: data.cityName,
        region: data.regionName,
        country: data.countryName,
        accuracy: 30 // Good accuracy with API key
      };
    }
    
    throw new Error(`IPInfoDB: ${data.statusMessage || 'Unknown error'}`);
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 4: IPWhois - New reliable free service
async function tryIPWhois(ip: string): Promise<GeoData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://ipwhois.app/json/${ip}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country,
        accuracy: 50
      };
    }
    
    throw new Error(data.message || 'Unsuccessful response');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 5: GeoJS - Very reliable free service
async function tryGeoJS(ip: string): Promise<GeoData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        city: data.city,
        region: data.region,
        country: data.country,
        accuracy: 100
      };
    }
    
    throw new Error('Incomplete location data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 6: BigDataCloud (improved)
async function tryBigDataCloud(ip: string): Promise<GeoData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/ip-geolocation?ip=${ip}&localityLanguage=en`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.location?.latitude && data.location?.longitude) {
      return {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        city: data.city || 'Unknown',
        region: data.principalSubdivision || 'Unknown',
        country: data.country?.name || 'Unknown',
        accuracy: data.location?.accuracyRadius || 100
      };
    }
    
    throw new Error('Incomplete location data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 7: FreeIPAPI - Alternative free service
async function tryFreeIPAPI(ip: string): Promise<GeoData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.cityName,
        region: data.regionName,
        country: data.countryName,
        accuracy: 75
      };
    }
    
    throw new Error('Incomplete location data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}

// SERVICE 8: IPAPI Backup - Last resort
async function tryIPAPIBackup(ip: string): Promise<GeoData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeout);
    
    if (response.status === 429) {
      throw new Error('Rate limited');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`IPAPI: ${data.reason || 'Unknown error'}`);
    }
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name,
        accuracy: data.accuracy || 50
      };
    }
    
    throw new Error('Incomplete data');
  } catch (error: any) {
    clearTimeout(timeout);
    throw error;
  }
}