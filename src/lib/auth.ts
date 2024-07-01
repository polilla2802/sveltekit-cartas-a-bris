// src/lib/auth.ts
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth"; // Use type-only import for User
import { auth } from "$lib/firebase";

// Sign In Function
export async function signIn(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.log("Error signing in:", error);
    return null;
  }
}

// Sign Out Function
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Get Current User Function
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
