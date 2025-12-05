// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== GOOGLE OAUTH INIT ===');
    
    // Check environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID_PROD;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_PROD;
    
    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);
    
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID_PROD is missing');
      return NextResponse.json(
        { 
          error: 'Google authentication is not configured',
          details: 'GOOGLE_CLIENT_ID_PROD environment variable is missing'
        },
        { status: 500 }
      );
    }
    
    // The redirect URI MUST match EXACTLY what's in Google Cloud Console
    // This is the most critical part - must be exact
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    console.log('Using redirect_uri:', redirectUri);
    
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect');
    
    // Get frontend URL for redirect back
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    
    if (redirectParam) {
      frontendUrl = decodeURIComponent(redirectParam);
      console.log('Using provided frontend URL:', frontendUrl);
    }
    
    // Create state with frontend info
    const stateData = {
      frontendUrl: frontendUrl,
      callbackPath: '/pages/auth/callback', // Make sure this is correct
      timestamp: Date.now(),
    };

    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');
    
    // Build Google OAuth URL with EXACT parameters
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    // These parameters must be EXACT
    authUrl.searchParams.set('client_id', clientId.trim()); // Trim any spaces
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    
    console.log('Generated Google OAuth URL (first 200 chars):', authUrl.toString().substring(0, 200));
    console.log('Redirect URI in URL:', authUrl.searchParams.get('redirect_uri'));
    
    const response = NextResponse.redirect(authUrl.toString());
    
    // Store frontend URL in cookie
    response.cookies.set({
      name: 'oauth_frontend',
      value: frontendUrl,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1800,
      path: '/',
    });
    
    // Also store the redirect URI for verification
    response.cookies.set({
      name: 'oauth_redirect_uri',
      value: redirectUri,
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
      { 
        error: 'Failed to initialize Google authentication',
        details: err.message,
        stack: err.stack 
      },
      { status: 500 }
    );
  }
}