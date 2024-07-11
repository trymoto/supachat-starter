import { TypedSupabaseClient } from "@/supabase/typed-database-client";
import { User } from "@supabase/supabase-js";

export async function getUser(
  client: TypedSupabaseClient
): Promise<User | null> {
  const { data } = await client.auth.getUser();
  return data?.user ?? null;
}
