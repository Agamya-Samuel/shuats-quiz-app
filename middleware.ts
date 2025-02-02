import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
	// Paths that don't require authentication
	const publicPaths = [
		'/login',
		'/register',
		'/',
		'/super-admin/login',
		'/super-admin',
		'/user/quiz',
		'/user/dashboard',
		'/admin/dashboard',
		'/admin/quiz',
		'/result',
		'/leaderboard',
	];
	const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

	// Get token from cookie
	const token = request.cookies.get('token')?.value;

	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// super admin login
	if (request.nextUrl.pathname === '/super-admin') {
		const superAdminPassword =
			request.cookies.get('super_admin_auth')?.value;
		if (superAdminPassword !== process.env.SUPER_ADMIN_PASSWORD) {
			return NextResponse.redirect(
				new URL('/super-admin/login', request.url)
			);
		}
		return NextResponse.next();
	}

	if (token) {
		const payload = await verifyToken(token);

		if (!payload && !isPublicPath) {
			const response = NextResponse.redirect(
				new URL('/login', request.url)
			);
			response.cookies.delete('token');
			return response;
		}

		// Protect admin routes
		if (
			request.nextUrl.pathname.startsWith('/admin') &&
			payload?.role !== 'admin'
		) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		// Protect super admin routes
		// if (request.nextUrl.pathname.startsWith('/super-admin')) {
		// 	const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
		// 	const providedPassword =
		// 		request.cookies.get('super_admin_auth')?.value;

		// 	console.log('providedPassword', providedPassword);
		// 	console.log('superAdminPassword', superAdminPassword);

		// 	if (!providedPassword || providedPassword !== superAdminPassword) {
		// 		return NextResponse.redirect(
		// 			new URL('/super-admin/login', request.url)
		// 		);
		// 	}
		// }
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
