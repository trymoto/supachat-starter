import { Database } from "@/supabase/database.types";
import { TypedSupabaseClient } from "@/supabase/typed-database-client";

export function getMessages(client: TypedSupabaseClient) {
  return client
    .from("messages")
    .select(
      `
      id,
      body,
      user_id,
      profiles ( id, full_name, avatar_url )
      `
    )
    .order("id", { ascending: false })
    .limit(10);
}

export type RawMessageWithProfile =
  Database["public"]["Tables"]["messages"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  };
