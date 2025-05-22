export interface Admin {
	username: string;
	password: string;
}

export interface AdminJwtPayload {
	userId: number;
	username: string;
	role: 'admin';
}
