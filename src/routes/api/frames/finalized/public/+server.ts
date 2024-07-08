import { error, json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";
import { Prisma } from '@prisma/client';

export const GET: RequestHandler = async () => {
  try {
    const framesFinalizedVlue = await prisma.frames_finalized.findMany({
      where: {
        isPublic: true
      },
      include: {
        frame_designs: true,
        userCreator: true,
        userFor: true
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
    throw error(500, `Failed to retrieve frames_finalized records: ${(err as Error).message}`);
  }
};