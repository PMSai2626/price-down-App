"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function AuthModel({ isOpen, onClose }) {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    toast.loading("Signing you in…");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://price-down-app.vercel.app/auth/callback",
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Continue with Google to track price drops
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.3 2.9 29.4 1 24 1 14.6 1 6.6 6.4 2.8 14.1l7 5.4C11.6 13.6 17.4 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.7-.2-3.3-.5-4.9H24v9.3h12.7c-.5 2.7-2 5-4.2 6.5l6.5 5C43.8 36.3 46.5 30.9 46.5 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M9.8 28.6c-.5-1.5-.8-3.1-.8-4.6s.3-3.1.8-4.6l-7-5.4C1 17.2 0 20.5 0 24s1 6.8 2.8 9.9l7-5.3z"
              />
              <path
                fill="#34A853"
                d="M24 47c5.4 0 10-1.8 13.4-4.9l-6.5-5c-1.8 1.2-4.1 2-6.9 2-6.6 0-12.4-4.1-14.2-9.9l-7 5.3C6.6 41.6 14.6 47 24 47z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
