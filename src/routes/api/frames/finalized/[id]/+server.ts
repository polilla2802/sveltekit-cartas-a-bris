import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { storage } from "$lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { bigIntToString } from "$utils/bigIntToString";
import { parseBoolean } from "$utils/parseBoolean";

export const GET: RequestHandler = async ({ params }) => {
  const frameFinalizedId = params.id;

  if (!frameFinalizedId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Fetch the Frame Finalized by ID
    const frameFinalizedValue = await prisma.frames_finalized.findUnique({
      where: {
        id: BigInt(frameFinalizedId),
      },
      include: {
        frame_designs: true,
        userCreator: true,
        userFor: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(frameFinalizedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameFinalized = JSON.parse(serializedData);

    if (!frameFinalized) {
      throw new Error("Frame Finalized not found");
    }

    return json(
      { frameFinalized },
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
      `Failed to fetch Frame Finalized: ${(err as Error).message}`
    );
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const frameFinalizedId = params.id;

  if (!frameFinalizedId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  console.log(frameFinalizedId);

  const data = await request.formData();
  const fileValue = data.get("file") as File | null; // File can be optional
  const nameValue = data.get("name");
  const frameDesignIdValue = data.get("designId");
  const userIdValue = data.get("userId");
  const createdAtValue = data.get("createdAt");
  const isPublicValue = data.get("isPublic");

  try {
    // Fetch the existing frame finalized by ID
    const existingFrameFinalized = await prisma.frames_finalized.findUnique({
      where: {
        id: BigInt(frameFinalizedId),
      },
    });

    if (!existingFrameFinalized) {
      throw error(404, "Frame Finalized not found");
    }

    let downloadURL = existingFrameFinalized.url;

    // Handle file upload if a new file is provided
    if (fileValue) {
      const storageRef = ref(storage, `frames_finalized/${fileValue.name}`);
      const snapshot = await uploadBytes(storageRef, fileValue);
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    // Use existing values if new ones are not provided, ensuring the types are consistent
    const name = nameValue
      ? (nameValue as string)
      : existingFrameFinalized.name;


    // Ensure frameDesignId is a number or fallback to existing value
    const frameDesignId =
      frameDesignIdValue !== null && frameDesignIdValue !== undefined
        ? BigInt(frameDesignIdValue as string)
        : existingFrameFinalized.designId;


    // Ensure userId is a number or fallback to existing value
    const userId =
      userIdValue !== null && userIdValue !== undefined
        ? BigInt(userIdValue as string)
        : existingFrameFinalized.createdBy;

    // Parse createdAt
    let createdAt: Date | undefined;

    if (createdAtValue !== null && createdAtValue !== undefined) {
      const parsedCreatedAt = new Date(parseInt(createdAtValue as string));
      if (isNaN(parsedCreatedAt.getTime())) {
        throw error(400, "Invalid createdAt");
      }
      createdAt = parsedCreatedAt;
    } else {
      createdAt = existingFrameFinalized.createdAt;
    }

    const isPublic =
      isPublicValue !== null && isPublicValue !== undefined
        ? parseBoolean(isPublicValue)
        : existingFrameFinalized.isPublic;


    // Update the frame finalized in the database
    const updatedFrameFinalizedValue = await prisma.frames_finalized.update({
      where: {
        id: BigInt(frameFinalizedId),
      },
      data: {
        url: downloadURL,
        name: name,
        designId: frameDesignId,
        createdBy: userId,
        createdAt: createdAt,
        isPublic: isPublic
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(updatedFrameFinalizedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const updatedFrameFinalized = JSON.parse(serializedData);

    return json(
      {
        message: "Frame Finalized updated successfully",
        frameFinalized: updatedFrameFinalized,
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
      `Failed to update Frame Finalized: ${(err as Error).message}`
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const frameFinalizedId = params.id;

  if (!frameFinalizedId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Check if the Frame Finalized exists
    const existingFrameFinalized = await prisma.frames_finalized.findUnique({
      where: {
        id: BigInt(frameFinalizedId),
      },
    });

    if (!existingFrameFinalized) {
      throw new Error("Frame Finalized not found");
    }
    // Delete the user
    await prisma.frames_finalized.delete({
      where: {
        id: BigInt(frameFinalizedId),
      },
    });

    return json(
      {
        message: `Frame Finalized with ID ${frameFinalizedId} deleted successfully`,
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
      `Failed to delete Frame Finalized: ${(err as Error).message}`
    );
  }
};
