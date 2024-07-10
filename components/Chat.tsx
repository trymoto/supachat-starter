"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export default function Chat() {
  return (
    <>
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-8 h-8 border-2 border-primary-foreground">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="font-medium">Alex</div>
                <div className="text-muted-foreground">2:40pm</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p>Awesome! 😍</p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-end">
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2 justify-end">
                <div className="font-medium">You</div>
                <div className="text-muted-foreground">2:41pm</div>
              </div>
              <div className="bg-primary rounded-lg p-3 text-primary-foreground">
                <p>Great to hear! 🎉</p>
              </div>
            </div>
            <Avatar className="w-8 h-8 border-2 border-primary-foreground">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-4">
            <Avatar className="w-8 h-8 border-2 border-primary-foreground">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="font-medium">Sarah</div>
                <div className="text-muted-foreground">2:42pm</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p>Congrats! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 z-10 bg-background px-4 py-3 shadow">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" className="rounded-full px-4 py-2">
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
