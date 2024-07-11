"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSupabaseBrowser } from "@/supabase/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { memo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "./ui/use-toast";

const MAX_MESSAGE_LENGTH = 200;
const MESSAGE_LENGTH_WARNING_THRESHOLD = MAX_MESSAGE_LENGTH - 10;

const formSchema = z.object({
  body: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export const MessageForm = memo(function MessageForm() {
  // STATE

  const supabase = useSupabaseBrowser();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  // HANDLERS

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from("messages")
        .insert({ body: values.body });

      if (error) {
        toast({
          title: "An error occurred",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      form.reset();
      inputRef.current?.focus();
    },
    [supabase]
  );

  return (
    <div className="fixed w-full bottom-0 z-10 bg-background px-4 py-4 border-t border-stone-500">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-4 w-full"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormControl>
                    <Input
                      placeholder="Type here..."
                      {...field}
                      ref={inputRef}
                      autoFocus
                      maxLength={MAX_MESSAGE_LENGTH}
                      type="text"
                      inputMode="search"
                    />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      "absolute right-2 bottom-0 text-xs",
                      field.value.length > MESSAGE_LENGTH_WARNING_THRESHOLD
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    {field.value.length}/{MAX_MESSAGE_LENGTH}
                  </FormDescription>
                </div>
              )}
            />
            <Button type="submit">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
});
