import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // ✅ ADD FLAG FOR LOGIN SUCCESS
  const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("login_success", "true", {
    path: "/",
    maxAge: 10,       // seconds
    httpOnly: false, // 👈 THIS FIXES LOGIN TOAST
  });
  
  // Prevent back/forward cache to avoid Chrome extension port disconnection
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  
  return response;
}
