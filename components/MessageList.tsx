"use client";

import { LinkToLatestMessage } from "@/components/LinkToLatestMessage";
import { Message } from "@/components/Message";
import { DomainMessage } from "@/domain/message";
import { cn } from "@/lib/utils";
import { getMessagesByCursor } from "@/queries/get-messages-by-cursor";
import { useSupabaseBrowser } from "@/supabase/browser";
import { TablesInsert } from "@/supabase/database.types";
import { messageWithProfileToDomainMessage } from "@/supabase/transformers";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

type MessageListProps = {
  serverMessages: DomainMessage[];
  currentUserId?: string;
};

export const MessageList = memo<MessageListProps>(function MessageList({
  serverMessages,
  currentUserId,
}) {
  // STATE

  const supabase = useSupabaseBrowser();
  const [messages, setMessages] = useState<DomainMessage[]>(serverMessages);
  const [hasMore, setHasMore] = useState(true);
  const hasMoreRef = useRef(hasMore);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [initScrollDone, setInitScrollDone] = useState(false);
  const prevScrollHeight = useRef(0);
  const [topRef, topIntersection] = useIntersectionObserver({
    threshold: 0,
  });
  const [bottomRef, bottomIntersection] = useIntersectionObserver({
    threshold: 0,
  });

  // DERIVED

  const currentOldestMessageId = messages[messages.length - 1]?.id || "";
  const isIntersectingTop = !!topIntersection?.isIntersecting;
  const isIntersectingTopRef = useRef(isIntersectingTop);
  const isIntersectingBottom = !!bottomIntersection?.isIntersecting;

  // QUERIES

  const { data: olderMessages, refetch: loadOlderMessages } = useQuery(
    getMessagesByCursor(supabase, currentOldestMessageId),
    {
      enabled: false,
    }
  );

  // EFFECTS

  useEffect(
    function reactToTopIntersection() {
      if (isIntersectingTop && hasMore) {
        loadOlderMessages().then(({ data: result }) => {
          if (!result?.data || !result.data.length) {
            setHasMore(false);
          }
        });
      }

      isIntersectingTopRef.current = isIntersectingTop;
      hasMoreRef.current = hasMore;
    },
    [isIntersectingTop, hasMore]
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
          (payload: { new: TablesInsert<"messages"> }) => {
            if (!payload.new.id) return;

            const domainObject: DomainMessage = {
              id: payload.new.id,
              body: payload.new.body || "",
              userId: payload.new.user_id || null,
              avatarUrl: null,
              fullName: null,
            };

            setMessages((prev) => [domainObject].concat(prev));

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

      const preparedOlderMessages: DomainMessage[] = olderMessages
        .map((item) => messageWithProfileToDomainMessage(item))
        .filter((item): item is DomainMessage => Boolean(item));

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
        // only scroll to bottom if user is not reading old messages
        document.documentElement.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // if user is reading old messages, keep the scroll position
        document.documentElement.scrollTop =
          scrollHeight - prevScrollHeight.current;

        // edge case when topIntersection is not reset after
        // loading, but is still visible so trigger it once more
        if (isIntersectingTopRef.current && hasMoreRef.current) {
          loadOlderMessages().then(({ data: result }) => {
            if (!result?.data || !result.data.length) {
              setHasMore(false);
            }
          });
        }
      }

      prevScrollHeight.current = scrollHeight;

      if (audioRef.current) audioRef.current.play().catch(() => {});
    },
    [messages, loadOlderMessages]
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
      <div className="h-[6em]" ref={bottomRef}></div>
      {messages
        ? messages.map((message) => (
            <Message
              key={message.id}
              self={message.userId === currentUserId}
              {...message}
            />
          ))
        : null}
      <div className="flex justify-center pt-[4em]">
        <Loader2
          className={cn("mr-2 h-4 w-4 animate-spin", hasMore ? "" : "hidden")}
          ref={topRef}
        />
      </div>
      <LinkToLatestMessage enabled={initScrollDone && !isIntersectingBottom} />
    </div>
  );
});
