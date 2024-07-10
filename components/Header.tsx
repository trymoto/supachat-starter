import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background px-4 py-3 shadow">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">
              Supachat <strong>#general</strong>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              4 Online
            </p>
          </div>
        </div>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
