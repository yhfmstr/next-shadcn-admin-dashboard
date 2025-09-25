import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Home() {
  const cookieStore = cookies();
  const hasSupabaseAuth = Boolean(cookieStore.get("sb-access-token") || cookieStore.get("sb-refresh-token"));
  redirect(hasSupabaseAuth ? "/dashboard" : "/auth/login");
}
