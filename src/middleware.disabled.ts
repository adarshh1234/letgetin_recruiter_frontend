import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/demo',
  '/builder',
  '/resume',
  '/settings',
  '/account',
  '/profile',
  '/history',
  '/download',
  '/ats',
  '/explore',
  '/drive',
  '/myhub',
  '/geniustest',
  '/exams',
  '/edupye',
  '/mydive',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasToken = Boolean(accessToken || refreshToken);

  // If authenticated user tries to access /auth, redirect to /dashboard
  if (pathname.startsWith('/auth')) {
    if (hasToken) {
      const resumeUrl = new URL('/resume', request.url);
      return NextResponse.redirect(resumeUrl);
    }
    return NextResponse.next();
  }
  //this file is commentd for now 

  // If unauthenticated user tries to access protected paths, redirect to /auth
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (isProtected && !hasToken) {
    const authUrl = new URL('/auth', request.url);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth',
    '/demo',
    '/demo/:path*',
    '/builder',
    '/builder/:path*',
    '/resume',
    '/resume/:path*',
    '/settings',
    '/settings/:path*',
    '/account',
    '/account/:path*',
    '/profile',
    '/profile/:path*',
    '/history',
    '/history/:path*',
    '/download',
    '/download/:path*',
    '/ats',
    '/ats/:path*',
    '/explore',
    '/explore/:path*',
    '/drive',
    '/drive/:path*',
    '/myhub',
    '/myhub/:path*',
    '/geniustest',
    '/geniustest/:path*',
    '/exams',
    '/exams/:path*',
    '/edupye',
    '/edupye/:path*',
    '/mydive',
    '/mydive/:path*',
  ],
};
