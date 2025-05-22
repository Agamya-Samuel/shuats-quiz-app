import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
	// Paths that don't require authentication
	const publicPaths = [
		'/',
		'/login',
		'/register',
		'/admin/login',
		'/super-admin/login',
	];
	const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

	// Get token from cookie
	const token = request.cookies.get('token')?.value;

	// if token is not present and path is not public, => redirect to login
	if (!token && !isPublicPath) {
		const path = request.nextUrl.pathname;

		// if path is user, redirect to user login
		if (request.nextUrl.pathname.startsWith('/user')) {
			return NextResponse.redirect(
				new URL(`/login?redirect=${path}`, request.url)
			);
		}

		// if path is admin, redirect to admin login
		if (request.nextUrl.pathname.startsWith('/admin')) {
			return NextResponse.redirect(
				new URL(`/admin/login?redirect=${path}`, request.url)
			);
		}

		// if path is super admin, redirect to super admin login
		if (request.nextUrl.pathname.startsWith('/super-admin')) {
			return NextResponse.redirect(
				new URL(`/super-admin/login?redirect=${path}`, request.url)
			);
		}
	}

	if (token) {
		const payload = await verifyToken(token);

		// Protect user routes
		if (
			request.nextUrl.pathname.startsWith('/user') &&
			payload?.role !== 'user' &&
			request.nextUrl.pathname !== '/user/login'
		) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		// Protect admin routes
		if (
			request.nextUrl.pathname.startsWith('/admin') &&
			payload?.role !== 'admin' &&
			request.nextUrl.pathname !== '/admin/login'
		) {
			return NextResponse.redirect(new URL('/admin/login', request.url));
		}

		// Protect super admin routes
		if (
			request.nextUrl.pathname.startsWith('/super-admin') &&
			payload?.role !== 'superadmin' &&
			request.nextUrl.pathname !== '/super-admin/login'
		) {
			return NextResponse.redirect(
				new URL('/super-admin/login', request.url)
			);
		}

		// if token is not present and path is not public, => redirect to login
		if (!payload && !isPublicPath) {
			const response = NextResponse.redirect(
				new URL('/login', request.url)
			);
			response.cookies.delete('token');
			return response;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
