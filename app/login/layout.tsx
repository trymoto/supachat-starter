import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex w-full min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Sign into chat</CardTitle>
          <CardDescription>Please identify yourself.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 w-full justify">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
