import { error, json } from "@sveltejs/kit";
import { storage } from "$lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { RequestHandler } from "./$types";
import prisma from "$lib/prisma";
import { bigIntToString } from "$utils/bigIntToString";
import { parseBoolean } from "$utils/parseBoolean";

export const GET: RequestHandler = async () => {
  try {
    const framesDesignsValue = await prisma.frame_designs.findMany({
      include: {
        frames_finalized: true,
        frame_types: true,
        user: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(framesDesignsValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const framesDesigns = JSON.parse(serializedData);

    return json(
      { framesDesigns },
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
      `Failed to retrieve frame_designs records: ${(err as Error).message}`
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get("file") as File;
  const nameValue = data.get("name");
  const typeIdValue = data.get("typeId");
  const userIdValue = data.get("userId");
  const isPublicValue = data.get("isPublic");
  const createdAtValue = data.get("createdAt");

  if (!file) {
    throw error(400, "File not provided");
  }

  if (!typeIdValue) {
    throw error(400, "typeId not provided");
  }

  if (!userIdValue) {
    throw error(400, "userId not provided");
  }

  if (!isPublicValue) {
    throw error(400, "isPublic not provided");
  }

  // Parse createdAt
  let createdAt: Date | undefined;
  let isPublic: boolean | undefined;

  if (createdAtValue !== null && createdAtValue !== undefined) {
    // Attempt to parse createdAtValue as a date
    const parsedCreatedAt = new Date(parseInt(createdAtValue as string));
    if (isNaN(parsedCreatedAt.getTime())) {
      throw error(400, "Invalid createdAt");
    }
    createdAt = parsedCreatedAt;
  } else {
    // Default to current date/time if createdAtValue is not provided
    createdAt = new Date();
  }

  isPublic = parseBoolean(isPublicValue);

  const name = nameValue as string;
  let typeId: bigint;
  let userId: bigint;

  try {
    typeId = BigInt(typeIdValue as string);
    // You can now use designId as a BigInt
    console.log(typeId);
  } catch (e) {
    throw error(500, `typeId must be a valid number: ${(e as Error).message}`);
  }

  try {
    userId = BigInt(userIdValue as string);
    // You can now use designId as a BigInt
    console.log(userId);
  } catch (e) {
    throw error(500, `userId must be a valid number: ${(e as Error).message}`);
  }

  const storageRef = ref(storage, `frame_designs/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const frameDesignValue = await prisma.frame_designs.create({
      data: {
        url: downloadURL,
        name: name,
        typeId: typeId,
        createdBy: userId,
        isPublic: isPublic,
        createdAt: createdAt,
      },
      include: {
        frame_types: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(frameDesignValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameDesign = JSON.parse(serializedData);

    return json(
      {
        frameDesign: frameDesign,
        message: "Frame design uploaded with the url:",
        url: downloadURL,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};
