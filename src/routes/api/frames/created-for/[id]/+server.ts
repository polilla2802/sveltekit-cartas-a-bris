import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
  const forUserId = params.id;

  if (!forUserId) {
    throw error(400, "User ID not provided");
  }

  try {
    const framesFinalizedVlue = await prisma.frames_finalized.findMany({
      where: {
        createdFor: BigInt(forUserId),
      },
      include: {
        frame_designs: true,
        userCreator: true,
        userFor: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(framesFinalizedVlue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const framesFinalized = JSON.parse(serializedData);

    return json({ framesFinalized }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to retrieve frames_finalized records: ${(err as Error).message}`);
  }
};


export const DELETE: RequestHandler = async ({ params }) => {
  const forUserId = params.id;

  if (!forUserId) {
    throw error(400, "User ID not provided");
  }
  try {
    // Check if the Frame Finalized exists
    const existingFrameFinalized = await prisma.frames_finalized.findMany({
      where: {
        createdFor: BigInt(forUserId),
      },
    });

    if (!existingFrameFinalized) {
      throw new Error("Frames Finalized not found");
    }
    // Delete the frames
    const framesDeleted = await prisma.frames_finalized.deleteMany({
      where: {
        createdFor: BigInt(forUserId),
      },
    });

    return json(
      {
        message: `${framesDeleted.count} Frames Finalized with designID ${forUserId} deleted successfully`,
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