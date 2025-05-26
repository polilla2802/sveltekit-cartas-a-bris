import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$lib/prisma";
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async () => {
  try {
    const framesFinalizedValue = await prisma.frames_finalized.findMany({
      where: {
        isPublic: true,
      },
      include: {
        frame_designs: true,
        userCreator: true,
        userFor: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(framesFinalizedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameData = JSON.parse(serializedData);

    return json(
      { frameData },
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
      `Failed to retrieve frames_finalized records: ${(err as Error).message}`
    );
  }
};
