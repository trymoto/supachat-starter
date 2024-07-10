import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <h1>Main page</h1>
    </div>
  );
}
