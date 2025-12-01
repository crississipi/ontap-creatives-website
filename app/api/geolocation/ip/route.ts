// app/api/geolocation/ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Clean IP-based geolocation API
 * Tries multiple services with fallback
 */
export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const clientIP = getClientIP(request);

    if (!clientIP || clientIP === 'unknown') {
      return NextResponse.json({ 
        error: 'Could not determine IP address' 
      }, { status: 400 });
    }

    // Skip geolocation for local IPs
    if (isLocalIP(clientIP)) {
      return NextResponse.json({
        error: 'Local IP address detected',
        latitude: null,
        longitude: null
      });
    }

    // Try IP geolocation services in order
    const services = [
      tryIPAPI,
      tryIPWhois,
      tryFreeIPAPI
    ];

    for (const service of services) {
      try {
        const location = await service(clientIP);
        if (location) {
          return NextResponse.json(location);
        }
      } catch (error) {
        // Continue to next service
        continue;
      }
    }

    // All services failed
    return NextResponse.json({ 
      error: 'Failed to get location from IP',
      latitude: null,
      longitude: null
    }, { status: 500 });

  } catch (error) {
    console.error('IP Geolocation error:', error);
    return NextResponse.json({ 
      error: 'Failed to get location from IP' 
    }, { status: 500 });
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

/**
 * Check if IP is local/private
 */
function isLocalIP(ip: string): boolean {
  return ip === '127.0.0.1' || 
         ip.startsWith('192.168.') || 
         ip.startsWith('10.') ||
         ip.startsWith('172.16.') ||
         ip.startsWith('172.17.') ||
         ip.startsWith('172.18.') ||
         ip.startsWith('172.19.') ||
         ip.startsWith('172.20.') ||
         ip.startsWith('172.21.') ||
         ip.startsWith('172.22.') ||
         ip.startsWith('172.23.') ||
         ip.startsWith('172.24.') ||
         ip.startsWith('172.25.') ||
         ip.startsWith('172.26.') ||
         ip.startsWith('172.27.') ||
         ip.startsWith('172.28.') ||
         ip.startsWith('172.29.') ||
         ip.startsWith('172.30.') ||
         ip.startsWith('172.31.');
}

/**
 * Service 1: ip-api.com (Free, reliable)
 */
async function tryIPAPI(ip: string): Promise<any | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,query`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.lat && data.lon) {
      return {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        ipAddress: data.query,
        source: 'ip-api'
      };
    }

    return null;
  } catch (error) {
    clearTimeout(timeout);
    return null;
  }
}

/**
 * Service 2: ipwhois.app (Free, reliable)
 */
async function tryIPWhois(ip: string): Promise<any | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://ipwhois.app/json/${ip}`,
      { signal: controller.signal }
    );
    
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
        countryCode: data.country_code,
        source: 'ipwhois'
      };
    }

    return null;
  } catch (error) {
    clearTimeout(timeout);
    return null;
  }
}

/**
 * Service 3: freeipapi.com (Free, backup)
 */
async function tryFreeIPAPI(ip: string): Promise<any | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://freeipapi.com/api/json/${ip}`,
      { signal: controller.signal }
    );
    
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
        countryCode: data.countryCode,
        source: 'freeipapi'
      };
    }

    return null;
  } catch (error) {
    clearTimeout(timeout);
    return null;
  }
}
