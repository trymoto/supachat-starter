import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { GOOGLE_OAUTH_REDIRECT_URL } from "../lib/utils";
import { createClient } from "@/utils/supabase/server";

export default function LoginGoogleForm() {
  const handleSignInWithGoogle = async () => {
    "use server";
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: GOOGLE_OAUTH_REDIRECT_URL,
      },
    });

    if (error) {
      console.error(error);
    }

    if (data.url) {
      redirect(data.url);
    }
  };

  return (
    <form action={handleSignInWithGoogle}>
      <Button size="icon" className="w-full" type="submit">
        Continue with Google
      </Button>
    </form>
  );
}
