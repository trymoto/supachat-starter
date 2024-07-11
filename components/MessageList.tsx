"use client";

import Message from "@/components/Message";
import { cn } from "@/lib/utils";
import { getMessagesByCursor } from "@/queries/get-messages-by-cursor";
import useSupabaseBrowser from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { LinkToLatestMessage } from "./LinkToLatestMessage";

type Message = {
  id: string;
  body: string;
  user_id?: string;
  avatar_url?: string;
  full_name?: string;
};

type MessageListProps = {
  serverMessages: Message[];
  currentUserId?: string;
};

export default memo<MessageListProps>(function MessageList({
  serverMessages,
  currentUserId,
}) {
  const supabase = useSupabaseBrowser();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevScrollHeight = useRef(0);
  const [messages, setMessages] = useState<Message[]>(serverMessages);
  const [initScrollDone, setInitScrollDone] = useState(false);
  const currentOldestMessageId = messages[messages.length - 1]?.id || "";
  const [hasMore, setHasMore] = useState(true);
  const [loadTriggerRef, topIntersection] = useIntersectionObserver({
    threshold: 0,
  });
  const [latestMessageRef, bottomIntersection] = useIntersectionObserver({
    threshold: 0,
  });

  const isIntersectingTop = !!topIntersection?.isIntersecting;
  const isIntersectingBottom = !!bottomIntersection?.isIntersecting;

  useEffect(
    function reactToTopIntersection() {
      if (isIntersectingTop && hasMore) {
        loadOlderMessages().then(({ data: result }) => {
          if (!result?.data || !result.data.length) {
            setHasMore(false);
          }
        });
      }
    },
    [isIntersectingTop, hasMore]
  );

  const { data: olderMessages, refetch: loadOlderMessages } = useQuery(
    getMessagesByCursor(supabase, currentOldestMessageId),
    {
      enabled: false,
    }
  );

  useEffect(
    function subscribeToNewMessages() {
      const channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            setMessages((prev) => [payload.new as Message].concat(prev));
            if (payload.new.user_id === currentUserId) {
              document.documentElement.scrollTop =
                document.documentElement.scrollHeight;
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    [supabase, setMessages]
  );

  useEffect(
    function mergeOlderMessages() {
      if (!olderMessages || !olderMessages.length) return;

      const preparedOlderMessages: Message[] = olderMessages.map((message) => ({
        id: message.id,
        body: message.body || "",
        user_id: message.user_id || "",
        avatar_url: message.profiles?.avatar_url || "",
        full_name: message.profiles?.full_name || "",
      }));

      setMessages((prev) => prev.concat(preparedOlderMessages));
    },
    [olderMessages]
  );

  useEffect(
    function scrollToBottomOnNewMessages() {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;

      const maxScrollTop = scrollHeight - clientHeight;
      const scrolledFromBottom = maxScrollTop - scrollTop;

      if (scrolledFromBottom < 200) {
        document.documentElement.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // maintain scroll position using prevScrollHeight
        document.documentElement.scrollTop =
          scrollHeight - prevScrollHeight.current;
      }

      prevScrollHeight.current = scrollHeight;

      if (audioRef.current) audioRef.current.play().catch(() => {});
    },
    [messages]
  );

  useEffect(function scrollToBottomAndGetAudioOnInit() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    setInitScrollDone(true);

    audioRef.current =
      (document.getElementById("tap-audio") as HTMLAudioElement) || null;
    if (audioRef.current) audioRef.current.volume = 0.2;
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4 flex flex-col-reverse">
      <div className="h-[6em]" ref={latestMessageRef}></div>
      {messages
        ? messages.map((message) => (
            <Message
              key={message.id}
              fullName={message.full_name}
              avatarUrl={message.avatar_url}
              body={message.body}
              id={message.id}
              userId={message.user_id}
              self={message.user_id === currentUserId}
            />
          ))
        : null}
      <div className="flex justify-center pt-[4em]">
        <Loader2
          className={cn("mr-2 h-4 w-4 animate-spin", hasMore ? "" : "hidden")}
          ref={loadTriggerRef}
        />
      </div>
      <LinkToLatestMessage enabled={initScrollDone && !isIntersectingBottom} />
    </div>
  );
});
