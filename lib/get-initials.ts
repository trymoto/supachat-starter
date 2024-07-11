import { useMemo } from "react";

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export function useInitials(fullName: string): string {
  return useMemo(() => getInitials(fullName), [fullName]);
}
