import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the origin (where the request came from)
    const origin = request.headers.get('origin') || request.headers.get('referer') || 'https://ontap.ph';
    console.log('Google OAuth request from origin:', origin);
    
    // Parse the origin to get the hostname
    let frontendDomain;
    try {
      const originUrl = new URL(origin);
      frontendDomain = originUrl.hostname;
    } catch {
      frontendDomain = 'ontap.ph'; // Default fallback
    }
    
    // Determine which Google Client ID to use based on environment
    let clientId;
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Production client ID
      clientId = process.env.GOOGLE_CLIENT_ID_PROD || process.env.GOOGLE_CLIENT_ID;
    } else {
      // Development client ID
      clientId = process.env.GOOGLE_CLIENT_ID_DEV || process.env.GOOGLE_CLIENT_ID;
    }
    
    if (!clientId) {
      console.error('Google Client ID not configured');
      return NextResponse.json(
        { error: 'Google authentication is not configured' },
        { status: 500 }
      );
    }
    
    // Determine redirect URI - ALWAYS use the Vercel backend URL for callback
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    console.log('Using Client ID:', clientId.substring(0, 10) + '...');
    console.log('Redirect URI:', redirectUri);
    console.log('Frontend domain:', frontendDomain);
    
    // Create state parameter to pass frontend info
    const state = Buffer.from(JSON.stringify({
      frontend: frontendDomain,
      timestamp: Date.now(),
      origin: origin
    })).toString('base64');
    
    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state,
      hd: '*', // Optional: restrict to specific domain
    });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    const response = NextResponse.redirect(authUrl);
    
    // Store the frontend domain in a cookie for the callback
    response.cookies.set({
      name: 'oauth-frontend',
      value: frontendDomain,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/',
    });
    
    return response;
    
  } catch (err: any) {
    console.error('Google OAuth init error:', err);
    return NextResponse.json(
      { error: 'Failed to initialize Google authentication: ' + err.message },
      { status: 500 }
    );
  }
}