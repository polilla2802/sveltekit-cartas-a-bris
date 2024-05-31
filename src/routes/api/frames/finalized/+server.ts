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
  const frameIdValue = data.get('frameId');

  if (!file) {
    throw error(400, 'File not provided');
  }

  if (!frameIdValue) {
    throw error(400, 'frameId not provided');
  }

  const frameId = parseInt(frameIdValue as string);
  if (isNaN(frameId)) {
    throw error(400, 'frameId must be a valid number');
  }

  const storageRef = ref(storage, `frame_finalized/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const newFrameFinalized = await prisma.frame_finalized.create({
      data: {
        url: downloadURL,
        frameId: frameId
      },
      include: {
        frame_designs: true,
      },
    });

    return json({ message: 'Frame finalized uploaded with the url:', url: downloadURL, frameDesign: newFrameFinalized.frame_designs, }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};

