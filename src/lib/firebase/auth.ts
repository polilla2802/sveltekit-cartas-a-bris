// src/lib/auth.ts
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import type { User, UserCredential } from "firebase/auth"; // Use type-only import for User
import { auth } from "./firebase";

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
): Promise<UserCredential> {

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
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
): Promise<UserCredential> {
  try {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const userCredential = result;
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
    console.log("Error signing out:", error);
    throw new Error("Error signing out:" + error);
  }
}

// Function to delete the current authenticated user
export async function deleteCurrentUser(): Promise<void> {
  try {
    await deleteUser(auth.currentUser!);

  } catch (error) {
    console.log("Error deleting user:", error);
    throw new Error("Error deleting user:" + error);
    // Handle error gracefully, e.g., show an error message to the user
  }
};

// Get Current User Function
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
