// app/api/geolocation/ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Clean IP-based geolocation API
 * Tries multiple services with fallback
 */
export async function GET(request: NextRequest) {
  try {
    // Get client IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    let clientIP = 'unknown';
    
    if (forwarded) {
      clientIP = forwarded.split(',')[0].trim();
    } else if (realIP) {
      clientIP = realIP;
    } else if (cfConnectingIP) {
      clientIP = cfConnectingIP;
    }

    if (clientIP === 'unknown' || clientIP === '::1' || clientIP.startsWith('127.') || clientIP === 'localhost') {
      // Use a service that detects the IP automatically for local development
      const ipApiResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipApiResponse.json();
      
      return NextResponse.json({
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country_name,
        countryCode: ipData.country_code,
        ipAddress: ipData.ip,
        isp: ipData.org,
        timezone: ipData.timezone,
        source: 'ipapi.co-auto'
      });
    }

    // Try ipapi.co first
    try {
      const ipApiResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
      const ipData = await ipApiResponse.json();
      
      if (ipData.latitude && ipData.longitude) {
        return NextResponse.json({
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          city: ipData.city,
          region: ipData.region,
          country: ipData.country_name,
          countryCode: ipData.country_code,
          ipAddress: ipData.ip,
          isp: ipData.org,
          timezone: ipData.timezone,
          source: 'ipapi.co'
        });
      }
    } catch (error) {
    }

    // Fallback to ipwhois
    try {
      const ipwhoisResponse = await fetch(`https://ipwho.is/${clientIP}`);
      const ipwhoisData = await ipwhoisResponse.json();
      
      if (ipwhoisData.success) {
        return NextResponse.json({
          latitude: ipwhoisData.latitude,
          longitude: ipwhoisData.longitude,
          city: ipwhoisData.city,
          region: ipwhoisData.region,
          country: ipwhoisData.country,
          countryCode: ipwhoisData.country_code,
          ipAddress: clientIP,
          isp: ipwhoisData.connection?.isp,
          timezone: ipwhoisData.timezone?.id,
          source: 'ipwhois'
        });
      }
    } catch (error) {
    }

    // Final fallback - get automatic IP detection
    const autoResponse = await fetch('https://ipapi.co/json/');
    const autoData = await autoResponse.json();
    
    return NextResponse.json({
      latitude: autoData.latitude,
      longitude: autoData.longitude,
      city: autoData.city,
      region: autoData.region,
      country: autoData.country_name,
      countryCode: autoData.country_code,
      ipAddress: autoData.ip,
      isp: autoData.org,
      timezone: autoData.timezone,
      source: 'ipapi.co-fallback'
    });

  } catch (error) {
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
