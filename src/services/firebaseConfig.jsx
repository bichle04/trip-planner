// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW-f3HDcF5CY_rVaXPKo3cVt0zngONwQ0",
  authDomain: "ai-trip-planner-8090c.firebaseapp.com",
  projectId: "ai-trip-planner-8090c",
  storageBucket: "ai-trip-planner-8090c.firebasestorage.app",
  messagingSenderId: "552600755588",
  appId: "1:552600755588:web:51779e6d8a1633e50451d1",
  measurementId: "G-ZLJJ9TZ8HZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);