"use client";

import { cn } from "@/lib/utils";
import { MoveDown } from "lucide-react";
import { memo, useCallback } from "react";
import { Button } from "./ui/button";

type LinkToLatestMessageProps = {
  enabled?: boolean;
};

export const LinkToLatestMessage = memo<LinkToLatestMessageProps>(
  function LinkToLatestMessage({ enabled = false }) {
    const handleClick = useCallback(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    }, []);

    return (
      <div
        className={cn(
          "fixed bottom-[6em] w-screen left-[0] transition-opacity duration-300 flex justify-center opacity-0 pointer-events-none",
          enabled ? "opacity-100 pointer-events-auto" : ""
        )}
      >
        <Button
          className="cursor-pointer"
          onClick={handleClick}
          disabled={!enabled}
        >
          <MoveDown className="w-4 h-4 mr-3" />
          Go to latest message
        </Button>
      </div>
    );
  }
);