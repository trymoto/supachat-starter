"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateRandomName } from "@/lib/use-random-name";
import supabase from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  first_name: z.string().min(3).max(24),
});

export default function LoginAnonForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            first_name: values.first_name,
            last_name: " ",
          },
        },
      });

      if (error) {
        // TODO: toast error
        console.error(error);
        return;
      }

      router.push("/");
    },
    [supabase]
  );

  useEffect(() => {
    form.setValue("first_name", generateRandomName());
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Type here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center gap-4">
          <Link href="/login" passHref legacyBehavior className="grow">
            <Button variant="outline" className="grow">
              Cancel
            </Button>
          </Link>
          <Button className="grow">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
