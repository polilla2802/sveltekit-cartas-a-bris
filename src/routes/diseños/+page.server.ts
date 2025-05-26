// src/routes/users/[id]/+page.ts
import type { FramePageData } from "$lib/types/frame";
import { sortFrames } from "$utils/sortFrames";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`/api/frames/designs/public`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Frame Designs`);
    }

    const framePageData: FramePageData = await response.json();
    // Sort brochure data by 'order' field in ascending order
    framePageData.frameData.sort((a: any, b: any) => {
      if (a.order === null) return 1; // Place `a` after `b`
      if (b.order === null) return -1; // Place `b` after `a`
      return a.order - b.order; // Regular numerical comparison
    });

    return { frameData: framePageData.frameData };
  } catch (error) {
    console.log("Error loading frame designs:", error);
    return {
      sortedDesigns: [],
      error: "Failed to load frame designs. Please try again later.",
    };
  }
};
