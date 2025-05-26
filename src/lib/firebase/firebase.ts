// src/lib/firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { getStorage } from "firebase/storage";

let firebaseApp: FirebaseApp | undefined;

export const getApp = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return firebaseApp;
};

// Initialize Firebase services as needed
export const auth = getAuth(getApp());
export const app = firebaseApp;

const storage = getStorage(firebaseApp);
export { storage };
