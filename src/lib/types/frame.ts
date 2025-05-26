export interface FrameFinalized {
	id: bigint;
	url: string;
	designId: bigint;
	name: string | undefined;
	trackId: string | undefined;
	createdAt: string;
	createdBy: bigint | undefined;
	createdFor: bigint | undefined;
	isPublic: boolean | undefined;
}

export interface FrameDesign {
	id: bigint;
	url: string | undefined;
	typeId: bigint | undefined;
	name: string | undefined;
	createdAt: string;
	createdBy: bigint | undefined;
	isPublic: boolean | undefined;
}

export interface FrameData {
	frameFinalized: FrameFinalized;
	frameDesign: FrameDesign;
	error?: string;
}

export interface FramePageData {
	frameData: FrameData[];
	error?: string;
}
