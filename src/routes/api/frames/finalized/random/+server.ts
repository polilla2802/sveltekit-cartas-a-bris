import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";
import { randomFrameCache } from '$lib/cache/dailyCache';

export const GET: RequestHandler = async () => {
  try {
    // Check if we already have a cached random frame for today
    let randomFrame = randomFrameCache.getCachedItem();

    if (!randomFrame) {
      // Fetch all public frames if no cached frame or the cache is outdated
      const framesFinalizedVlue = await prisma.frames_finalized.findMany({
        where: {
          isPublic: false
        },
        include: {
          frame_designs: true,
          userCreator: true,
          userFor: true
        },
      });

      if (framesFinalizedVlue.length === 0) {
        throw error(404, 'No public frames available.');
      }

      // Select a random frame
      const randomIndex = Math.floor(Math.random() * framesFinalizedVlue.length);
      randomFrame = framesFinalizedVlue[randomIndex];

      // Cache the selected random frame
      randomFrameCache.setCachedItem(randomFrame);
    }

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(randomFrame, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const randomFrameOfTheDay = JSON.parse(serializedData);

    //Code to return a single random frame from the array of frames

    return json({ randomFrameOfTheDay }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    throw error(500, `Failed to retrieve frames_finalized records: ${(err as Error).message}`);
  }
};