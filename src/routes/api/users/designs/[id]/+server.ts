import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
  const userId = params.id;

  if (!userId) {
    throw error(400, "User ID not provided");
  }

  try {
    const frameDesignsValue = await prisma.frame_designs.findMany({
      where: {
        createdBy: BigInt(userId),
      },
      include: {
        frame_types: true,
        user: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(frameDesignsValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameDesigns = JSON.parse(serializedData);

    return json({ frameDesigns }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to retrieve frame_designs records: ${(err as Error).message}`);
  }
};


export const DELETE: RequestHandler = async ({ params }) => {
  const userId = params.id;

  if (!userId) {
    throw error(400, "User ID not provided");
  }
  try {
    // Check if the Frame Finalized exists
    const existingFrameDesigns = await prisma.frame_designs.findMany({
      where: {
        createdBy: BigInt(userId),
      },
    });

    if (!existingFrameDesigns) {
      throw new Error("Frame Designs not found");
    }
    // Delete the frames
    const framesDeleted = await prisma.frames_finalized.deleteMany({
      where: {
        id: BigInt(userId),
      },
    });

    return json(
      {
        message: `${framesDeleted.count} Frame Designs with userId ${userId} deleted successfully`,
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
      `Failed to delete Frame Designs: ${(err as Error).message}`
    );
  }
};