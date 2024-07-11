import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";

import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import OnlineIndicator from "./OnlineIndicator";

export default async function Header() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const shortName = ((profile.full_name as string) || "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const { data: online } = await supabase
    .from("online")
    .select("count")
    .single();

  return (
    <header className="fixed w-full top-0 z-10 bg-background px-4 py-3 shadow">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">
              Supachat <strong>#general</strong>
            </div>
            <OnlineIndicator initialCount={online?.count} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer" tabIndex={0} role="button">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{shortName}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{profile.full_name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/auth/logout">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
