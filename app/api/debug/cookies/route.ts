// app/api/debug/cookies/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  
  return NextResponse.json({
    cookies: cookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
    headers: {
      authorization: request.headers.get('authorization'),
      origin: request.headers.get('origin'),
    },
    url: request.url,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_STAFF_JWT_SECRET: !!process.env.STAFF_JWT_SECRET,
    }
  });
}