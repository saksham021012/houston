import { useState, useCallback, useEffect, useMemo } from "react";
import { ChatSession, Message } from "../types/chat";

const HISTORY_KEY = "houston-chat-history";
const OLD_STORAGE_KEY = "houston-messages"; // For legacy migration

export function useChatHistory() {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeSession = useMemo(
    () => history.find((s) => s.id === activeId) || null,
    [history, activeId]
  );

  // ── Persistence: Load ──
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const oldMessages = localStorage.getItem(OLD_STORAGE_KEY);

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory, (key, value) => {
          if (key === "timestamp") return new Date(value);
          return value;
        });
        setHistory(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch (e) {
        console.error("Mission Log Corruption:", e);
      }
    } else if (oldMessages) {
      try {
        const parsedMsgs = JSON.parse(oldMessages, (key, value) => {
          if (key === "timestamp") return new Date(value);
          return value;
        });
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          title: parsedMsgs[0]?.content.slice(0, 30) || "Legacy Mission",
          messages: parsedMsgs,
          lastUpdated: new Date().toISOString(),
        };
        setHistory([newSession]);
        setActiveId(newSession.id);
        localStorage.removeItem(OLD_STORAGE_KEY);
      } catch (e) {
        console.error("Migration Failure:", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // ── Persistence: Save ──
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // ── Session Management ──
  const createNewSession = useCallback((initialTitle = "") => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: initialTitle,
      messages: [],
      lastUpdated: new Date().toISOString(),
    };
    setHistory((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
    return newSession.id;
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        if (activeId === id) {
          setActiveId(filtered[0]?.id || null);
        }
        return filtered;
      });
    },
    [activeId]
  );

  // ── Update Logic ──
  const addMessages = useCallback(
    (sessionId: string, newMessages: Message[], title?: string) => {
      setHistory((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              title: title ?? s.title,
              messages: [...s.messages, ...newMessages],
              lastUpdated: new Date().toISOString(),
            };
          }
          return s;
        })
      );
    },
    []
  );

  const updateMessageChunk = useCallback(
    (sessionId: string, messageId: string, chunk: string) => {
      setHistory((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId ? { ...m, content: m.content + chunk } : m
              ),
            };
          }
          return s;
        })
      );
    },
    []
  );

  const removeMessage = useCallback((sessionId: string, messageId: string) => {
    setHistory((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: s.messages.filter(
              (m) => m.id !== messageId || m.content !== ""
            ),
          };
        }
        return s;
      })
    );
  }, []);

  return {
    history,
    activeId,
    setActiveId,
    activeSession,
    createNewSession,
    deleteSession,
    addMessages,
    updateMessageChunk,
    removeMessage,
  };
}
