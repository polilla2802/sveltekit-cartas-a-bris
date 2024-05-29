import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file') as File;
  const typeIdValue = data.get('typeId');

  if (!file) {
    throw error(400, 'File not provided');
  }

  if (!typeIdValue) {
    throw error(400, 'TypeId not provided');
  }

  const typeId = parseInt(typeIdValue as string);
  if (isNaN(typeId)) {
    throw error(400, 'TypeId must be a valid number');
  }

  const storageRef = ref(storage, `frame_designs/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await prisma.frame_designs.create({
      data: {
        url: downloadURL,
        typeId: typeId
      },
    });

    return json({ message: 'Frame design uploaded with the url:', url: downloadURL }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};
