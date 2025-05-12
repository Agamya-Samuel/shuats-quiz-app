export interface AddressData {
	country: string;
	address1: string;
	address2?: string;
	area: string;
	city: string;
	pincode: string;
	state: string;
}

export interface UserJwtPayload {
	userId: number;
	role: 'user';
	name: string;
	email: string;
	mobile: string;
	school: string;
	rollno: string;
	branch: string;
	address: AddressData;
}

export interface UpdateUserData {
	id: number;
	name: string;
	email: string;
	mobile: string;
	school: string;
	rollno: string;
	branch: string;
	address: AddressData;
}

export interface ForgotPasswordData {
	userId: number;
	email: string;
	purpose: 'password-reset';
	role: 'user';
}

export interface ISubmission {
	userId: number;
	questionId: number;
	selectedOption: string;
	correctOption: string;	
}
