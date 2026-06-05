"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { LogIn, LogOut, User } from "lucide-react";
import { AuthModel } from "./AuthModel";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthButton = ({ user }) => {
  const [showAuthModel, setShowAuthModel] = useState(false);

  const getUserName = (email) => {
    if (!email) return "";

    const namePart = email.split("@")[0];
    const cleaned = namePart.replace(/\d+/g, "");

    return cleaned.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      toast.success("Logged out successfully 👋");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
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
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <AuthModel
        isOpen={showAuthModel}
        onClose={() => setShowAuthModel(false)}
      />
    </>
  );
};

export default AuthButton;