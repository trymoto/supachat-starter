import { TypedSupabaseClient } from "@/utils/types";

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
