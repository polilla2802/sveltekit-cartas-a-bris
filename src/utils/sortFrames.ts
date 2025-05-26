export function sortFrames(frames: []): any[] {
	return frames.sort(
		(a: any, b: any) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
}

