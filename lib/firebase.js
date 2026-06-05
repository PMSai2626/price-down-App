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

// Initialize Firebase App only if the required keys are present
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
const app = hasConfig ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) : null;

// Initialize db and auth conditionally if app was successfully initialized
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export default app;