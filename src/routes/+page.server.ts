// src/routes/users/[id]/+page.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  let randomFrameOfTheDay: any;
  try {
    const response = await fetch(`/api/frames/finalized/public`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch Random Frame Finalized`);
    }

    let data = await response.json();
    console.log(data);
    randomFrameOfTheDay = data.framesFinalized;
    console.log(randomFrameOfTheDay);

    return { randomFrameOfTheDay };
  } catch (error) {
    console.log("Error loading Random Frame Finalized:", error);
    return {
      error: "Failed to load Random Frame Finalized. Please try again later.",
    };
  }
};
