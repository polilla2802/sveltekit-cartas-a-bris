import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { bigIntToString } from "$utils/bigIntToString";

export const GET: RequestHandler = async () => {
  try {
    const usersValue = await prisma.user.findMany({
      include: {
        frames_finalized: true,
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(usersValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const users = JSON.parse(serializedData);

    return json({ users }, {
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
  const firebaseUidValue = data.get('firebaseUid');
  const userNameValue = data.get('userName');
  const nameValue = data.get('name');
  const phoneNumberValue = data.get('phoneNumber');
  const emailValue = data.get('email');
  const genderValue = data.get('gender');
  const ageValue = data.get('age');

  if (!firebaseUidValue) {
    throw error(400, 'firebaseUid not provided');
  }

  if (!userNameValue) {
    throw error(400, 'userName not provided');
  }

  if (!nameValue) {
    throw error(400, 'name not provided');
  }

  if (!emailValue) {
    throw error(400, 'email not provided');
  }

  const age = parseInt(ageValue as string);

  const firebaseUid = (firebaseUidValue as string)
  const userName = (userNameValue as string)
  const name = (nameValue as string)
  const phoneNumber = (phoneNumberValue as string)
  const email = (emailValue as string)
  const gender = (genderValue as string)
  try {

    // Check if email or username already exist
    const existingUserName = await prisma.user.findFirst({
      where: {
        userName: userName
      },
    });

    if (existingUserName) {
      throw new Error('user with the same userName already exists');
    }

    // Check if email or username already exist
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email
      },
    });

    if (existingEmail) {
      throw new Error('user with the same email already exists');
    }

    const userValvue = await prisma.user.create({
      data: {
        firebaseUid: firebaseUid,
        userName: userName,
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        gender: gender,
        age: age
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(userValvue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const user = JSON.parse(serializedData);

    return json({ message: 'user uploaded:', user }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};