import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
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
  return response;
}
