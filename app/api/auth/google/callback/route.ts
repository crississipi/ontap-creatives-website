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
    
    if (error) {
      console.error('Google OAuth error:', error);
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
    
    // Get frontend URL from state
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    let callbackPath = '/auth/callback'; // Updated for App Router
    
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        frontendUrl = stateData.frontendUrl || frontendUrl;
        callbackPath = stateData.callbackPath || callbackPath;
        console.log('State data:', stateData);
      } catch (err) {
        console.log('Could not parse state');
      }
    }
    
    // Google OAuth callback URL
    const backendBaseUrl = 'https://ontap-creatives-website.vercel.app';
    const googleRedirectUri = `${backendBaseUrl}/api/auth/google/callback`;
    
    console.log('Will redirect user back to:', `${frontendUrl}${callbackPath}`);
    
    const clientId = process.env.GOOGLE_CLIENT_ID_PROD;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_PROD;
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      const errorUrl = new URL(frontendUrl);
      errorUrl.searchParams.set('auth_error', 'config_missing');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      const errorUrl = new URL(frontendUrl);
      errorUrl.searchParams.set('auth_error', 'token_exchange_failed');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    const { access_token } = tokenData;
    
    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info:', userInfo);
      const errorUrl = new URL(frontendUrl);
      errorUrl.searchParams.set('auth_error', 'user_info_failed');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    const { email, name, picture } = userInfo;
    
    if (!email) {
      console.error('No email from Google');
      const errorUrl = new URL(frontendUrl);
      errorUrl.searchParams.set('auth_error', 'no_email');
      return NextResponse.redirect(errorUrl.toString());
    }
    
    console.log('Google user authenticated:', email);
    
    // Check if user exists
    let user = await prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
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
    
    // Add profile image to user object
    const userWithProfileImage = {
      ...userWithoutPassword,
      profileImage: picture || null
    };
    
    // Build callback URL
    const callbackUrl = new URL(frontendUrl); // e.g. https://darkslategray-horse-918539.hostingersite.com

    const hashParts = [
      `token=${token}`,
      `user=${encodeURIComponent(JSON.stringify(userWithProfileImage))}`,
      `provider=google`,
      `success=true`
    ];

    callbackUrl.hash = hashParts.join('&');
    console.log('Final callback URL (hash):', callbackUrl.toString());

    // IMPORTANT: Use encodeURIComponent for proper URL encoding
    callbackUrl.searchParams.set('token', token);
    callbackUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(userWithProfileImage)));
    callbackUrl.searchParams.set('provider', 'google');
    callbackUrl.searchParams.set('success', 'true');
    
    console.log('Final callback URL:', callbackUrl.toString());
    
    const response = NextResponse.redirect(callbackUrl.toString());

    // Set auth cookie on backend (Vercel) so browser will include it on subsequent requests
    // Use SameSite='none' and Secure to allow cross-site cookies from Hostinger frontend
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
    
  } catch (err: any) {
    console.error('Google callback error:', err);
    const errorUrl = new URL('https://darkslategray-horse-918539.hostingersite.com');
    errorUrl.searchParams.set('auth_error', 'server_error');
    return NextResponse.redirect(errorUrl.toString());
  }
}