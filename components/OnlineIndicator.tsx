"use client";

import { memo, useCallback, useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";

type OnlineIndicatorProps = {
  initialCount?: number;
};

export default memo<OnlineIndicatorProps>(function OnlineIndicator({
  initialCount = 1,
}) {
  const [count, setCount] = useState(Math.max(initialCount, 1));

  const fetchOnlineCount = useCallback(async () => {
    const { data } = await supabase
      .from("online")
      .select("count")
      .limit(1)
      .single();

    if (data)
      setCount((prev) => {
        const result = data.count - prev > 1 ? prev + 1 : data.count;
        return Math.max(result, 1);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOnlineCount();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchOnlineCount]);

  return (
    <p className="text-xs text-muted-foreground">
      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
      {count} Online
    </p>
  );
});
