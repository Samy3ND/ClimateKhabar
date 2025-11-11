// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "climatekhabar.firebaseapp.com",
  projectId: "climatekhabar",
  storageBucket: "climatekhabar.firebasestorage.app",
  messagingSenderId: "1098791429995",
  appId: "1:1098791429995:web:e9b66286b26a12a945ce2e",
  measurementId: "G-YQLV24EHQQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
