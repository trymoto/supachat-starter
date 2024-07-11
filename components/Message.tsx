"use client";

import { getProfileById } from "@/queries/get-profile-by-id";
import { useSupabaseBrowser } from "@/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { AvatarWithFallback } from "@/components/AvatarWithFallback";
import { cn } from "@/lib/utils";
import { format, isToday, lightFormat } from "date-fns";
import { memo, useEffect, useMemo } from "react";
import { decodeTime } from "ulid";
import { DomainMessage } from "@/domain/message";
import { UTCDate } from "@date-fns/utc";

type MessageProps = DomainMessage & {
  self?: boolean;
};

export const Message = memo<MessageProps>(function Message({
  id,
  userId,
  fullName,
  body,
  avatarUrl,
  self,
}) {
  // QUERIES

  const supabase = useSupabaseBrowser();

  // profile may be missing if message comes from realtime event
  // so we hydrate it using react-query cache if possible
  const { data: profile, refetch: fetchProfile } = useQuery(
    getProfileById(supabase, userId || ""),
    { enabled: false }
  );

  // DERIVED

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
    const date = new UTCDate(timestamp);

    return isToday(date)
      ? lightFormat(date, "h:mm a")
      : lightFormat(date, "MMM d, h:mm a");
  }, [id]);

  // EFFECTS

  useEffect(
    function hydrateProfileIfUserExists() {
      if (self) return;
      if (userId && !fullNameHydrated) fetchProfile();
    },
    [userId, fullNameHydrated]
  );

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
