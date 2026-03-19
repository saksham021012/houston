"use client";

import { KeyboardEvent, RefObject } from "react";

interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function InputBar({
  input,
  setInput,
  onSubmit,
  isStreaming,
  inputRef,
}: InputBarProps) {
  const canSubmit = !isStreaming && input.trim().length > 0;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div
      className="sticky bottom-0 z-10 px-4 py-4 md:px-8"
      style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <div
          className="terminal-frame flex items-center gap-3 px-4 py-3"
          style={{ borderColor: isStreaming ? "var(--border)" : "var(--green-dim)" }}
        >
          {/* Prompt symbol */}
          <span
            className="shrink-0 select-none text-sm"
            style={{ color: "var(--green-dim)" }}
          >
            &gt;
          </span>

          {/* Text input */}
          <input
            id="inquiry-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ENTER INQUIRY..."
            disabled={isStreaming}
            autoFocus
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm tracking-wider focus:outline-none"
            style={{
              color: "var(--amber-primary)",
              fontFamily: "var(--font-share-tech-mono), monospace",
              caretColor: "var(--amber-primary)",
            }}
          />

          {/* TRANSMIT button */}
          <button
            id="transmit-button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="shrink-0 border px-4 py-1.5 text-xs tracking-widest transition-all duration-200"
            style={{
              borderColor: canSubmit ? "var(--amber-primary)" : "var(--border)",
              color: canSubmit ? "var(--amber-primary)" : "var(--text-secondary)",
              backgroundColor: "transparent",
              fontFamily: "var(--font-share-tech-mono), monospace",
              opacity: canSubmit ? 1 : 0.4,
            }}
            onMouseEnter={(e) => {
              if (canSubmit) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--amber-glow-color)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 10px rgba(255, 176, 0, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            [ TRANSMIT ]
          </button>
        </div>

        {/* Bottom meta line */}
        <div
          className="mt-2 flex items-center justify-between px-1 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>HOUSTON UNIT // SECURE CHANNEL</span>
          <span>ENTER TO TRANSMIT</span>
        </div>
      </div>
    </div>
  );
}
