// src/lib/auth.ts
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword } from "firebase/auth";
import type { User } from "firebase/auth"; // Use type-only import for User
import { auth } from "$lib/firebase";

// Set persistence to local (this can be 'session' or 'none' based on your needs)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local storage');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

const googleProvider = new GoogleAuthProvider();

// Sign In Function
export async function signInUserWithMail(
  email: string,
  password: string
): Promise<User | null> {

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.log("Error signing in:", error);
    throw new Error("Error signing in:" + error);
  }
}

// Sign In Function
export async function logInUserWithMail(
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
    throw new Error("Error signing in with Google:" + error);
  }
}

// Sign In Function
export async function signInWithGoogle(
): Promise<User | undefined> {
  try {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userCredential = result.user;
      console.log('User:', userCredential);

      return userCredential;
    } catch (error) {
      console.log('Error signing in with Google:');
      throw new Error("Error signing in with Google:" + error);
    }
  } catch (error) {
    console.log("Error signing in:", error);
    throw new Error("Error signing in with Google:" + error);
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
