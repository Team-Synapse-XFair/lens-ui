import { NextResponse } from 'next/server'

export function middleware(request) {
    const publicPaths = ["/api/auth", "/auth/login", "/", "/register", "/about", "/forgot-password"];
    if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path*', '/settings/:path*', '/dashboard/:path*', '/report/:path*'],
};