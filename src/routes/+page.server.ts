// src/routes/users/[id]/+page.ts
import type { FrameFinalized, FramesFinalizedData } from "$lib/types/frame";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`/api/frames/finalized/public`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Public Frames Finalized`);
    }

    const framesFinalizedData: FramesFinalizedData = await response.json();
    framesFinalizedData.framesFinalized.sort(
      (a: FrameFinalized, b: FrameFinalized) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    );

    return { framesFinalized: framesFinalizedData.framesFinalized };
  } catch (error) {
    console.log("Error loading Public Frames Finalized:", error);
    return {
      error: "Failed to load Public Frames Finalized. Please try again later.",
    };
  }
};
