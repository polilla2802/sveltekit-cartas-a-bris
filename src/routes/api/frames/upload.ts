// src/routes/api/frames/upload.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { storage } from '$lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const options: RequestHandler = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins, adjust as needed
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

export const post: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file') as File;

  if (!file) {
    return json({ error: 'File not provided' }, {
      status: 400, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const storageRef = ref(storage, `frame_designs/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return new Response(JSON.stringify({ url: downloadURL }), {
      status: 200, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    const message = (err as Error).message;
    return json({ error: 'Upload failed', details: message }, {
      status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
