import { REQUEST } from "@/story/scenario";
import { SWIMMERS } from "@/story/swimmers";
import { Appear, Panel, Pill } from "./ui";

// Each agent answers at its own point in the chapter; "asking" agents resolve later.
const ANSWER_AT = (i: number) => 0.22 + i * 0.05;
const ASK_RESOLVES_AT = 0.82;

export default function DiscoveryGrid({ progress }: { progress: number }) {
  const sent = progress >= 0.12;
  const done = progress >= 0.9;
  const counts = { interested: 0, declined: 0, asked: 0 };
  SWIMMERS.forEach((s) => {
    if (s.response === "declined") counts.declined++;
    else counts.interested++;
    if (s.response === "asking") counts.asked++;
  });

  return (
    <Panel label={<>Discovery · broadcast</>} meta={`${SWIMMERS.length} swimmer agents`}>
      <Appear on={sent} className="mb-3 flex flex-wrap items-center gap-1.5 font-sans text-xs text-ink-soft">
        <span className="font-mono text-ink">{REQUEST.from}</span>
        <span>asks</span>
        {REQUEST.fields.map((f) => (
          <Pill key={f} tone="amber">
            {f}
          </Pill>
        ))}
        <span className="text-[11px]">· no name, no calendar</span>
      </Appear>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {SWIMMERS.map((s, i) => {
          const answered = progress >= ANSWER_AT(i);
          const resolved = s.response === "asking" && progress >= ASK_RESOLVES_AT;
          const state = !answered ? "pending" : resolved ? s.askedResult! : s.response;
          return (
            <Appear
              key={s.anonId}
              on={sent}
              className={`chip rounded-sm border px-2.5 py-1.5 font-sans ${
                state === "declined" ? "border-line bg-cream/60" : "border-line bg-cream"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-ink">
                  {s.anonId} <span className="text-ink-soft">· {s.level}</span>
                </span>
                {state === "pending" && <Pill tone="muted">…</Pill>}
                {state === "interested" && <Pill tone="good">interested</Pill>}
                {state === "declined" && <Pill tone="muted">declined</Pill>}
                {state === "asking" && <Pill tone="amber">asking its student</Pill>}
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2 text-[11px]">
                <span className={`truncate ${answered ? "text-ink-soft" : "text-transparent"}`}>
                  {resolved ? "Student said yes" : s.publicReason}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-ink-soft" title="Private reasoning never leaves the agent">
                  🔒 <span className={`redact inline-block h-2 ${answered ? "w-12" : "w-0"}`}>{s.privateReason}</span>
                </span>
              </div>
            </Appear>
          );
        })}
      </div>

      <Appear on={done} className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2 font-sans text-xs text-ink-soft">
        <span><b className="text-resolved">{counts.interested}</b> interested</span>
        <span><b className="text-ink">{counts.declined}</b> declined</span>
        <span><b className="text-clay">{counts.asked}</b> asked their student first</span>
        <span>🔒 reasons stay with each agent</span>
      </Appear>
    </Panel>
  );
}
