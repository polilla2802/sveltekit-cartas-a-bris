import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { storage } from "$lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const GET: RequestHandler = async ({ params }) => {
  const frameFinalizedId = params.id;

  if (!frameFinalizedId) {
    throw error(400, "Frame Finalized ID not provided");
  }

  try {
    // Fetch the Frame Finalized by ID
    const frameFinalized = await prisma.frame_finalized.findUnique({
      where: {
        id: parseInt(frameFinalizedId),
      },
      include: {
        frame_designs: true,
        User: true,
      },
    });

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

  const data = await request.formData();
  const fileValue = data.get("file") as File | null; // File can be optional
  const nameValue = data.get("name");
  const frameDesignIdValue = data.get("designId");
  const userIdValue = data.get("userId");
  const createdAtValue = data.get("createdAt");

  try {
    // Fetch the existing frame finalized by ID
    const existingFrameFinalized = await prisma.frame_finalized.findUnique({
      where: {
        id: parseInt(frameFinalizedId),
      },
    });

    if (!existingFrameFinalized) {
      throw error(404, "Frame Finalized not found");
    }

    let downloadURL = existingFrameFinalized.url;

    // Handle file upload if a new file is provided
    if (fileValue) {
      const storageRef = ref(storage, `frame_finalized/${fileValue.name}`);
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
        ? parseInt(frameDesignIdValue as string)
        : existingFrameFinalized.designId;

    if (isNaN(frameDesignId)) {
      throw error(400, "Invalid designId");
    }

    // Ensure userId is a number or fallback to existing value
    const userId =
      userIdValue !== null && userIdValue !== undefined
        ? parseInt(userIdValue as string)
        : existingFrameFinalized.userId;

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

    // Update the frame finalized in the database
    const updatedFrameFinalized = await prisma.frame_finalized.update({
      where: {
        id: parseInt(frameFinalizedId),
      },
      data: {
        url: downloadURL,
        name: name,
        designId: frameDesignId,
        userId: userId,
        createdAt: createdAt
      },
    });

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
    const existingFrameFinalized = await prisma.frame_finalized.findUnique({
      where: {
        id: parseInt(frameFinalizedId),
      },
    });

    if (!existingFrameFinalized) {
      throw new Error("Frame Finalized not found");
    }
    // Delete the user
    await prisma.frame_finalized.delete({
      where: {
        id: parseInt(frameFinalizedId),
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
