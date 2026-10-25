"use client";

import { useEffect, useRef } from "react";
import { CONSTRAINTS, NEGOTIATION, SHARED_VS_PRIVATE } from "@/story/scenario";
import { Appear, Panel, Pill } from "./ui";

export default function NegotiationTranscript({ progress }: { progress: number }) {
  const shown = NEGOTIATION.filter((m) => progress >= m.at);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_200px]">
      <Panel label={<>Agent ↔ agent · negotiation</>} meta="anon_4821 ↔ anon_7f3a" className="min-h-0" bodyClassName="flex min-h-0 flex-col p-4">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {CONSTRAINTS.map((c) => {
            const state = progress >= c.resolvedAt ? "resolved" : progress >= c.raisedAt ? "conflict" : "idle";
            return (
              <div
                key={c.id}
                className={`chip rounded-sm border px-2 py-1.5 font-sans ${
                  state === "resolved"
                    ? "border-resolved/40 bg-resolved/10"
                    : state === "conflict"
                      ? "border-conflict/40 bg-conflict/10"
                      : "border-line bg-cream"
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px] font-medium uppercase">
                  <span className={state === "resolved" ? "text-resolved" : state === "conflict" ? "text-conflict" : "text-ink-soft"}>
                    {c.label}
                  </span>
                  <span aria-hidden="true">{state === "resolved" ? "✓" : state === "conflict" ? "✕" : "·"}</span>
                </div>
                <p className="mt-0.5 text-[11.5px] leading-snug text-ink">
                  {state === "resolved" ? c.resolved : state === "conflict" ? c.conflict : "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 border-b border-line pb-1.5 font-sans text-[11px] font-medium text-ink-soft">
          <span>Shreya&rsquo;s agent <span className="font-mono font-normal">anon_4821</span></span>
          <span className="text-right">Mei&rsquo;s agent <span className="font-mono font-normal">anon_7f3a</span></span>
        </div>
        <div ref={scrollRef} className="no-scrollbar mt-1 max-h-[300px] min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
          {NEGOTIATION.map((m, i) => {
            const c = CONSTRAINTS.find((x) => x.id === m.constraint);
            return (
              <Appear
                key={i}
                on={progress >= m.at}
                className={`grid grid-cols-2 py-0.5 ${progress >= m.at ? "" : "hidden"}`}
              >
                <div
                  className={`rounded-md border px-2.5 py-1 font-sans text-[12px] leading-snug ${
                    m.side === "us"
                      ? "col-start-1 mr-3 border-clay/30 bg-cream text-ink"
                      : "col-start-2 ml-3 border-line bg-cream text-ink"
                  }`}
                >
                  {c && <span className="mr-1 font-mono text-[10px] text-ink-soft">[{c.id}]</span>}
                  {m.text}
                </div>
              </Appear>
            );
          })}
        </div>
      </Panel>

      <Appear on={progress >= 0.9}>
        <Panel label={<>What crossed the wire</>}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-resolved">Shared</p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-ink">
            {SHARED_VS_PRIVATE.shared.map((s) => (
              <li key={s} className="flex gap-1.5"><span className="text-resolved">✓</span>{s}</li>
            ))}
          </ul>
          <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">Kept private</p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-ink-soft">
            {SHARED_VS_PRIVATE.private.map((s) => (
              <li key={s} className="flex gap-1.5"><span>🔒</span>{s}</li>
            ))}
          </ul>
          <div className="mt-3"><Pill tone="good" className="whitespace-normal!">✓ all 4 resolved · asking students</Pill></div>
        </Panel>
      </Appear>
    </div>
  );
}
