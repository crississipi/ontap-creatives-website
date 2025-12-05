import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Google callback endpoint hit');
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    console.log('Callback params:', { hasCode: !!code, error, hasState: !!state });
    
    if (error) {
      console.error('Google OAuth error:', error);
      // Redirect to frontend with error
      const errorUrl = new URL('https://darkslategray-horse-918539.hostingersite.com');
      errorUrl.searchParams.set('auth_error', `google_${error}`);
      return NextResponse.redirect(errorUrl.toString());
    }
    
    if (!code) {
      console.error('No authorization code received');
      const errorUrl = new URL('https://darkslategray-horse-918539.hostingersite.com');
      errorUrl.searchParams.set('auth_error', 'no_code');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    // Get frontend URL from state or cookie
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    let callbackPath = '/pages/auth/callback'; // CORRECT PATH
    
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        frontendUrl = stateData.frontendUrl || 'https://darkslategray-horse-918539.hostingersite.com';
        callbackPath = stateData.callbackPath || '/pages/auth/callback';
        console.log('Got from state - frontendUrl:', frontendUrl, 'callbackPath:', callbackPath);
      } catch (err) {
        console.log('Could not parse state, using default');
      }
    }
    
    // Fallback to cookie
    if (!frontendUrl) {
      const frontendCookie = request.cookies.get('oauth_frontend')?.value;
      if (frontendCookie) {
        frontendUrl = frontendCookie;
        console.log('Got frontend URL from cookie:', frontendUrl);
      }
    }
    
    // Clean up frontend URL to avoid double slashes
    const frontendBaseUrl = frontendUrl.replace(/\/+$/, ''); // Remove trailing slashes
    console.log('Cleaned frontend base URL:', frontendBaseUrl);
    
    // Google OAuth callback URL (must match Google Cloud Console)
    const backendBaseUrl = 'https://ontap-creatives-website.vercel.app';
    const googleRedirectUri = `${backendBaseUrl}/api/auth/google/callback`;
    
    console.log('Using Google redirect_uri:', googleRedirectUri);
    console.log('Will redirect user back to:', `${frontendBaseUrl}${callbackPath}`);
    
    // Use environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID_PROD;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_PROD;
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      const errorUrl = new URL(frontendBaseUrl);
      errorUrl.searchParams.set('auth_error', 'config_missing');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      const errorUrl = new URL(frontendBaseUrl);
      errorUrl.searchParams.set('auth_error', 'token_exchange_failed');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    const { access_token } = tokenData;
    
    // Get user info from Google
    console.log('Getting user info from Google...');
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info:', userInfo);
      const errorUrl = new URL(frontendBaseUrl);
      errorUrl.searchParams.set('auth_error', 'user_info_failed');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    const { email, name, picture } = userInfo;
    
    if (!email) {
      console.error('No email from Google');
      const errorUrl = new URL(frontendBaseUrl);
      errorUrl.searchParams.set('auth_error', 'no_email');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    console.log('Google user authenticated:', email);
    
    // Check if user exists
    let user = await prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      // Create new user
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      
      user = await prisma.client.create({
        data: {
          clientName: name || email.split('@')[0],
          email: email.toLowerCase(),
          password: hashedPassword,
          adsAgree: false,
          emailVerified: true,
        },
      });
      console.log('New user created:', email);
    }
    
    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-change-this';
    const token = jwt.sign(
      { 
        userId: user.clientID,
        email: user.email,
        name: user.clientName,
        profileImage: picture || null,
      },
      jwtSecret,
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Add profile image to user object for frontend
    const userWithProfileImage = {
      ...userWithoutPassword,
      profileImage: picture || null
    };
    
    // Build the CORRECT callback URL
    // Remove any existing /pages from the URL to avoid duplication
    let baseUrl = frontendBaseUrl;
    if (baseUrl.includes('/pages')) {
      baseUrl = baseUrl.split('/pages')[0];
    }
    
    // Ensure we have the correct callback path
    const correctCallbackPath = '/pages/auth/callback';
    const callbackUrl = new URL(`${baseUrl}${correctCallbackPath}`);
    
    // Add query parameters
    callbackUrl.searchParams.set('token', token);
    callbackUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(userWithProfileImage)));
    callbackUrl.searchParams.set('provider', 'google');
    callbackUrl.searchParams.set('success', 'true');
    
    console.log('Final callback URL:', callbackUrl.toString());
    
    // Create response with redirect
    const response = NextResponse.redirect(callbackUrl.toString());
    
    // Also set cookie for JavaScript access
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    
    return response;
    
  } catch (err: any) {
    console.error('Google callback error:', err);
    console.error('Error stack:', err.stack);
    const errorUrl = new URL('https://darkslategray-horse-918539.hostingersite.com');
    errorUrl.searchParams.set('auth_error', 'server_error');
    return NextResponse.redirect(errorUrl.toString());
  }
}