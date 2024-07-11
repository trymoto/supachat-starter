import { TypedSupabaseClient } from "@/utils/types";

export function getProfileById(client: TypedSupabaseClient, userId: string) {
  return client
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url
    `
    )
    .eq("id", userId)
    .throwOnError()
    .single();
}
