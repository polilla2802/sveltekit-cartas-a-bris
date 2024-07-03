import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
	const uid = params.uid;

	if (!uid) {
		throw error(400, 'user ID not provided');
	}

	try {
		// Fetch the user by ID
		const userValue = await prisma.user.findUnique({
			where: {
				firebaseUid: uid,
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
