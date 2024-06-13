import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
  try {
    const framesDesigns = await prisma.frame_designs.findMany({
      include: {
        frame_finalized: true,
        frame_types: true,
      },
    });

    return json({ framesDesigns }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to retrieve frame_designs records: ${(err as Error).message}`);
  }
};


export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file') as File;
  const nameValue = data.get('name');
  const typeIdValue = data.get('typeId');
  const userIdValue = data.get('userId');

  if (!file) {
    throw error(400, 'File not provided');
  }

  if (!typeIdValue) {
    throw error(400, 'typeId not provided');
  }

  if (!userIdValue) {
    throw error(400, 'userId not provided');
  }

  const name = (nameValue as string);

  const typeId = parseInt(typeIdValue as string);
  if (isNaN(typeId)) {
    throw error(400, 'typeId must be a valid number');
  }

  const userId = parseInt(userIdValue as string);
  if (isNaN(userId)) {
    throw error(400, 'userId must be a valid number');
  }

  const storageRef = ref(storage, `frame_designs/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const frameDesign = await prisma.frame_designs.create({
      data: {
        url: downloadURL,
        name: name,
        typeId: typeId,
        userId: userId
      },
      include: {
        frame_types:true
      }
    });

    return json({frameDesign: frameDesign, message: 'Frame design uploaded with the url:', url: downloadURL }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};

