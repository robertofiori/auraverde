import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLV_7VhVreewagteqfNtx4-I9AkSYMRwk",
  authDomain: "auraverde-db.firebaseapp.com",
  projectId: "auraverde-db",
  storageBucket: "auraverde-db.firebasestorage.app",
  messagingSenderId: "1045483358918",
  appId: "1:1045483358918:web:1a82ec3c166abc5641a5c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
