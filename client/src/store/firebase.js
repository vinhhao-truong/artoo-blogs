import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
  authDomain: "artoo-blogs.firebaseapp.com",
  projectId: "artoo-blogs",
  storageBucket: "artoo-blogs.appspot.com",
  messagingSenderId: "182527357572",
  appId: "1:182527357572:web:f300da49f4643aa1b188d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(app);
