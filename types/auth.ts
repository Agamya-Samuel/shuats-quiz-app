export interface UserJwtPayload {
	userId: string;
	role: 'user' | 'superadmin' | 'maintainer';
	name?: string;
	email?: string;
	school?: string;
	// Optional fields for regular users
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
