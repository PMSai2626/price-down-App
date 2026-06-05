import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App only if we have configuration or are in the browser
const hasConfig = typeof window !== "undefined" || firebaseConfig.projectId;
const app = hasConfig ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) : null;

// Initialize db and auth conditionally to prevent compile-time crashes when env vars are missing
export const db = app ? getFirestore(app) : null;
export const auth = app && (typeof window !== "undefined" || firebaseConfig.apiKey) ? getAuth(app) : null;

export default app;