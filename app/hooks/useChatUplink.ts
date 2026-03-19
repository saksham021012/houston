import { useState, useCallback } from "react";
import { Message } from "../types/chat";

export function useChatUplink(
  addMessages: (sessionId: string, msgs: Message[], title?: string) => void,
  updateMessageChunk: (
    sessionId: string,
    msgId: string,
    chunk: string
  ) => void,
  removeMessage: (sessionId: string, msgId: string) => void
) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transmit = useCallback(
    async (
      text: string,
      sessionId: string | null,
      createNewSession: (title: string) => string,
      existingMessages: Message[]
    ) => {
      if (isStreaming || !text.trim()) return;

      setError(null);
      setIsStreaming(true);

      let targetSessionId = sessionId;
      const isFirstMessage = existingMessages.length === 0;
      const title = isFirstMessage
        ? text.trim().slice(0, 30) + (text.length > 30 ? "..." : "")
        : undefined;

      if (!targetSessionId) {
        targetSessionId = createNewSession(title || "Mission Log");
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };
      
      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      addMessages(targetSessionId, [userMsg, assistantMsg], title);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...existingMessages, userMsg].map(
              ({ role, content }) => ({ role, content })
            ),
          }),
        });

        if (!response.ok) throw new Error("Uplink failure.");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          updateMessageChunk(targetSessionId, assistantId, chunk);
        }
      } catch (err) {
        setError("Unable to establish uplink with AI core.");
        removeMessage(targetSessionId, assistantId);
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, addMessages, updateMessageChunk, removeMessage]
  );

  return { transmit, isStreaming, error, setError };
}
