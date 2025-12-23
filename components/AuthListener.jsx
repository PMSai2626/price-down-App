"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function AuthListener() {
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
            setTimeout(() => {
                window.location.reload();
                toast.success("Logged out successfully 👋");
            

            }, 200)
          
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
