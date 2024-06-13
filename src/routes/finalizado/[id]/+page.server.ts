// src/routes/users/[id]/+page.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id } = params;

	console.log(id)

	try {
		const response = await fetch(`/api/frames/finalized/${id}`);
		console.log(response)
		if (!response.ok) {
			throw new Error(`Failed to fetch Frame Finalized with id ${id}`);
		}

		const frameFinalized = await response.json();
		return { frameFinalized };
	} catch (error) {
		console.error('Error loading user:', error);
		throw new Error(`Error loading user: ${error}`);
	}
};
