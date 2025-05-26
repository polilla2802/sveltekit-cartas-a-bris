// src/routes/users/[id]/+page.ts
import type { FrameDesign, FrameDesignsData } from "$lib/types/frame";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`/api/frames/designs/public`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Frame Designs`);
    }

    const frameDesignsData: FrameDesignsData = await response.json();
    // Sort brochure data by 'order' field in ascending order
    frameDesignsData.frameDesigns.sort(
      (a: FrameDesign, b: FrameDesign) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    );
    return { frameDesigns: frameDesignsData.frameDesigns, error: null };
  } catch (error) {
    console.log("Error loading frame designs:", error);
    return {
      sortedDesigns: [],
      error: "Failed to load frame designs. Please try again later.",
    };
  }
};
