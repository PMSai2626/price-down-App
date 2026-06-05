"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function AuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        toast.success(`Welcome ${user.displayName}`);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}