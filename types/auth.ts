export interface UserJwtPayload {
	userId: string;
	role: 'user' | 'superadmin' | 'maintainer';
	// Optional fields for Maintainer/Super Admin
	username?: string;
	// Optional fields for regular users
	name?: string;
	email?: string;
	school?: string;
	mobile?: string;
	rollNo?: string;
	branch?: string;
	address?: string;
}

export interface AuthResponse {
	success: boolean;
	token?: string;
	error?: string;
}
