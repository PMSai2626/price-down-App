"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { LogIn, LogOut, User } from "lucide-react";
import { AuthModel } from "./AuthModel";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const AuthButton = ({ user }) => {
  const [showAuthModel, setShowAuthModel] = useState(false);
  const supabase = createClient();

  const getUserName = (email) => {
    if (!email) return "";
    const namePart = email.split("@")[0];
    const cleaned = namePart.replace(/\d+/g, "");
    return cleaned.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  const handleSignOut = async () => {
  await supabase.auth.signOut();
  setTimeout(() => {
    window.location.reload();
  }, 800);
};

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="w-4 h-4 text-orange-500" />
          <span>{getUserName(user.email)}</span>
        </div>

        <Button
          onClick={handleSignOut}
          size="sm"
          variant="ghost"
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModel(true)}
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
      >
        <LogIn className="w-4 h-4" /> Sign In
      </Button>

      <AuthModel
        isOpen={showAuthModel}
        onClose={() => setShowAuthModel(false)}
      />
    </>
  );
};

export default AuthButton;
