"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import supabase from "@/utils/supabase/client";

export default function LoginGoogleForm() {
  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
