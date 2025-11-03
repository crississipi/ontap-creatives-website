// app/api/geolocation/ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';

    if (clientIP === 'unknown') {
      return NextResponse.json({ 
        error: 'Could not determine IP address' 
      });
    }

    // Use a free IP geolocation service
    const ipApiResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,query`);
    const ipData = await ipApiResponse.json();

    if (ipData.status === 'success') {
      return NextResponse.json({
        latitude: ipData.lat,
        longitude: ipData.lon,
        city: ipData.city,
        region: ipData.regionName,
        country: ipData.country,
        countryCode: ipData.countryCode,
        ipAddress: ipData.query,
        source: 'ip-api'
      });
    }

    // Fallback to another service
    const ipifyResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_API_KEY}&ipAddress=${clientIP}`);
    const ipifyData = await ipifyResponse.json();

    if (ipifyData.location) {
      return NextResponse.json({
        latitude: ipifyData.location.lat,
        longitude: ipifyData.location.lng,
        city: ipifyData.location.city,
        region: ipifyData.location.region,
        country: ipifyData.location.country,
        ipAddress: clientIP,
        source: 'ipify'
      });
    }

    throw new Error('All geolocation services failed');

  } catch (error) {
    console.error('IP Geolocation error:', error);
    return NextResponse.json({ 
      error: 'Failed to get location from IP' 
    }, { status: 500 });
  }
}