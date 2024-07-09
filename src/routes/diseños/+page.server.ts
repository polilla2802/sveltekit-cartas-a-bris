// src/routes/users/[id]/+page.ts
import { sortFrames } from "$utils/sortFrames";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  let designs: any = [];
  let sortedDesigns: any = [];
  try {
    const response = await fetch(`/api/frames/designs/public`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch Frame Designs`);
    }

    let data = await response.json();
    console.log(data);
    designs = data.frameDesigns;
    // Sort frames by createdAt field
    sortedDesigns = sortFrames(designs);
    console.log(sortedDesigns);
    return { sortedDesigns };
  } catch (error) {
    console.log("Error loading frame designs:", error);
    return {
      sortedDesigns: [],
      error: "Failed to load frame designs. Please try again later.",
    };
  }
};
