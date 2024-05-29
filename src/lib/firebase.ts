// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJNf8vVyi25ges_koX7GYGmHhwJD5Hj5Y",
  authDomain: "cartas-a-bris.firebaseapp.com",
  projectId: "cartas-a-bris",
  storageBucket: "cartas-a-bris.appspot.com",
  messagingSenderId: "312270713162",
  appId: "1:312270713162:web:c44655ff71a7e15b5411b3",
  measurementId: "G-PT18HXXCFW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
