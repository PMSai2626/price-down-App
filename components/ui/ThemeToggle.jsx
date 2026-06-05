"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-800"
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 animate-pulse" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
