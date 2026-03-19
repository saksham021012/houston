"use client";

import EmptyState from "./components/EmptyState";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import Sidebar from "./components/Sidebar";
import { useHouston } from "./hooks/useHouston";

export default function Home() {
  const {
    history,
    activeId,
    setActiveId,
    messages,
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
  } = useHouston();

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <Sidebar 
        history={history}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onNewSession={resetChat}
        onDeleteSession={deleteSession}
        isStreaming={isStreaming}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 flex-col relative h-full min-w-0">
        <header
          className="flex shrink-0 items-center justify-between px-4 py-3 md:px-8 border-b"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 shrink-0 items-center justify-center border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--green-dim)", color: "var(--green-primary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            <button
              onClick={resetChat}
              disabled={isStreaming}
              className="group text-xs tracking-widest transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ 
                color: "var(--green-dim)", 
                fontFamily: "var(--font-share-tech-mono), monospace",
                cursor: isStreaming ? "not-allowed" : "pointer" 
              }}
            >
              <span style={{ color: "var(--green-primary)" }} className="glow-green-sm group-hover:glow-green">
                HOUSTON
              </span>
              <span className="mx-2 opacity-40">|</span>
              TERMINAL v1.0
              <span className="ml-2 hidden text-[10px] opacity-0 transition-opacity group-hover:inline group-hover:opacity-40">
                [ NEW SESSION ]
              </span>
            </button>
          </div>

          <div
            className="animate-pulse-glow flex items-center gap-2 text-xs tracking-widest"
            style={{ color: "var(--green-primary)", fontFamily: "var(--font-share-tech-mono), monospace" }}
          >
            <span className="h-2 w-2 rounded-full bg-green" />
            CAPCOM ONLINE
          </div>
        </header>

        {error && (
          <div className="shrink-0 px-4 py-2 text-xs tracking-wide md:px-8 border-b bg-red-500/10 border-red-500/50 text-red-500">
            ⚠ TRANSMISSION ERROR: {error}
          </div>
        )}

        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          <ChatWindow messages={messages} isStreaming={isStreaming} />
        )}

        <InputBar
          input={input}
          setInput={setInput}
          onSubmit={() => sendMessage(input)}
          isStreaming={isStreaming}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}

