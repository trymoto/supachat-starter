import { useSupabaseServer } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = useSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/`);
}
