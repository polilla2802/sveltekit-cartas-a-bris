import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
	const userId = params.id;

	if (!userId) {
		throw error(400, 'User ID not provided');
	}

	try {
		// Fetch the user by ID
		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(userId),
			},
		});

		if (!user) {
			throw new Error('User not found');
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
		throw error(400, 'User ID not provided');
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
				id: parseInt(userId),
			},
		});

		if (!existingUser) {
			throw new Error('User not found');
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
		const updatedUser = await prisma.user.update({
			where: {
				id: parseInt(userId),
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

		return json({ message: 'User updated:', user: updatedUser }, {
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
		throw error(400, 'User ID not provided');
	}

	try {
		// Check if the user exists
		const existingUser = await prisma.user.findUnique({
			where: {
				id: parseInt(userId),
			},
		});

		if (!existingUser) {
			throw new Error('User not found');
		}

		// Delete the user
		await prisma.user.delete({
			where: {
				id: parseInt(userId),
			},
		});

		return json({ message: `User with ID ${userId} deleted successfully` }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to delete user: ${(err as Error).message}`);
	}
};