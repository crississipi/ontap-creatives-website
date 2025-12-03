import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const host = request.headers.get('host') || '';
  
  // Determine domain for cookies
  let domain: string | undefined;
  if (isProduction) {
    if (host.includes('ontap-creatives-website.vercel.app')) {
      domain = '.ontap-creatives-website.vercel.app';
    } else if (host.includes('ontap.ph')) {
      domain = '.ontap.ph';
    }
  }

  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear staff-auth-token cookie
  response.cookies.set({
    name: 'staff-auth-token',
    value: '',
    maxAge: -1,
    path: '/',
    domain: domain,
    httpOnly: true,
    secure: isProduction,
  });

  // Clear staff-session cookie
  response.cookies.set({
    name: 'staff-session',
    value: '',
    maxAge: -1,
    path: '/',
    domain: domain,
    secure: isProduction,
  });

  // Clear role session cookie
  response.cookies.set({
    name: 'ontap::adminRoleSession',
    value: '',
    maxAge: -1,
    path: '/',
    domain: domain,
    secure: isProduction,
  });

  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://ontap-creatives-website.vercel.app',
    'https://ontap.ph',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  return new Response(null, {
    status: 200,
    headers: {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}