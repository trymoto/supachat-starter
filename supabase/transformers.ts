import { DomainMessage } from "@/domain/message";
import { TablesInsert } from "./database.types";
import { RawMessageWithProfile } from "@/queries/get-messages";

export function messageInsertToDomainMessage(input: {
  new: TablesInsert<"messages">;
}): DomainMessage | null {
  if (!input.new.id) return null;

  return {
    id: input.new.id,
    body: input.new.body || "",
    userId: input.new.user_id || null,
    avatarUrl: null,
    fullName: null,
  };
}

export function messageWithProfileToDomainMessage(
  data: RawMessageWithProfile | null
): DomainMessage | null {
  if (!data || !data.id) return null;

  return {
    id: data.id,
    body: data.body || "",
    userId: data.user_id || null,
    avatarUrl: data.profiles?.avatar_url || null,
    fullName: data.profiles?.full_name || null,
  };
}
