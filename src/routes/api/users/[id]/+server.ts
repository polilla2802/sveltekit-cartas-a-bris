import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
	const userId = params.id;

	if (!userId) {
		throw error(400, 'user ID not provided');
	}

	try {
		// Fetch the user by ID
		const userValue = await prisma.user.findUnique({
			where: {
				id: BigInt(userId),
			},
		});

		// Serialize with the custom replacer to convert BigInt to Number
		const serializedData = JSON.stringify(userValue, bigIntToString);

		// Parse the serialized data back to an object (optional step)
		const user = JSON.parse(serializedData);

		if (!user) {
			throw new Error('user not found');
		}

		return json({ user }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to fetch user: ${(err as Error).message}`);
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const userId = params.id;

	if (!userId) {
		throw error(400, 'user ID not provided');
	}

	const data = await request.formData();
	const userNameValue = data.get('userName');
	const nameValue = data.get('name');
	const phoneNumberValue = data.get('phoneNumber');
	const emailValue = data.get('email');
	const passwordValue = data.get('password');
	const genderValue = data.get('gender');
	const ageValue = data.get('age');
	let age;
	try {
		// Fetch the user by ID
		const existingUser = await prisma.user.findUnique({
			where: {
				id: BigInt(userId),
			},
		});

		if (!existingUser) {
			throw new Error('user not found');
		}

		if (!ageValue) {
			age = existingUser.age;
		} else {
			age = parseInt(ageValue as string);
		}

		const userName = (userNameValue as string)
		const name = (nameValue as string)
		const phoneNumber = (phoneNumberValue as string)
		const email = (emailValue as string)
		const password = (passwordValue as string)
		const gender = (genderValue as string)

		// Update user fields
		const updatedUserValue = await prisma.user.update({
			where: {
				id: BigInt(userId),
			},
			data: {
				userName: userName ?? existingUser.userName,
				name: name ?? existingUser.name,
				phoneNumber: phoneNumber ?? existingUser.phoneNumber,
				email: email ?? existingUser.email,
				password: password ?? existingUser.password,
				gender: gender ?? existingUser.gender,
				age: age ?? existingUser.age,
			},
		});

		// Serialize with the custom replacer to convert BigInt to Number
		const serializedData = JSON.stringify(updatedUserValue, bigIntToString);

		// Parse the serialized data back to an object (optional step)
		const updatedUser = JSON.parse(serializedData);

		return json({ message: 'user updated:', user: updatedUser }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to update user: ${(err as Error).message}`);
	}
};


export const DELETE: RequestHandler = async ({ params }) => {
	const userId = params.id;

	if (!userId) {
		throw error(400, 'user ID not provided');
	}

	try {
		// Check if the user exists
		const existingUser = await prisma.user.findUnique({
			where: {
				id: BigInt(userId),
			},
		});

		if (!existingUser) {
			throw new Error('user not found');
		}

		// Delete the user
		await prisma.user.delete({
			where: {
				id: BigInt(userId),
			},
		});

		return json({ message: `user with ID ${userId} deleted successfully` }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to delete user: ${(err as Error).message}`);
	}
};