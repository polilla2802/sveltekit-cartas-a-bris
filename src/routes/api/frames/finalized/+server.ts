import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
  try {
    const framesFinalized = await prisma.frame_finalized.findMany({
      include: {
        frame_designs: true,
        User: true
      },
    });

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

  const designId = parseInt(designIdValue as string);
  if (isNaN(designId)) {
    throw error(400, 'designId must be a valid number');
  }

  const userId = parseInt(userIdValue as string);
  if (isNaN(userId)) {
    throw error(400, 'userId must be a valid number');
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

    const newFrameFinalized = await prisma.frame_finalized.create({
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

    return json({ frameFinalized: newFrameFinalized, message: 'Frame finalized uploaded with the url:', url: downloadURL }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};

