import type { Database } from "@/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type TypedSupabaseClient = SupabaseClient<Database>;
