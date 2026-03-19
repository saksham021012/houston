import { useState, useCallback, useRef, useEffect } from "react";
import { useChatHistory } from "./useChatHistory";
import { useChatUplink } from "./useChatUplink";

export function useHouston() {
  const {
    history,
    activeId,
    setActiveId,
    activeSession,
    createNewSession,
    deleteSession,
    addMessages,
    updateMessageChunk,
    removeMessage,
  } = useChatHistory();

  const { transmit, isStreaming, error, setError } = useChatUplink(
    addMessages,
    updateMessageChunk,
    removeMessage
  );

  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-manage Sidebar on Desktop ──
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (!activeSession || activeSession.messages.length === 0) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, [activeId, activeSession?.messages.length]);

  // ── Focus management ──
  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      setInput("");
      await transmit(
        text,
        activeId,
        createNewSession,
        activeSession?.messages || []
      );
      focusInput();
    },
    [transmit, activeId, createNewSession, activeSession, focusInput]
  );

  const resetChat = useCallback(() => {
    if (isStreaming) return;

    if (activeSession && activeSession.messages.length === 0) {
      focusInput();
      return;
    }

    createNewSession();
    setError(null);
    focusInput();
  }, [isStreaming, activeSession, createNewSession, setError, focusInput]);

  return {
    history,
    activeId,
    setActiveId,
    messages: activeSession?.messages || [],
    input,
    setInput,
    isStreaming,
    isSidebarOpen,
    setIsSidebarOpen,
    error,
    inputRef,
    createNewSession,
    deleteSession,
    sendMessage,
    resetChat,
  };
}

