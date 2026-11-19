import { NextResponse, type NextRequest } from 'next/server';
import { LIFEPLAN_ACCESS_TOKEN_KEY } from './common/configs/base.config';

const publicPaths = ['/'];
const guestPaths = ['/login', '/register'];
const protectedPaths = [
  '/dashboard',
  '/vision',
  '/goals',
  '/plans',
  '/tasks',
  '/reports',
  '/profile',
  '/change-password',
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  if (publicPaths.includes(pathname)) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get(LIFEPLAN_ACCESS_TOKEN_KEY)?.value);
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (guestPaths.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)'],
};
