import { useSupabaseServer } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = useSupabaseServer();
  await supabase.auth.signOut();

  return NextResponse.redirect(`${origin}/login`);
}
