import { MessageForm } from "@/components/MessageForm";
import { MessageList } from "@/components/MessageList";
import { DomainMessage } from "@/domain/message";
import { getMessages } from "@/queries/get-messages";
import { getProfileById } from "@/queries/get-profile-by-id";
import { getUser } from "@/queries/get-user";
import { useSupabaseServer } from "@/supabase/server";
import { messageWithProfileToDomainMessage } from "@/supabase/transformers";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Chat() {
  const queryClient = new QueryClient();
  const supabase = useSupabaseServer();

  const [user, messages] = await Promise.all([
    getUser(supabase),
    getMessages(supabase),
  ]);

  if (!user) return redirect("/login");

  const serverMessages: DomainMessage[] =
    messages.data
      ?.map((item) => messageWithProfileToDomainMessage(item))
      .filter((item): item is DomainMessage => item !== null) || [];

  // warm up profile cache to avoid unnecessary fetching on the client
  await Promise.allSettled(
    serverMessages.map((item) => {
      if (!item.userId) return Promise.resolve();
      return prefetchQuery(queryClient, getProfileById(supabase, item.userId));
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessageList serverMessages={serverMessages} currentUserId={user.id} />
      <MessageForm />
    </HydrationBoundary>
  );
}
