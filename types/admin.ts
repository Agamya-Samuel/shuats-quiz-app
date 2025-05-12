export interface Admin {
	email: string;
	password: string;
}

export interface AdminJwtPayload {
	userId: number;
	email: string;
	role: 'admin';
}
