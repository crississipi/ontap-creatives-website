import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Google OAuth init route called');
    
    // Debug environment
    console.log('Environment check:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID_PROD,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL
    });
    
    if (!process.env.GOOGLE_CLIENT_ID_PROD) {
      console.error('GOOGLE_CLIENT_ID_PROD is missing');
      return NextResponse.json(
        { error: 'Google authentication is not configured' },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect');
    
    // Get frontend URL for redirect back
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    
    if (redirectParam) {
      frontendUrl = decodeURIComponent(redirectParam);
      console.log('Using provided frontend URL:', frontendUrl);
    } else {
      // Try referer header
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          frontendUrl = `${refererUrl.protocol}//${refererUrl.host}`;
          console.log('Using referer as frontend URL:', frontendUrl);
        } catch (e) {
          console.log('Could not parse referer');
        }
      }
    }
    
    // Google OAuth callback URL (must match Google Cloud Console)
    const backendBaseUrl = 'https://ontap-creatives-website.vercel.app';
    const googleRedirectUri = `${backendBaseUrl}/api/auth/google/callback`;
    
    console.log('Google redirect_uri:', googleRedirectUri);
    
    // Create state with frontend info
    const stateData = {
      frontendUrl: frontendUrl,
      callbackPath: '/pages/auth/callback',
      timestamp: Date.now()
    };
    
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');
    
    // Build Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID_PROD);
    authUrl.searchParams.set('redirect_uri', googleRedirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    
    console.log('Google OAuth URL:', authUrl.toString());
    
    const response = NextResponse.redirect(authUrl.toString());
    
    // Store frontend URL in cookie
    response.cookies.set({
      name: 'oauth_frontend',
      value: frontendUrl,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1800, // 30 minutes
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