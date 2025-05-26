export interface User {
	id: bigint;
	firebaseUid: string;
	userName: string;
	email: string;
	phoneNumber: string | undefined;
	gender: string | undefined;
	age: number | undefined;
	createdAt: string;
}