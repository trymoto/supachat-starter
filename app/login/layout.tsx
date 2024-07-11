import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/queries/get-user";
import { useSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type LoginLayoutProps = PropsWithChildren<{}>;

export default async function LoginLayout({ children }: LoginLayoutProps) {
  const supabase = useSupabaseServer();

  const user = await getUser(supabase);
  if (user) return redirect("/");

  return (
    <div className="flex w-full min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Sign into chat</CardTitle>
          <CardDescription>Please, identify yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 w-full justify">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
