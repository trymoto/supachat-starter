"use client";

import { getOnlineCount } from "@/queries/get-online-count";
import { useSupabaseBrowser } from "@/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { memo, useEffect } from "react";

export const OnlineIndicator = memo(function OnlineIndicator() {
  const supabase = useSupabaseBrowser();
  const { data, refetch } = useQuery(getOnlineCount(supabase));

  useEffect(
    function pollOnlineCount() {
      const interval = setInterval(refetch, 5000);
      return () => clearInterval(interval);
    },
    [refetch]
  );

  return (
    <p className="text-xs text-muted-foreground">
      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
      {data?.count || 1} Online
    </p>
  );
});
