"use client";

import { useState } from "react";
import { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy mission data:", err);
    }
  };

  return (
    <div
      className={`animate-fade-slide-in group mb-5 flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      {/* Label */}
      <div
        className={`mb-1 text-xs tracking-widest ${
          isUser
            ? "text-right"
            : "text-left"
        }`}
        style={{ color: isUser ? "var(--amber-dim)" : "var(--green-dim)" }}
      >
        {isUser ? "INQUIRY //" : "CAPCOM //"}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser ? "text-right" : "text-left"
        }`}
        style={{
          backgroundColor: isUser
            ? "var(--amber-faint)"
            : "var(--green-faint)",
          borderLeft: isUser ? "none" : "2px solid var(--green-primary)",
          borderRight: isUser ? "2px solid var(--amber-primary)" : "none",
          color: isUser ? "var(--amber-primary)" : "var(--green-primary)",
          fontFamily: "var(--font-share-tech-mono), monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message.content}
        {/* Blinking streaming cursor — only on last assistant message while streaming */}
        {isStreaming && !isUser && (
          <span
            className="animate-blink ml-0.5 inline-block"
            style={{ color: "var(--amber-primary)" }}
            aria-hidden="true"
          >
            █
          </span>
        )}

        {/* Copy Button (only for assistant messages, hidden until hover) */}
        {!isUser && message.content && !isStreaming && (
          <button
            onClick={copyToClipboard}
            className={`absolute bottom-1 right-2 text-[10px] tracking-widest transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 ${
              copied ? "text-white opacity-100" : "text-green-dim"
            }`}
          >
            {copied ? "[ DATA COPIED ]" : "[ COPY DATA ]"}
          </button>
        )}
      </div>
    </div>
  );
}
