"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { memo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import supabase from "../utils/supabase/client";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField } from "./ui/form";
import { Input } from "./ui/input";

const MAX_MESSAGE_LENGTH = 200;

const formSchema = z.object({
  body: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export default memo(function MessageForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from("messages")
        .insert({ body: values.body });

      if (error) {
        console.error(error);
      }

      form.reset();
      inputRef.current?.focus();
    },
    [supabase]
  );

  return (
    <div className="fixed w-full bottom-0 z-10 bg-background px-4 py-6 border-t border-slate-300">
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
                      field.value.length > MAX_MESSAGE_LENGTH - 10
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
