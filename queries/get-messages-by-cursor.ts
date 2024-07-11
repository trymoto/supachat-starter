import { TypedSupabaseClient } from "@/utils/types";

export function getMessagesByCursor(
  client: TypedSupabaseClient,
  cursor: string // cursor is exclusive
) {
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
    .lt("id", cursor)
    .limit(10);
}
