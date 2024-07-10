import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = createClient();
  await supabase.auth.signOut();
  console.log({ origin });

  return NextResponse.redirect(`${origin}/login`);
}
