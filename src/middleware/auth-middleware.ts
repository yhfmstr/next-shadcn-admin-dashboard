import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  const isAuthRoute = pathname.startsWith("/auth");
  const isRoot = pathname === "/";

  // We cannot await SSR client here synchronously; rely on presence of Supabase auth cookie.
  const hasSupabaseAuth = Boolean(req.cookies.get("sb-access-token") || req.cookies.get("sb-refresh-token"));

  if (!hasSupabaseAuth && (pathname.startsWith("/dashboard") || isRoot)) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSupabaseAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
