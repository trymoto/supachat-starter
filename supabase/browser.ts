import type { Database } from "@/supabase/database.types";
import type { TypedSupabaseClient } from "@/supabase/typed-database-client";
import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

let client: TypedSupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

export function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}
