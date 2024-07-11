"use client";

import useSupabaseBrowser from "@/utils/supabase/browser";
import { getProfileById } from "@/queries/get-profile-by-id";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { memo, useEffect, useMemo } from "react";
import { decodeTime } from "ulid";
import AvatarWithFallback from "./AvatarWithFallback";

type MessageProps = {
  id: string;
  body: string;
  userId?: string;
  fullName?: string;
  avatarUrl?: string;
  self?: boolean;
};

export default memo<MessageProps>(function Message({
  id,
  userId,
  fullName,
  body,
  avatarUrl,
  self,
}) {
  const supabase = useSupabaseBrowser();
  const { data: profile, refetch } = useQuery(
    getProfileById(supabase, userId || ""),
    { enabled: false }
  );

  const fullNameHydrated = fullName || profile?.full_name;
  const avatarUrlHydrated = avatarUrl || profile?.avatar_url;

  const avatar = useMemo(() => {
    if (self) return null;
    return (
      <AvatarWithFallback
        className="w-8 h-8 border-2 border-primary-foreground"
        fullName={fullNameHydrated || ""}
        avatarUrl={avatarUrlHydrated || ""}
      />
    );
  }, [fullNameHydrated, avatarUrlHydrated, self]);

  const time = useMemo(() => {
    const timestamp = decodeTime(id);
    const date = new Date(timestamp);

    return isToday(date)
      ? format(date, "h:mm a")
      : format(date, "MMMM do, yyyy"); // Full format for other dates
  }, [id]);

  useEffect(() => {
    if (self) return;
    if (userId && !fullNameHydrated) {
      refetch();
    }
  }, [userId, fullNameHydrated]);

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        self ? "justify-end pl-10" : "pr-10"
      )}
    >
      {avatar}
      <div className="grid gap-1 text-sm">
        <div className={cn("flex items-center gap-2", self && "justify-end")}>
          <div className="font-medium">{self ? "You" : fullNameHydrated}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
        <div
          className={cn(
            "bg-muted rounded-lg p-3 overflow-hidden break-words",
            self && "bg-primary text-primary-foreground"
          )}
        >
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
});
