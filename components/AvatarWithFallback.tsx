"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo, useMemo } from "react";

type AvatarWithFallbackProps = {
  fullName: string;
  avatarUrl?: string;
  className?: string;
};

export default memo(function AvatarWithFallback({
  fullName,
  avatarUrl,
  className,
}: AvatarWithFallbackProps) {
  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  }, [fullName]);

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="opacity-[0.2]">{initials}</AvatarFallback>
    </Avatar>
  );
});
