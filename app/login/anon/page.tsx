import { LoginAnonForm } from "@/components/LoginAnonForm";
import { generateRandomName } from "@/lib/generate-random-name";

export default function LoginAnon() {
  const randomName = generateRandomName();
  return <LoginAnonForm randomName={randomName} />;
}
