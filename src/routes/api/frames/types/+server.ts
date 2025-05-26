import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async () => {
  try {
    const framesTypesValue = await prisma.frame_types.findMany({
      include: {
        frame_designs: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(framesTypesValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const frameData = JSON.parse(serializedData);

    return json({ frameData }, {
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

    const typeCreatedValue = await prisma.frame_types.create({
      data: {
        type: type,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(typeCreatedValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const typeCreated = JSON.parse(serializedData);

    return json({ message: 'Frame type uploaded with the id:', id: typeCreated.id}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};
