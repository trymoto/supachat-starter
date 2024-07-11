"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateRandomName } from "../lib/generate-random-name";
import supabase from "../utils/supabase/client";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  full_name: z.string().min(3).max(20),
});

export default function LoginAnonForm() {
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: values.full_name,
          },
        },
      });

      if (error) {
        // TODO: toast error
        console.error(error);
        return;
      }

      router.push("/");
      setNavigating(true);
    },
    [supabase]
  );

  useEffect(() => {
    form.setValue("full_name", generateRandomName());
  }, []);

  const disabled = form.formState.isSubmitting || navigating;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type here..."
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
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
}
