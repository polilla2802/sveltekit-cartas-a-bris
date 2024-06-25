// src/routes/users/[id]/+page.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id } = params;

	console.log(id)

	try {
		const response = await fetch(`/api/frames/designs/${id}`);
		console.log(response)
		if (!response.ok) {
			console.log(`Failed to fetch Frame Design with id ${id}`);
			throw new Error(`Failed to fetch Frame Design with id ${id}`);
		}

		const frameDesign = await response.json();

		console.log(frameDesign)
		return { frameDesign };
	} catch (error) {
		console.log('Error loading frame design:', error);
		return { frameDesign: {}, error: 'Failed to load frame design. Please try again later.' };
	}
};
