"use client";
import supabase from "@/utils/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { decodeTime } from "ulid";

type Message = {
  id: string;
  author_id: string;
  body: string;
};

export default function MessageList({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(serverMessages);

  useEffect(() => {
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
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setMessages]);

  return (
    <>
      {messages
        ? messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="font-bold">{message.author_id}</div>
              <div>{message.body}</div>
              <div>{new Date(decodeTime(message.id)).getTime()}</div>
            </div>
          ))
        : null}
    </>
  );
}
