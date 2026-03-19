"use client";

const SUGGESTIONS = [
  "Tell me about the International Space Station",
  "What went wrong on Apollo 13?",
  "How do rockets escape Earth's gravity?",
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-24 pt-8 md:px-8 md:pt-16">
      {/* Orbital Radar/Terminal Wireframe Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] md:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--green-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--green-primary) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 70%)'
        }}
      />

      <div className="relative z-10 m-auto w-full max-w-3xl text-center">
        {/* HOUSTON title — glowing, Orbitron */}
        <h1
          className="glow-green animate-flicker mb-3 text-5xl font-black uppercase tracking-widest md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
        >
          HOUSTON
        </h1>

        {/* Subtitle */}
        <p
          className="glow-green-sm mb-2 text-xs tracking-[0.3em] uppercase md:text-sm"
          style={{ color: "var(--green-dim)" }}
        >
          MISSION CONTROL // SPACE EXPLORATION DIVISION
        </p>

        {/* Divider */}
        <div
          className="mx-auto mb-8 mt-4 h-px w-24"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Mission Briefing Card */}
        <div
          className="mx-auto mb-10 max-w-xl border p-4 text-left backdrop-blur-sm md:p-6"
          style={{
            borderColor: "rgba(0, 255, 65, 0.15)",
            backgroundColor: "rgba(0, 255, 65, 0.03)",
            fontFamily: "var(--font-share-tech-mono), monospace"
          }}
        >
          <div className="mb-3 flex items-center justify-between border-b pb-2" style={{ borderColor: "rgba(0, 255, 65, 0.1)" }}>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Mission Briefing</span>
            <span className="animate-pulse text-[10px] tracking-widest" style={{ color: "var(--green-primary)" }}>[ SYSTEM READY ]</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed md:text-sm" style={{ color: "var(--green-dim)" }}>
            <p>
              CAPCOM is the AI communications officer for Mission Control Houston.
              This terminal provides direct access to the NASA spaceflight database and astrophysics core.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 uppercase tracking-tighter opacity-80">
              <span>- SPACE HISTORY</span>
              <span>- ROCKET PHYSICS</span>
              <span>- AGENCY BIOMETRICS</span>
              <span>- ORBITAL MECHANICS</span>
            </div>
          </div>
        </div>

        {/* Prompt line with blinking cursor */}
        <p
          className="cursor-blink mb-8 text-sm tracking-widest md:text-base"
          style={{ color: "var(--green-primary)", fontFamily: "var(--font-share-tech-mono), monospace" }}
        >
          UPLINK STABLE. INQUIRE ABOUT MISSIONS, PHYSICS, OR HISTORY.
        </p>

        {/* Transmission select label */}
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0, 255, 65, 0.1)" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-40">Select Transmission</span>
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0, 255, 65, 0.1)" }} />
        </div>

        {/* Suggestion buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-center md:gap-4">
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              id={`suggestion-${i}`}
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="group relative border px-5 py-3 text-left text-xs uppercase tracking-wider transition-all duration-200 md:max-w-[220px] md:text-center"
              style={{
                borderColor: "var(--green-dim)",
                color: "var(--green-primary)",
                backgroundColor: "transparent",
                fontFamily: "var(--font-share-tech-mono), monospace",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--green-glow-color)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--green-primary)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 12px rgba(0, 255, 65, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--green-dim)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <span
                className="mr-2 opacity-50"
                style={{ color: "var(--text-secondary)" }}
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
