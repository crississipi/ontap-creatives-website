import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    console.log('Google callback received');
    
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect('https://ontap.ph?auth_error=google_' + error);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect('https://ontap.ph?auth_error=no_code');
    }
    
    // Get frontend domain from state or cookie
    let frontendDomain = 'ontap.ph'; // Default
    
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        frontendDomain = stateData.frontend || 'ontap.ph';
        console.log('Got frontend from state:', frontendDomain);
      } catch (err) {
        console.log('Could not parse state, trying cookie');
      }
    }
    
    // Fallback to cookie
    const frontendCookie = request.cookies.get('oauth-frontend')?.value;
    if (frontendCookie) {
      frontendDomain = frontendCookie;
      console.log('Got frontend from cookie:', frontendDomain);
    }
    
    // Determine frontend URL based on domain
    let frontendUrl;
    if (frontendDomain.includes('localhost') || frontendDomain.includes('127.0.0.1')) {
      frontendUrl = 'http://localhost:3000';
    } else if (frontendDomain.includes('ontap.ph')) {
      frontendUrl = 'https://ontap.ph';
    } else if (frontendDomain.includes('hostinger')) {
      frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com';
    } else {
      frontendUrl = 'https://ontap.ph'; // Default
    }
    
    console.log('Frontend URL:', frontendUrl);
    
    // Exchange code for access token
    const clientId = process.env.GOOGLE_CLIENT_ID_PROD || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_PROD || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      return NextResponse.redirect(`${frontendUrl}?auth_error=config_missing`);
    }
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${frontendUrl}?auth_error=token_exchange`);
    }
    
    const { access_token } = tokenData;
    
    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info:', userInfo);
      return NextResponse.redirect(`${frontendUrl}?auth_error=user_info`);
    }
    
    const { email, name, picture } = userInfo;
    
    if (!email) {
      console.error('No email from Google');
      return NextResponse.redirect(`${frontendUrl}?auth_error=no_email`);
    }
    
    console.log('Google user authenticated:', email, name);
    
    // Check if user exists in database
    let user = await prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      // Create new user
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      
      user = await prisma.client.create({
        data: {
          clientName: name || email.split('@')[0],
          email: email.toLowerCase(),
          password: hashedPassword,
          adsAgree: false,
          emailVerified: true, // Google emails are verified
        },
      });
      console.log('New user created via Google:', email);
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.clientID,
        email: user.email,
        name: user.clientName,
        provider: 'google'
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Determine domain for cookie
    const isProduction = process.env.NODE_ENV === 'production';
    let cookieDomain: string | undefined;
    
    if (isProduction) {
      if (frontendDomain.includes('ontap.ph')) {
        cookieDomain = '.ontap.ph';
      } else if (frontendDomain.includes('hostingersite.com')) {
        cookieDomain = '.hostingersite.com';
      }
    }
    
    console.log('Setting cookie for domain:', cookieDomain);
    
    // Create redirect URL with token as URL parameter (since cross-domain cookies are tricky)
    const redirectUrl = new URL(`${frontendUrl}/auth/google-callback`);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('user', JSON.stringify(userWithoutPassword));
    redirectUrl.searchParams.set('provider', 'google');
    
    const response = NextResponse.redirect(redirectUrl.toString());
    
    // Try to set cookie anyway (might work for same-domain cases)
    if (cookieDomain) {
      response.cookies.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'none', // Use 'none' for cross-domain
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        domain: cookieDomain,
      });
    }
    
    // Clear the oauth cookie
    response.cookies.set({
      name: 'oauth-frontend',
      value: '',
      maxAge: -1,
      path: '/',
    });
    
    return response;
    
  } catch (err: any) {
    console.error('Google callback error:', err);
    return NextResponse.redirect('https://ontap.ph?auth_error=server_error');
  }
}