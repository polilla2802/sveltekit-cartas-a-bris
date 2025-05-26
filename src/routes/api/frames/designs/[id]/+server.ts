import { error, json, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { storage } from "$lib/firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { bigIntToString } from "$utils/bigIntToString";
import { parseBoolean } from "$utils/parseBoolean";

export const GET: RequestHandler = async ({ params }) => {
  const frameDesignId = params.id;

  if (!frameDesignId) {
    throw error(400, "Frame Design ID not provided");
  }

  try {
    // Fetch the Frame Design by ID
    const frameDesignValue = await prisma.frame_designs.findUnique({
      where: {
        id: BigInt(frameDesignId),
      },
      include: {
        frame_types: true,
        user: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(frameDesignValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameDesign = JSON.parse(serializedData);

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
  const isPublicValue = data.get("isPublic");
  const createdAtValue = data.get("createdAt");

  try {
    // Fetch the existing frame design by ID
    const existingFrameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: BigInt(frameDesignId),
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

    const frameTypeId =
      frameTypeIdValue !== null && frameTypeIdValue !== undefined
        ? BigInt(frameTypeIdValue as string)
        : existingFrameDesign.typeId;

    // Ensure userId is a number or fallback to existing value
    const userId =
      userIdValue !== null && userIdValue !== undefined
        ? BigInt(userIdValue as string)
        : existingFrameDesign.createdBy;

    // Parse createdAt
    let createdAt: Date | undefined;

    if (createdAtValue !== null && createdAtValue !== undefined) {
      const parsedCreatedAt = new Date(parseInt(createdAtValue as string));
      if (isNaN(parsedCreatedAt.getTime())) {
        throw error(400, "Invalid createdAt");
      }
      createdAt = parsedCreatedAt;
    } else {
      createdAt = existingFrameDesign.createdAt;
    }

    const isPublic =
      isPublicValue !== null && isPublicValue !== undefined
        ? parseBoolean(isPublicValue)
        : existingFrameDesign.isPublic;

    // Update the frame design in the database
    const updatedFrameDesignValue = await prisma.frame_designs.update({
      where: {
        id: BigInt(frameDesignId),
      },
      data: {
        url: downloadURL,
        name: name,
        typeId: frameTypeId,
        createdBy: userId,
        createdAt: createdAt,
        isPublic: isPublic,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(
      updatedFrameDesignValue,
      bigIntToString
    );

    // Parse the serialized data back to an object (optional step)
    const updatedFrameDesign = JSON.parse(serializedData);

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
        id: BigInt(frameDesignId),
      },
    });

    if (!existingFrameDesign) {
      throw new Error("Frame Design not found");
    }
    // Delete the user
    await prisma.frame_designs.delete({
      where: {
        id: BigInt(frameDesignId),
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
