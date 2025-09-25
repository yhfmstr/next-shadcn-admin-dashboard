import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, session });
}

export async function DELETE() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}



