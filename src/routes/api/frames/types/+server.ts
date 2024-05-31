import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
  try {
    const framesTypes = await prisma.frame_types.findMany({
      include: {
        frame_designs:true
      },
    });

    return json({ framesTypes }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to retrieve frame_types records: ${(err as Error).message}`);
  }
};


export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const typeValue = data.get('type');

  if (!typeValue) {
    throw error(400, 'Type not provided');
  }

  const type = typeValue as string;

  try {

    const typeCreated = await prisma.frame_types.create({
      data: {
        type: type,
      },
    });

    return json({ message: 'Frame type uploaded with the id:', id: typeCreated.id }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};
