"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/lib/get-initials";
import { memo } from "react";

type AvatarWithFallbackProps = {
  fullName: string;
  avatarUrl?: string;
  className?: string;
};

export const AvatarWithFallback = memo<AvatarWithFallbackProps>(
  function AvatarWithFallback({ fullName, avatarUrl, className }) {
    const initials = useInitials(fullName);

    return (
      <Avatar className={className}>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="opacity-[0.2]">{initials}</AvatarFallback>
      </Avatar>
    );
  }
);
