// src/routes/users/[id]/+page.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id } = params;

	console.log(id)

	try {
		const response = await fetch(`/api/frames/designs/${id}`);
		console.log(response)
		if (!response.ok) {
			throw new Error(`Failed to fetch Frame Design with id ${id}`);
		}

		const frameDesign = await response.json();
		return { frameDesign };
	} catch (error) {
		console.error('Error loading user:', error);
		throw new Error(`Error loading user: ${error}`);
	}
};
