import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ IMPORTANT: DO NOT refresh session on logout
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/")) {
    return response;
  }

  // 🔐 Only sync session if access token exists
  const hasAuthCookie = request.cookies
    .getAll()
    .some(c => c.name.startsWith("sb-"));

  if (hasAuthCookie) {
    await supabase.auth.getUser();
  }

  // Prevent back/forward cache to avoid Chrome extension port disconnection
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
