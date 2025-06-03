// src/routes/users/[id]/+page.ts
import type { FrameDesignData } from '$lib/types/frame';
import { FrameTypes, getQRCodeImage } from '$utils/getQRcode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const { id } = params;

	try {
		const response = await fetch(`/api/frames/designs/${id}`);
		if (!response.ok) {
			console.log(`Failed to fetch Frame Design with id ${id}`);
			throw new Error(`Failed to fetch Frame Design with id ${id}`);
		}

		const frameDesignData: FrameDesignData = await response.json();

		// ✅ Extract origin (base URL) from the request
		const baseUrl = new URL(request.url).origin;
		const qrCode = getQRCodeImage(baseUrl, id, FrameTypes.designs);

		return { frameDesign: frameDesignData.frameDesign, error: null, qrCode: qrCode };
	} catch (error) {
		console.log('Error loading frame design:', error);
		return { frameDesign: null, error: 'Failed to load frame design. Please try again later.', qrCode: null };
	}
};
