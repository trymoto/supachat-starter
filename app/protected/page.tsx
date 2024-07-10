import AuthButton from "../../components/AuthButton";
import MessageForm from "../../components/MessageForm";
import MessageList from "../../components/MessageList";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false })
    .limit(10);

  const serverMessages = data?.toReversed();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <MessageList serverMessages={serverMessages || []} />
          <div className="flex gap-3">
            <MessageForm />
          </div>
        </main>
      </div>
    </div>
  );
}
