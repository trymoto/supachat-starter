import Chat from "@/components/Chat";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

import Header from "@/components/Header";
import { DEFAULT_URL } from "@/lib/utils";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
};

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: "Supachat #general",
  description: "Chat with random people in real-time!",
};

export default async function MainPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-[100dvh] flex-col w-full">
      <Header />
      <Chat />
    </div>
  );
}
