import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const GOOGLE_OAUTH_REDIRECT_URL = `${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/auth/callback`;
