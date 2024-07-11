import { Button } from "@/components/ui/button";

import LoginGoogleForm from "@/components/LoginGoogleForm";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <LoginGoogleForm />
      <div className="flex gap-4 w-full items-center">
        <div className="flex-1 border-t border-grey-800"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-grey-800"></div>
      </div>
      <Link href={"/login/anon"} className="w-full" passHref legacyBehavior>
        <Button size="icon" className="w-full">
          Continue as guest
        </Button>
      </Link>
    </>
  );
}
