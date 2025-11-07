// app/api/geolocation/ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

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
      console.log('ipapi.co failed, trying fallback...');
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
      console.log('ipwhois failed');
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
    console.error('IP Geolocation error:', error);
    return NextResponse.json({ 
      error: 'Failed to get location from IP' 
    }, { status: 500 });
  }
}