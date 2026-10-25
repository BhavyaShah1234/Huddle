import { ESCALATION, MEI_PHONE, MEI_PHONE_IN } from "@/story/scenario";
import { playBeats } from "@/story/playback";
import PhoneMock from "../phone/PhoneMock";
import { InviteBox } from "./StudentCards";
import { Appear, Panel, Pill } from "./ui";

// Rendered at full size and scaled, so the bubbles keep real iMessage proportions.
const MINI_H = 500;
const MINI_SCALE = 0.72;

const MEI_CONTACTS = { agent: { name: "Huddle agent", ini: "H", color: "#5f7f5a" } };

export default function EscalationPhone({ progress }: { progress: number }) {
  const { shown, typing, draft } = playBeats(MEI_PHONE, progress, "mei-phone");
  const state = progress >= 0.92 ? "both" : progress >= 0.24 ? "waiting" : "invite";
  const meiIn = progress >= MEI_PHONE_IN;

  return (
    <div className="grid min-h-0 grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 flex-col gap-3">
        <InviteBox
          state={state}
          title="Swim partner"
          when="Wed 8:00–8:45am · SDFC pool"
          detail="20 min drills + 25 min intervals · alternate who leads"
        />
        <Panel label={<>Agent ↔ agent · follow-up</>} meta="anon_4821 ↔ anon_7f3a">
          <ul className="space-y-1.5">
            {ESCALATION.map((m, i) => (
              <Appear as="li" key={i} on={progress >= m.at} className={`flex ${m.side === "us" ? "" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-md border bg-cream px-2.5 py-1.5 font-sans text-[12px] leading-snug text-ink ${m.side === "us" ? "border-clay/30" : "border-line"}`}>
                  <span className="mr-1 text-[10px] font-medium text-ink-soft">{m.side === "us" ? "Shreya's agent" : "Mei's agent"}</span>
                  {m.text}
                  {m.escalate && (
                    <span className="mt-1 flex">
                      <Pill tone="amber">↗ escalated to Mei</Pill>
                    </span>
                  )}
                </div>
              </Appear>
            ))}
          </ul>
        </Panel>
      </div>

      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out-strong ${
          meiIn ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-10 opacity-0"
        }`}
        aria-hidden={!meiIn}
      >
        <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">What Mei sees</p>
        <div style={{ width: MINI_H * (9 / 19.2) * MINI_SCALE, height: MINI_H * MINI_SCALE }}>
        <PhoneMock
          style={{ height: MINI_H, transform: `scale(${MINI_SCALE})`, transformOrigin: "top left" }}
          messages={shown.map((m) => ({ ...m, thread: "agent" }))}
          view="agent"
          threads={["agent"]}
          contacts={MEI_CONTACTS}
          typing={typing}
          draft={draft}
        />
        </div>
      </div>
    </div>
  );
}
