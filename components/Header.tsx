import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LogOut } from "lucide-react";

import { OnlineIndicator } from "@/components/OnlineIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/get-initials";
import { getProfileById } from "@/queries/get-profile-by-id";
import { getUser } from "@/queries/get-user";
import { useSupabaseServer } from "@/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Header() {
  const supabase = useSupabaseServer();

  const user = await getUser(supabase);
  if (!user) return redirect("/login");

  const { data: profile } = await getProfileById(supabase, user.id);
  const initials = getInitials(profile?.full_name || "");

  return (
    <header className="fixed w-full top-0 z-10 bg-background px-4 py-3 border-b border-stone-500">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">
              Supachat <strong>#general</strong>
            </div>
            <OnlineIndicator />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer" tabIndex={0} role="button">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{profile?.full_name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/auth/logout">
              <DropdownMenuItem className="cursor-pointer">
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
