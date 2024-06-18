import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { storage } from "$lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const GET: RequestHandler = async ({ params }) => {
  const designId = params.id;

  if (!designId) {
    throw error(400, "Frame Design ID not provided");
  }

  try {
    // Fetch the Frame Design by ID
    const frameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(designId),
      },
      include: {
        frame_types: true,
        User: true,
      },
    });

    if (!frameDesign) {
      throw new Error("Frame Design not found");
    }

    return json(
      { frameDesign },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to fetch Frame Design: ${(err as Error).message}`);
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const frameDesignId = params.id;

  if (!frameDesignId) {
    throw error(400, "Frame Design ID not provided");
  }

  const data = await request.formData();
  const fileValue = data.get("file") as File | null;
  const nameValue = data.get("name");
  const frameTypeIdValue = data.get("typeId");
  const userIdValue = data.get("userId");

  try {
    // Fetch the existing frame design by ID
    const existingFrameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    if (!existingFrameDesign) {
      throw error(404, "Frame Design not found");
    }

    let downloadURL = existingFrameDesign.url;

    // Handle file upload if a new file is provided
    if (fileValue) {
      const storageRef = ref(storage, `frame_designs/${fileValue.name}`);
      const snapshot = await uploadBytes(storageRef, fileValue);
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    // Handle name, frameTypeId, and userId, using existing values if not provided
    const name = nameValue ? (nameValue as string) : existingFrameDesign.name;

    // Ensure frameTypeId is a number
    const frameTypeId = frameTypeIdValue
      ? parseInt(frameTypeIdValue as string)
      : existingFrameDesign.typeId;

    // Ensure userId is a number
    const userId = userIdValue
      ? parseInt(userIdValue as string)
      : existingFrameDesign.userId;

    // Update the frame design in the database
    const updatedFrameDesign = await prisma.frame_designs.update({
      where: {
        id: parseInt(frameDesignId),
      },
      data: {
        url: downloadURL,
        name: name,
        typeId: frameTypeId,
        userId: userId,
      },
    });

    return json(
      {
        message: "Frame Design updated successfully",
        frameDesign: updatedFrameDesign,
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
      `Failed to update Frame Design: ${(err as Error).message}`
    );
  }
};
export const DELETE: RequestHandler = async ({ params }) => {
  const frameDesignId = params.id;

  if (!frameDesignId) {
    throw error(400, "Frame Design ID not provided");
  }

  try {
    // Check if the Frame Design exists
    const existingFrameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    if (!existingFrameDesign) {
      throw new Error("Frame Design not found");
    }
    // Delete the user
    await prisma.frame_designs.delete({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    return json(
      { message: `Frame Design with ID ${frameDesignId} deleted successfully` },
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
      `Failed to delete Frame Design: ${(err as Error).message}`
    );
  }
};
