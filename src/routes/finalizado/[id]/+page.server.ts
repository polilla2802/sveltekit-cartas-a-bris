// src/routes/users/[id]/+page.ts
import type { FrameFinalizedData } from '$lib/types/frame';
import { FrameTypes, getQRCodeImage } from '$utils/getQRcode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const { id } = params;

	try {
		const response = await fetch(`/api/frames/finalized/${id}`);
		if (!response.ok) {
			console.log(`Failed to fetch Frame Finalized with id ${id}`);
			throw new Error(`Failed to fetch Frame Finalized with id ${id}`);
		}

		const frameFinalizedData: FrameFinalizedData = await response.json();

		// ✅ Extract origin (base URL) from the request
		const baseUrl = new URL(request.url).origin;
		const qrCode = getQRCodeImage(baseUrl, id, FrameTypes.finalized);

		return { frameFinalized: frameFinalizedData.frameFinalized, error: null, qrCode: qrCode };
	} catch (error) {
		console.log('Error loading user:', error);
		return { frameFinalized: null, error: 'Failed to load Frame Finalized. Please try again later.', qrCode: null };
	}
};
