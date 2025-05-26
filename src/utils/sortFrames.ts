import type { FrameData } from "$lib/types/frame";

export function sortFrames(frames: []): FrameData[] {
	return frames.sort(
		(a: any, b: any) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
}

