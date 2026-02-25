import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting storage (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const setNoIndex = (res: NextResponse) => {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  };

  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com blob:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://api.stripe.com https://cdn.sanity.io https://*.sanity.io https://speed.cloudflare.com",
    "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-src https://js.stripe.com https://www.googletagmanager.com",
  ].join('; ');

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicy
  );

  // Rate Limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Protected Routes - Require Authentication
  const protectedPaths = [
    '/account',
    '/services/[slug]/book',
    '/reviews/write'
  ];

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path.replace('[slug]', ''))
  );

  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Even when authenticated, keep account pages out of search results.
    if (request.nextUrl.pathname.startsWith('/account')) {
      setNoIndex(response);
    }
  }

  // API Route Protection
  const protectedApiPaths = [
    '/api/orders',
    '/api/profile',
    '/api/manage-subscription',
    '/api/reviews'
  ];

  const isProtectedApi = protectedApiPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedApi && request.method !== 'OPTIONS') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
