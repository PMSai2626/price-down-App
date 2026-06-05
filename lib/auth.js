import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const googleLogin = async () => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please configure your environment variables in Vercel settings.");
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
};