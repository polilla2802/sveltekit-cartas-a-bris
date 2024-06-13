import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const GET: RequestHandler = async ({ params }) => {
  const frameId = params.id;

  if (!frameId) {
    throw error(400, 'Frame Design ID not provided');
  }

  try {
    // Fetch the Frame Design by ID
    const frameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(frameId),
      },
      include: {
        frame_types: true
      }
    });

    if (!frameDesign) {
      throw new Error('Frame Design not found');
    }

    return json({ frameDesign }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Failed to fetch Frame Design: ${(err as Error).message}`);
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const frameDesignId = params.id;

  if (!frameDesignId) {
    throw error(400, 'Frame Design ID not provided');
  }

  const data = await request.formData();
  const fileValue = data.get('file') as File;
  const nameValue = data.get('name');
  const frameTypeIdValue = data.get('typeId');
  const userIdValue = data.get('userId');
  try {
    // Fetch the user by ID
    const existingFrameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    if (!existingFrameDesign) {
      throw new Error('Frame Design not found');
    }

    const storageRef = ref(storage, `frame_designs/${fileValue.name}`);
    const snapshot = await uploadBytes(storageRef, fileValue);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const name = (nameValue as string)
    let frameTypeId;
    let userId;

    if (!frameTypeIdValue) {
      frameTypeId = existingFrameDesign.typeId;
    } else {
      frameTypeId = parseInt(frameTypeIdValue as string);
    }

    if (!userId) {
      userId = existingFrameDesign.userId;
    } else {
      userId = parseInt(userIdValue as string);
    }

    // Update user fields
    const updatedFrameDesign = await prisma.frame_designs.update({
      where: {
        id: parseInt(frameDesignId),
      },
      data: {
        url: downloadURL ?? existingFrameDesign.url,
        name: name ?? existingFrameDesign.name,
        typeId: frameTypeId,
        userId: userId
      },
    });

    return json({ message: 'Frame Design updated:', frameDesign: updatedFrameDesign }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Failed to update Frame Design: ${(err as Error).message}`);
  }
};


export const DELETE: RequestHandler = async ({ params }) => {
  const frameDesignId = params.id;

  if (!frameDesignId) {
    throw error(400, 'Frame Design ID not provided');
  }

  try {
    // Check if the Frame Design exists
    const existingFrameDesign = await prisma.frame_designs.findUnique({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    if (!existingFrameDesign) {
      throw new Error('Frame Design not found');
    }
    // Delete the user
    await prisma.frame_designs.delete({
      where: {
        id: parseInt(frameDesignId),
      },
    });

    return json({ message: `Frame Design with ID ${frameDesignId} deleted successfully` }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Failed to delete Frame Design: ${(err as Error).message}`);
  }
};