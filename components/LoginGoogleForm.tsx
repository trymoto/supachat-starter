"use client";

import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import supabase from "../utils/supabase/client";
import { GOOGLE_OAUTH_REDIRECT_URL } from "../lib/utils";

export default function LoginGoogleForm() {
  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: GOOGLE_OAUTH_REDIRECT_URL,
      },
    });

    if (error) {
      console.error(error);
    }

    redirect("/");
  };

  return (
    <form onSubmit={handleSignInWithGoogle}>
      <Button size="icon" className="w-full" type="submit">
        Continue with Google
      </Button>
    </form>
  );
}
