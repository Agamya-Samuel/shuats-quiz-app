export interface UserJwtPayload {
	userId: string;
	role: 'user' | 'admin';
	name: string;
	email: string;
	school: string;
}

export interface AuthResponse {
	success: boolean;
	token?: string;
	error?: string;
}
