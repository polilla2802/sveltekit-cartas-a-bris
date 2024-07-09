// src/routes/users/[id]/+page.ts
import { sortFrames } from "$utils/sortFrames";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  let framesFinalized: any = [];
  let sortedFrames: any = [];
  try {
    const response = await fetch(`/api/frames/finalized/public`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch Public Frames Finalized`);
    }

    let data = await response.json();
    console.log(data);
    framesFinalized = data.framesFinalized;
    sortedFrames = sortFrames(framesFinalized);

    console.log(framesFinalized);

    return { framesFinalized };
  } catch (error) {
    console.log("Error loading Public Frames Finalized:", error);
    return {
      error: "Failed to load Public Frames Finalized. Please try again later.",
    };
  }
};
