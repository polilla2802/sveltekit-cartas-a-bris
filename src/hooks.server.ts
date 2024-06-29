// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { getAuth } from "firebase/auth";
import { app } from "$lib/firebase"; // Ensure you import the FirebaseApp instance

export const handle: Handle = async ({ event, resolve }) => {
  const firebaseAuth = getAuth(app);
  event.locals.user = firebaseAuth.currentUser; // TypeScript now recognizes user

  const response = await resolve(event);
  return response;
};
