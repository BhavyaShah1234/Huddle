"use client";

import { createContext, useContext, useState } from "react";

export type ViewMode = "phone" | "behind";

const ViewModeContext = createContext<{
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}>({ mode: "behind", setMode: () => {} });

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("behind");
  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}

const options: { value: ViewMode; label: string; short: string }[] = [
  { value: "phone", label: "Phone only", short: "Phone" },
  { value: "behind", label: "Behind the scenes", short: "Behind" },
];

export function ViewModeToggle({ size = "md" }: { size?: "sm" | "md" }) {
  const { mode, setMode } = useViewMode();
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <div
      role="radiogroup"
      aria-label="View mode"
      className="inline-flex shrink-0 rounded-sm border border-line bg-cream-2 p-1"
    >
      {options.map((o) => {
        const active = mode === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(o.value)}
            className={`btn-hover rounded-sm font-sans font-medium whitespace-nowrap ${pad} ${
              active ? "bg-clay text-cream" : "text-ink-soft hover:text-ink"
            }`}
          >
            {size === "sm" ? (
              <>
                <span className="sm:hidden">{o.short}</span>
                <span className="hidden sm:inline">{o.label}</span>
              </>
            ) : (
              o.label
            )}
          </button>
        );
      })}
    </div>
  );
}
