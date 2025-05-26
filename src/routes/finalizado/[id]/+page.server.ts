// src/routes/users/[id]/+page.ts
import type { FrameFinalizedData } from '$lib/types/frame';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id } = params;

	console.log(id)

	try {
		const response = await fetch(`/api/frames/finalized/${id}`);
		console.log(response)
		if (!response.ok) {
			console.log(`Failed to fetch Frame Finalized with id ${id}`);
			throw new Error(`Failed to fetch Frame Finalized with id ${id}`);
		}

		const frameFinalizedData: FrameFinalizedData = await response.json();

		return { frameFinalized: frameFinalizedData.frameFinalized, error: null };
	} catch (error) {
		console.log('Error loading user:', error);
		return { frameFinalized: null, error: 'Failed to load Frame Finalized. Please try again later.' };
	}
};
