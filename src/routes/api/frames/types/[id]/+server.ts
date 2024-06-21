import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async ({ params }) => {
  const frameTypeId = params.id;

  if (!frameTypeId) {
    throw error(400, "Frame Type ID not provided");
  }

  try {
    // Fetch the Frame Type by ID
    const frameTypeValue = await prisma.frame_types.findUnique({
      where: {
        id: BigInt(frameTypeId),
      }
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(frameTypeValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameType = JSON.parse(serializedData);

    if (!frameType) {
      throw new Error("Frame Type not found");
    }

    return json(
      { frameType },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to fetch Frame Type: ${(err as Error).message}`);
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {

  const frameTypeId = params.id;

  if (!frameTypeId) {
    throw error(400, "Frame Type ID not provided");
  }

  const data = await request.formData();
  const frameTypeValue = data.get("type");

  try {
    // Fetch the existing frame Type by ID
    const existingFrameType = await prisma.frame_types.findUnique({
      where: {
        id: BigInt(frameTypeId),
      },
    });

    if (!existingFrameType) {
      throw error(404, "Frame Type not found");
    }

    // Use existing values if new ones are not provided, ensuring the types are consistent
    const frameType = frameTypeValue
      ? (frameTypeValue as string)
      : existingFrameType.type;

    // Update the frame Type in the database
    const updatedFrameTypeValue = await prisma.frame_types.update({
      where: {
        id: BigInt(frameTypeId),
      },
      data: {
        type: frameType,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(updatedFrameTypeValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const updatedFrameType = JSON.parse(serializedData);

    return json(
      {
        message: "Frame Type updated successfully",
        frameType: updatedFrameType,
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
      `Failed to update Frame Type: ${(err as Error).message}`
    );
  }
};
export const DELETE: RequestHandler = async ({ params }) => {
  const frameTypeId = params.id;

  if (!frameTypeId) {
    throw error(400, "Frame Type ID not provided");
  }

  try {
    // Check if the Frame Type exists
    const existingFrameType = await prisma.frame_types.findUnique({
      where: {
        id: BigInt(frameTypeId),
      },
    });

    if (!existingFrameType) {
      throw new Error("Frame Type not found");
    }
    // Delete the user
    await prisma.frame_types.delete({
      where: {
        id: BigInt(frameTypeId),
      },
    });

    return json(
      { message: `Frame Type with ID ${frameTypeId} deleted successfully` },
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
      `Failed to delete Frame Type: ${(err as Error).message}`
    );
  }
};
