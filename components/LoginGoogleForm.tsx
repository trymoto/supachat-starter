import { Button } from "@/components/ui/button";
import { GOOGLE_OAUTH_REDIRECT_URL } from "@/lib/utils";
import { useSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";

export default function LoginGoogleForm() {
  const handleSignInWithGoogle = async () => {
    "use server";
    const supabase = useSupabaseServer();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: GOOGLE_OAUTH_REDIRECT_URL,
      },
    });

    if (error) throw error;
    if (data.url) redirect(data.url);
  };

  return (
    <form action={handleSignInWithGoogle}>
      <Button size="icon" className="w-full" type="submit">
        <img src="/g.svg" alt="Google Logo" className="w-4 h-4 mr-2" />
        Continue with Google
      </Button>
    </form>
  );
}
