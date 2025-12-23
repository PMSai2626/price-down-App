"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginToast() {
  useEffect(() => {
    const cookies = document.cookie;

    if (cookies.includes("login_success=true")) {
      setTimeout(() => {
        toast.success("Logged in successfully 🎉");
      }, 200);

      // ❌ remove cookie so it shows only once
      document.cookie =
        "login_success=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, []);

  return null;
}
