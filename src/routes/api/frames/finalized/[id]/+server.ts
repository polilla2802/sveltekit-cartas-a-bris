import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const GET: RequestHandler = async ({ params }) => {
	const frameId = params.id;

	if (!frameId) {
		throw error(400, 'Frame Finalized ID not provided');
	}

	try {
		// Fetch the Frame Finalized by ID
		const frameFinalized = await prisma.frame_finalized.findUnique({
			where: {
				id: parseInt(frameId),
			},
			include: {
				frame_designs: true,
				User: true
			}
		});

		if (!frameFinalized) {
			throw new Error('Frame Finalized not found');
		}

		return json({ frameFinalized }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to fetch Frame Finalized: ${(err as Error).message}`);
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const frameFinalizedId = params.id;

	if (!frameFinalizedId) {
		throw error(400, 'Frame Finalized ID not provided');
	}

	const data = await request.formData();
	const fileValue = data.get('file') as File;
	const nameValue = data.get('name');
	const frameDesignIdValue = data.get('frameId');
	const userIdValue = data.get('userId');
	try {
		// Fetch the user by ID
		const existingFrameFinalized = await prisma.frame_finalized.findUnique({
			where: {
				id: parseInt(frameFinalizedId),
			},
		});

		if (!existingFrameFinalized) {
			throw new Error('Frame Finalized not found');
		}

		const storageRef = ref(storage, `frame_finalized/${fileValue.name}`);
		const snapshot = await uploadBytes(storageRef, fileValue);
		const downloadURL = await getDownloadURL(snapshot.ref);
		const name = (nameValue as string)

		let frameDesignId;
		let userId;

		if (!frameDesignId) {
			frameDesignId = existingFrameFinalized.frameId;
		} else {
			frameDesignId = parseInt(frameDesignIdValue as string);
		}

		if (!userId) {
			userId = existingFrameFinalized.userId;
		} else {
			userId = parseInt(userIdValue as string);
		}

		// Update user fields
		const updatedFrameFinalized = await prisma.frame_finalized.update({
			where: {
				id: parseInt(frameFinalizedId),
			},
			data: {
				url: downloadURL ?? existingFrameFinalized.url,
				name: name ?? existingFrameFinalized.name,
				frameId: frameDesignId ?? existingFrameFinalized.frameId,
				userId: userId ?? existingFrameFinalized.userId
			},
		});

		return json({ message: 'Frame Finalized updated:', frameFinalized: updatedFrameFinalized }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to update Frame Finalized: ${(err as Error).message}`);
	}
};


export const DELETE: RequestHandler = async ({ params }) => {
	const frameFinalizedId = params.id;

	if (!frameFinalizedId) {
		throw error(400, 'Frame Finalized ID not provided');
	}

	try {
		// Check if the Frame Finalized exists
		const existingFrameFinalized = await prisma.frame_finalized.findUnique({
			where: {
				id: parseInt(frameFinalizedId),
			},
		});

		if (!existingFrameFinalized) {
			throw new Error('Frame Finalized not found');
		}
		// Delete the user
		await prisma.frame_finalized.delete({
			where: {
				id: parseInt(frameFinalizedId),
			},
		});

		return json({ message: `Frame Finalized with ID ${frameFinalizedId} deleted successfully` }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});

	} catch (err) {
		console.error(err);
		throw error(500, `Failed to delete Frame Finalized: ${(err as Error).message}`);
	}
};