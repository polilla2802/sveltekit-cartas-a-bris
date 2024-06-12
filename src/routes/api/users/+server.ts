import { error, json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        frame_finalized: true,
      },
    });

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
  const userNameValue = data.get('userName');
  const nameValue = data.get('name');
  const phoneNumberValue = data.get('phoneNumber');
  const emailValue = data.get('email');
  const passwordValue = data.get('password');
  const genderValue = data.get('gender');
  const ageValue = data.get('age');

  if (!userNameValue) {
    throw error(400, 'userName not provided');
  }

  if (!nameValue) {
    throw error(400, 'name not provided');
  }

  if (!emailValue) {
    throw error(400, 'email not provided');
  }

  if (!passwordValue) {
    throw error(400, 'password not provided');
  }

  if (!ageValue) {
    throw error(400, 'age not provided');
  }

  const age = parseInt(ageValue as string);
  if (isNaN(age)) {
    throw error(400, 'age must be a valid number');
  }

  const userName = (userNameValue as string)
  const name = (nameValue as string)
  const phoneNumber = (phoneNumberValue as string)
  const email = (emailValue as string)
  const password = (passwordValue as string)
  const gender = (genderValue as string)
  try {

    // Check if email or username already exist
    const existingUserName = await prisma.user.findFirst({
      where: {
        userName: userName
      },
    });

    if (existingUserName) {
      throw new Error('User with the same userName already exists');
    }

    // Check if email or username already exist
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email
      },
    });

    if (existingEmail) {
      throw new Error('User with the same email already exists');
    }

    const user = await prisma.user.create({
      data: {
        userName: userName,
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        gender: gender,
        age: age
      },
    });

    return json({ message: 'User uploaded:', user }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error(err);
    throw error(500, `Upload failed: ${(err as Error).message}`);
  }
};