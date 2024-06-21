import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";
import { Prisma } from '@prisma/client';

export const GET: RequestHandler = async () => {
  try {
    const framesFinalizedVlue = await prisma.frame_finalized.findMany({
      include: {
        frame_designs: true,
        user: true
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
    throw error(500, `Failed to retrieve frame_finalized records: ${(err as Error).message}`);
  }
};


export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file') as File;
  const nameValue = data.get('name');
  const designIdValue = data.get('designId');
  const userIdValue = data.get('userId');
  const createdAtValue = data.get("createdAt");

  if (!file) {
    throw error(400, 'File not provided');
  }

  if (!designIdValue) {
    throw error(400, 'designId not provided');
  }

  if (!userIdValue) {
    throw error(400, 'userId not provided');
  }

  const name = (nameValue as string);

  let designId: bigint;
  let userId: bigint;

  try {
    designId = BigInt(designIdValue as string);
    // You can now use designId as a BigInt
    console.log(designId);
  } catch (e) {
    throw error(500, `designId must be a valid number: ${(e as Error).message}`);
  }

  try {
    userId = BigInt(userIdValue as string);
    // You can now use designId as a BigInt
    console.log(userId);
  } catch (e) {
    throw error(500, `userId must be a valid number: ${(e as Error).message}`);
  }
  // Parse createdAt
  let createdAt: Date | undefined;

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

  const storageRef = ref(storage, `frame_finalized/${file.name}`);


  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const newFrameFinalizedValue = await prisma.frame_finalized.create({
      data: {
        url: downloadURL,
        name: name,
        designId: designId,
        userId: userId,
        createdAt: createdAt
      },
      include: {
        frame_designs: true,
      },
    });

    console.log(newFrameFinalizedValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(newFrameFinalizedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const newFrameFinalized = JSON.parse(serializedData);

    return json({ frameFinalized: newFrameFinalized, message: 'Frame finalized uploaded with the url:', url: downloadURL }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2003') {
        throw error(400, 'Invalid foreign key value: Either designId or userId does not exist');
      }
    }

    console.log(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};

