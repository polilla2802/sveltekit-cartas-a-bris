import type { User } from "./user";

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
	userCreator: User | undefined;
	userFor: User | undefined;
	frame_designs: FrameDesign | undefined;
}

export interface FrameDesign {
	id: bigint;
	url: string | undefined;
	typeId: bigint | undefined;
	name: string | undefined;
	createdAt: string;
	createdBy: bigint | undefined;
	isPublic: boolean | undefined;
	user: User | undefined;
	frame_types: FrameType | undefined;
}

export interface FrameType {
	id: bigint;
	type: string | undefined;
	createdAt: string;
}

export interface FrameDesignData {
	frameDesign: FrameDesign;
	error?: string;
}

export interface FrameDesignsData {
	frameDesigns: FrameDesign[];
	error?: string;
}

export interface FramesFinalizedData {
	framesFinalized: FrameFinalized[];
	error?: string;
}