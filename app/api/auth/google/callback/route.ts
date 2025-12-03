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
      return NextResponse.redirect('https://darkslategray-horse-918539.hostingersite.com?auth_error=google');
    }
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect('https://darkslategray-horse-918539.hostingersite.com?auth_error=no_code');
    }
    
    // Get frontend URL from state or cookie
    let frontendUrl = 'https://darkslategray-horse-918539.hostingersite.com'; // Default
    
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        frontendUrl = stateData.frontendUrl || 'https://darkslategray-horse-918539.hostingersite.com';
        console.log('Got frontend URL from state:', frontendUrl);
      } catch (err) {
        console.log('Could not parse state');
      }
    }
    
    // Fallback to cookie
    const frontendCookie = request.cookies.get('oauth-frontend')?.value;
    if (frontendCookie) {
      frontendUrl = frontendCookie;
      console.log('Got frontend URL from cookie:', frontendUrl);
    }
    
    console.log('Will redirect back to:', frontendUrl);
    
    // Exchange code for tokens
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'https://ontap-creatives-website.vercel.app/api/auth/google/callback';
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      return NextResponse.redirect(`${frontendUrl}?auth_error=config`);
    }
    
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
      return NextResponse.redirect(`${frontendUrl}?auth_error=token`);
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
      return NextResponse.redirect(`${frontendUrl}?auth_error=userinfo`);
    }
    
    const { email, name } = userInfo;
    
    if (!email) {
      console.error('No email from Google');
      return NextResponse.redirect(`${frontendUrl}?auth_error=no_email`);
    }
    
    console.log('Google user:', email);
    
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
    const token = jwt.sign(
      { 
        userId: user.clientID,
        email: user.email,
        name: user.clientName,
      },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Create redirect URL with token as URL parameter
    const redirectUrl = new URL(frontendUrl);
    
    // If the frontend has a callback handler, use it
    if (frontendUrl.includes('hostinger') || frontendUrl.includes('https://darkslategray-horse-918539.hostingersite.com')) {
      // For your Hostinger/ontap.ph frontend, redirect to a callback page
      const callbackUrl = new URL(frontendUrl);
      callbackUrl.pathname = '/auth/callback';
      callbackUrl.searchParams.set('token', token);
      callbackUrl.searchParams.set('user', JSON.stringify(userWithoutPassword));
      callbackUrl.searchParams.set('provider', 'google');
      
      return NextResponse.redirect(callbackUrl.toString());
    } else {
      // For other cases, add token to URL
      redirectUrl.searchParams.set('auth_token', token);
      redirectUrl.searchParams.set('auth_user', JSON.stringify(userWithoutPassword));
      redirectUrl.searchParams.set('auth_provider', 'google');
      
      return NextResponse.redirect(redirectUrl.toString());
    }
    
  } catch (err: any) {
    console.error('Google callback error:', err);
    return NextResponse.redirect('https://darkslategray-horse-918539.hostingersite.com?auth_error=server');
  }
}