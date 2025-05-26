
export interface FrameFinalized {
	id: bigint;
	url: string;
	designId: bigint;
	name: string;
	trackId: string;
	createdBy: bigint;
	createdFro: bigint;
	isPublic: boolean;
	createdAt: string;
}
export interface FrameData {
	frameFinalized: FrameFinalized;
	error?: string;
}

export interface FramePageData {
	frameData: FrameData[];
	error?: string;
}
