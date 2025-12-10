import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const allowedOrigins = [
  "https://ontap.ph",
  "https://darkslategray-horse-918539.hostingersite.com",
  "http://localhost:3000", 
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://ontap-creatives-website.vercel.app" // ADD THIS
];

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/verify-email',
  '/api/email-verification',
  '/api/auth/forgot-password',
  '/api/auth/verify-otp',
  '/api/auth/reset-password',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/auth/me',
  '/api/auth/session',
  '/api/visitor',
  '/api/visit-session',
  '/api/products',
  // Read-only or cross-site accessed endpoints
  '/api/feedbacks',
  '/api/orders',
  '/api/voucher',
  // Cart add needs pre-auth CORS; route will enforce auth
  '/api/cart',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const path = request.nextUrl.pathname;
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control',
      'Access-Control-Allow-Credentials': 'true', // IMPORTANT for cookies
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Set CORS headers for all responses
  const response = NextResponse.next();
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control');
  response.headers.set('Access-Control-Allow-Credentials', 'true'); // IMPORTANT

  // Check if authentication is required
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`));
  
  if (!isPublicPath) {
    // Check for auth token
    const authToken = request.cookies.get('auth-token')?.value;
    const userSession = request.cookies.get('user-session')?.value;

    // Try to get token from Authorization header if not in cookies
    if (!authToken) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (error) {
          // Invalid token
          if (path.startsWith('/api/')) {
            const headers: Record<string, string> = {
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control',
              'Access-Control-Allow-Credentials': 'true',
            };
            if (isAllowedOrigin) headers['Access-Control-Allow-Origin'] = origin;
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401, headers }
            );
          }
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else {
        // No token at all
        if (path.startsWith('/api/')) {
          const headers: Record<string, string> = {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control',
            'Access-Control-Allow-Credentials': 'true',
          };
          if (isAllowedOrigin) headers['Access-Control-Allow-Origin'] = origin;
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers }
          );
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // Verify cookie token
      try {
        jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key');
      } catch (error) {
        // Token is invalid or expired
        if (path.startsWith('/api/')) {
          const headers: Record<string, string> = {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control',
            'Access-Control-Allow-Credentials': 'true',
          };
          if (isAllowedOrigin) headers['Access-Control-Allow-Origin'] = origin;
          return NextResponse.json(
            { error: 'Invalid or expired session' },
            { status: 401, headers }
          );
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes and pages except static files
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};