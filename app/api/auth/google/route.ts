import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Google OAuth route called');
    console.log('Available env vars:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID_PROD,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET_PROD,
      hasJwtSecret: !!process.env.JWT_SECRET,
    });
    
    if (!process.env.GOOGLE_CLIENT_ID_PROD) {
      console.error('GOOGLE_CLIENT_ID is missing');
      return NextResponse.json(
        { 
          error: 'Google authentication is not configured',
          details: 'GOOGLE_CLIENT_ID environment variable is missing'
        },
        { status: 500 }
      );
    }
    
    // Get the redirect parameter to know where to send the user back to
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect');
    
    let frontendUrl = redirectParam 
      ? decodeURIComponent(redirectParam)
      : 'https://darkslategray-horse-918539.hostingersite.com';
    
    console.log('Frontend URL for redirect:', frontendUrl);
    
    // Always use Vercel backend for callback
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    // Create state parameter
    const state = Buffer.from(JSON.stringify({
      frontendUrl: frontendUrl,
      timestamp: Date.now()
    })).toString('base64');
    
    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID_PROD,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state,
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
      maxAge: 10 * 60,
      path: '/',
    });
    
    return response;
    
  } catch (err: any) {
    console.error('Google OAuth init error:', err);
    return NextResponse.json(
      { 
        error: 'Failed to initialize Google authentication',
        details: err.message 
      },
      { status: 500 }
    );
  }
}