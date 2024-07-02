// src/routes/users/[id]/+page.ts
import { sortFrames } from '$utils/sortFrames';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let finalized: any = [];
	let sortedFinalized: any = [];
	try {
		const response = await fetch(`/api/frames/finalized/public`);
		// console.log(response)
		if (!response.ok) {
			throw new Error(`Failed to fetch Frame Finalized`);
		}

		let data = await response.json();
		finalized = data.framesFinalized;
		// Sort frames by createdAt field
		sortedFinalized = sortFrames(finalized);

		// console.log(sortedFinalized)
		return { sortedFinalized };
	} catch (error) {
		console.log('Error loading frames finalized:', error);
		return { sortedFinalized: [], error: 'Failed to load frames finalized. Please try again later.' };
	}
};
