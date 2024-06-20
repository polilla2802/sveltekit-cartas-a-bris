import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const GET: RequestHandler = async ({ params }) => {
  const designId = params.id;

  if (!designId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Fetch the Frame Finalized by ID
    const framesFinalized = await prisma.frame_finalized.findMany({
      where: {
        designId: parseInt(designId)
      },
      include: {
        frame_designs: true,
        User: true,
      },
    });

    if (!framesFinalized) {
      throw new Error("Frames Finalized not found");
    }

    return json(
      { framesFinalized },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(
      500,
      `Failed to fetch Frames Finalized: ${(err as Error).message}`
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const designId = params.id;

  if (!designId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Check if the Frame Finalized exists
    const existingFrameFinalized = await prisma.frame_finalized.findMany({
      where: {
        designId: parseInt(designId),
      },
    });

    if (!existingFrameFinalized) {
      throw new Error("Frames Finalized not found");
    }
    // Delete the frames
    const framesDeleted = await prisma.frame_finalized.deleteMany({
      where: {
        designId: parseInt(designId),
      },
    });

    console.log(framesDeleted);

    return json(
      {
        message: `${framesDeleted.count} Frames Finalized with designID ${designId} deleted successfully`,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(
      500,
      `Failed to delete Frames Finalized: ${(err as Error).message}`
    );
  }
};
