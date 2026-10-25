"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { Audience } from "@/story/stories";

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

// Student | Club tab. Lives in the URL (?tab=club) so the club story can be linked
// directly; no param means Student, so the original URL renders as before.
const AUDIENCE_EVENT = "huddle:audience";

function subscribeAudience(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(AUDIENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(AUDIENCE_EVENT, onChange);
  };
}

const readAudience = (): Audience =>
  new URLSearchParams(window.location.search).get("tab") === "club" ? "club" : "student";

export function useAudience() {
  const audience = useSyncExternalStore(subscribeAudience, readAudience, () => "student" as Audience);

  function setAudience(next: Audience) {
    if (next === audience) return;
    const url = new URL(window.location.href);
    if (next === "club") url.searchParams.set("tab", "club");
    else url.searchParams.delete("tab");
    url.hash = "";
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(AUDIENCE_EVENT));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return { audience, setAudience };
}

const audiences: { value: Audience; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "club", label: "Club" },
];

export function AudienceTabs({ size = "md" }: { size?: "sm" | "md" }) {
  const { audience, setAudience } = useAudience();
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <div role="tablist" aria-label="Whose side of Huddle" className="inline-flex shrink-0 rounded-sm border border-line bg-cream-2 p-1">
      {audiences.map((a) => {
        const active = audience === a.value;
        return (
          <button
            key={a.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setAudience(a.value)}
            className={`btn-hover rounded-sm font-sans font-medium whitespace-nowrap ${pad} ${
              active ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            }`}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
