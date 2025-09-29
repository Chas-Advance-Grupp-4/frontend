export type Role = "admin" | "driver" | "customer";

export type User = {
	id: string;
	email: string;
	role: Role;
	username: string;
	created_at: string;
};

export type LoginResponse = {
	access_token: string;
	user: User;
};
