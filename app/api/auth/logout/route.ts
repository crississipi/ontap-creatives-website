import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const host = request.headers.get('host') || '';
  
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

  // Clear auth-token cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    maxAge: -1,
    path: '/',
    domain: domain,
    httpOnly: true,
    secure: isProduction,
  });

  // Clear user-session cookie
  response.cookies.set({
    name: 'user-session',
    value: '',
    maxAge: -1,
    path: '/',
    domain: domain,
    secure: isProduction,
  });

  return response;
}