import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
  const designId = params.id;

  if (!designId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Fetch the Frame Finalized by ID
    const framesFinalizedValue = await prisma.frame_finalized.findMany({
      where: {
        designId: BigInt(designId)
      },
      include: {
        frame_designs: true,
        user: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(framesFinalizedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const framesFinalized = JSON.parse(serializedData);

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
        designId: BigInt(designId),
      },
    });

    if (!existingFrameFinalized) {
      throw new Error("Frames Finalized not found");
    }
    // Delete the frames
    const framesDeleted = await prisma.frame_finalized.deleteMany({
      where: {
        designId: BigInt(designId),
      },
    });

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
