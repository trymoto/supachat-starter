import { getMessages } from "@/queries/get-messages";
import { getProfileById } from "@/queries/get-profile-by-id";
import useSupabaseServer from "@/utils/supabase/server-client";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

export default async function Chat() {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await getMessages(supabase);

  const serverMessages =
    data?.map((item) => ({
      id: item.id,
      body: item.body || "",
      user_id: item.user_id || "",
      avatar_url: item.profiles?.avatar_url || "",
      full_name: item.profiles?.full_name || "",
    })) || [];

  // warm up profile cache to avoid unnecessary fetching
  await Promise.allSettled(
    serverMessages.map((message) => {
      return prefetchQuery(
        queryClient,
        getProfileById(supabase, message.user_id)
      );
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessageList serverMessages={serverMessages} currentUserId={user?.id} />
      <MessageForm />
    </HydrationBoundary>
  );
}
