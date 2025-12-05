import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID_PROD;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Google authentication is not configured' },
        { status: 500 }
      );
    }
    
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect');
    
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    
    if (redirectParam) {
      frontendUrl = decodeURIComponent(redirectParam);
    }
    
    // State with callback path
    const stateData = {
      frontendUrl: frontendUrl,
      callbackPath: '/auth/callback', // Updated path for App Router
      timestamp: Date.now(),
    };
    
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    
    const response = NextResponse.redirect(authUrl.toString());
    
    response.cookies.set({
      name: 'oauth_frontend',
      value: frontendUrl,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1800,
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