"use client";

export default function TypingIndicator() {
  return (
    <div className="animate-fade-slide-in mb-5 flex flex-col items-start">
      {/* Label */}
      <div
        className="mb-1 text-xs tracking-widest"
        style={{ color: "var(--green-dim)" }}
      >
        CAPCOM //
      </div>

      {/* Indicator bubble */}
      <div
        className="px-4 py-3"
        style={{
          borderLeft: "2px solid var(--green-primary)",
          backgroundColor: "var(--green-faint)",
        }}
      >
        <span
          className="text-sm tracking-widest"
          style={{ color: "var(--green-dim)", fontFamily: "var(--font-share-tech-mono), monospace" }}
        >
          PROCESSING TRANSMISSION
        </span>
        {/* Three staggered dots */}
        <span
          className="animate-dots ml-0.5"
          style={{ animationDelay: "0s", color: "var(--green-primary)" }}
        >
          .
        </span>
        <span
          className="animate-dots"
          style={{ animationDelay: "0.2s", color: "var(--green-primary)" }}
        >
          .
        </span>
        <span
          className="animate-dots"
          style={{ animationDelay: "0.4s", color: "var(--green-primary)" }}
        >
          .
        </span>
      </div>
    </div>
  );
}
