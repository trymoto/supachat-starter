"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSupabaseBrowser } from "@/supabase/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "./ui/use-toast";

const MAX_NAME_LENGTH = 20;

const formSchema = z.object({
  fullName: z.string().min(3).max(MAX_NAME_LENGTH),
});

type LoginAnonFormProps = {
  randomName: string;
};

export const LoginAnonForm = memo<LoginAnonFormProps>(function LoginAnonForm({
  randomName,
}) {
  // STATE

  const supabase = useSupabaseBrowser();
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: randomName,
    },
  });

  // DERIVED

  const disabled = form.formState.isSubmitting || navigating;

  // HANDLERS

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "An error occurred",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      router.push("/");
      setNavigating(true);
    },
    [supabase]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type here..."
                  disabled={disabled}
                  maxLength={MAX_NAME_LENGTH}
                />
              </FormControl>
              <FormDescription>Maximum 20 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center gap-4">
          <Link href="/login" passHref legacyBehavior className="grow">
            <Button variant="outline" className="grow" disabled={disabled}>
              Cancel
            </Button>
          </Link>
          <Button className="grow" disabled={disabled}>
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
});
