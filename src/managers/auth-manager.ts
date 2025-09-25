import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export class AuthManager {
  async getSession() {
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session ?? null;
  }

  async requireAuth(redirectTo: string = "/auth/login") {
    const session = await this.getSession();
    if (!session) redirect(redirectTo);
    return session;
  }

  async signOut(redirectTo: string = "/auth/login") {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect(redirectTo);
  }
}



