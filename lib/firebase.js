import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyByDzEGQ1lGiDMqxJ1Q3OIWfmde07AkINc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "szechenyi-11d.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "szechenyi-11d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "szechenyi-11d.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "506566271248",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:506566271248:web:5c410dec40c2c162ad8595",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S53RK5VRES"
};

// Initialize Firebase safely
let app;
let auth;
let db;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization notice:", error.message);
}

export { app, auth, db };
