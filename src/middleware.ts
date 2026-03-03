import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // We want to skip middleware for:
    // 1. API routes (so NextAuth can handle logins and magic links)
    // 2. The /access page itself
    // 3. Static files / images

    const path = request.nextUrl.pathname;

    if (
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path === '/access' ||
        path.match(/\.(.*)$/) // Exclude files
    ) {
        return NextResponse.next();
    }

    // Check if they have the site access cookie OR a valid next-auth session cookie
    const hasAccessCookie = request.cookies.has('site_access');
    const hasSession =
        request.cookies.has('authjs.session-token') ||
        request.cookies.has('__Secure-authjs.session-token') ||
        request.cookies.has('next-auth.session-token') ||
        request.cookies.has('__Secure-next-auth.session-token');

    if (!hasAccessCookie && !hasSession) {
        // Redirect to the passcode page
        return NextResponse.redirect(new URL('/access', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply middleware to everything except the paths we explicitly skip inside the function
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
