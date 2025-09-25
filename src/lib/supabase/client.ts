"use client";

import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

/**
 * Creates a browser Supabase client using SSR helpers so that auth
 * cookies are synchronized for middleware and server checks.
 *
 * Env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  }

  return createBrowserClient(url, anonKey);
}


