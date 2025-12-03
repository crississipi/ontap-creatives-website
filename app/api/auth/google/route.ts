import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the redirect parameter to know where to send the user back to
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect');
    
    let frontendUrl;
    
    if (redirectParam) {
      // Use the provided redirect URL
      frontendUrl = decodeURIComponent(redirectParam);
    } else {
      // Fallback: get from referer or origin headers
      const referer = request.headers.get('referer');
      const origin = request.headers.get('origin');
      frontendUrl = referer || origin || 'https://darkslategray-horse-918539.hostingersite.com' || 'https://ontap.ph';
    }
    
    console.log('Google OAuth - Frontend URL:', frontendUrl);
    
    // Extract domain from frontend URL
    let frontendDomain;
    try {
      const url = new URL(frontendUrl);
      frontendDomain = url.hostname;
    } catch {
      frontendDomain = 'https://darkslategray-horse-918539.hostingersite.com';
    }
    
    console.log('Google OAuth - Frontend domain:', frontendDomain);
    
    // Use production Google Client ID
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID not configured');
      return NextResponse.json(
        { error: 'Google authentication is not configured' },
        { status: 500 }
      );
    }
    
    // Always use Vercel backend for callback
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    // Create state parameter with frontend info
    const state = Buffer.from(JSON.stringify({
      frontend: frontendDomain,
      frontendUrl: frontendUrl,
      timestamp: Date.now()
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
      hd: '*',
    });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    const response = NextResponse.redirect(authUrl);
    
    // Store frontend info in cookie for callback
    response.cookies.set({
      name: 'oauth-frontend',
      value: frontendUrl,
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
      { error: 'Failed to initialize Google authentication' },
      { status: 500 }
    );
  }
}