"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Message } from "../types/chat";

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
}

export default function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on every message update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const showTypingIndicator =
    isStreaming &&
    lastMessage?.role === "assistant" &&
    lastMessage?.content === "";

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="mx-auto max-w-3xl">
        {messages.map((msg) => {
          if (msg.role === "assistant" && msg.content === "") return null;
          
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={
                isStreaming &&
                msg.id === lastMessage?.id &&
                msg.role === "assistant" &&
                msg.content !== ""
              }
            />
          );
        })}
        {showTypingIndicator && <TypingIndicator />}
      </div>
    </div>
  );
}
