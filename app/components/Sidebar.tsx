"use client";

import { useMemo } from "react";
import { ChatSession } from "../types/chat";

interface SidebarProps {
  history: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  history,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isStreaming,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  // Sort history by lastUpdated descending
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }, [history]);

  return (
    <>


      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-all duration-300 md:relative ${
          isOpen ? "translate-x-0 md:ml-0" : "-translate-x-full md:-ml-64"
        }`}
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          fontFamily: "var(--font-share-tech-mono), monospace",
        }}
      >
        {/* Header: New Mission Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            disabled={isStreaming}
            className="w-full border px-4 py-3 text-xs tracking-widest transition-all hover:bg-(--green-glow-color) disabled:opacity-30"
            style={{ borderColor: "var(--green-primary)", color: "var(--green-primary)" }}
          >
            [ + NEW MISSION ]
          </button>
        </div>

        {/* Divider */}
        <div className="px-4 opacity-20">
          <div className="h-px w-full bg-green" />
        </div>

        {/* List of Sessions */}
        <nav className="flex-1 overflow-y-auto p-2 scrollbar-terminal">
          <div className="mb-2 px-2 text-[10px] tracking-[0.2em] opacity-40 uppercase">
            Mission Logs
          </div>
          
          {sortedHistory.length === 0 ? (
            <div className="p-4 text-center text-[10px] opacity-30 italic">
              NO LOGS DETECTED
            </div>
          ) : (
            <div className="space-y-1">
              {sortedHistory.map((session) => (
                <div
                  key={session.id}
                  className={`group relative flex items-center border transition-colors ${
                    activeSessionId === session.id
                      ? "border-green bg-(--green-faint)"
                      : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    className="flex-1 px-3 py-3 text-left"
                  >
                    <div className="truncate text-xs tracking-tight" style={{ color: activeSessionId === session.id ? "var(--green-primary)" : "var(--green-dim)" }}>
                      {session.title || "Untitled Mission"}
                    </div>
                    <div className="mt-1 text-[9px] opacity-40 uppercase">
                      TS: {new Date(session.lastUpdated).toLocaleDateString()}
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="px-3 opacity-0 group-hover:opacity-60 hover:opacity-100! hover:text-red-500"
                    title="Abort Mission Log"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Footer Info */}
        <div className="border-t p-4 text-[9px] tracking-widest opacity-30" style={{ borderColor: "var(--border)" }}>
          LOCAL STORAGE OPS // 2026
        </div>
      </aside>
    </>
  );
}
