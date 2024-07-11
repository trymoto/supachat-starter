import { TypedSupabaseClient } from "@/supabase/typed-database-client";

export function getOnlineCount(client: TypedSupabaseClient) {
  return client.from("online").select("count").single();
}
