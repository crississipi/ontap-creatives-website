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

    // ✅ FIXED: Use HTTPS instead of HTTP
    const ipApiResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const ipData = await ipApiResponse.json();

    if (ipData.error !== true) {
      return NextResponse.json({
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country_name,
        countryCode: ipData.country_code,
        ipAddress: ipData.ip,
        source: 'ipapi.co'
      });
    }

    // Alternative HTTPS service
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
        source: 'ipwhois'
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