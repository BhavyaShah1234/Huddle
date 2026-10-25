import { PROFILE } from "@/story/scenario";
import { Appear, Panel, Pill } from "./ui";

export default function ProfileCard({ progress, input }: { progress: number; input: string }) {
  const parsed = progress >= PROFILE[0].at;
  return (
    <Panel
      label={
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Profile skill
        </>
      }
      meta="agent-internal"
    >
      <Appear on={progress >= 0.18}>
        <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">Input · iMessage</p>
        <p className="mt-1 border-l-2 border-clay-soft pl-2 font-serif text-sm italic leading-snug text-ink">
          &ldquo;{input}&rdquo;
        </p>
      </Appear>
      <Appear on={parsed} className="mt-3">
        <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">
          Internal representation
        </p>
      </Appear>
      <div className="mt-1 rounded-sm border border-line bg-cream px-3 py-2 font-mono text-[11.5px] leading-[1.7] text-ink">
        <span className="text-ink-soft">{"{"}</span>
        {PROFILE.map((f) => (
          <Appear key={f.key} on={progress >= f.at} className="flex items-center justify-between gap-2 pl-3">
            <span className="min-w-0 truncate">
              <span className="text-clay">&quot;{f.key}&quot;</span>
              <span className="text-ink-soft">: </span>
              <span className={f.vis === "private" ? "text-ink-soft" : ""}>{f.value}</span>
              <span className="text-ink-soft">,</span>
            </span>
            {f.vis === "shared" ? (
              <Pill tone="amber">shared</Pill>
            ) : (
              <Pill tone="muted">🔒 private</Pill>
            )}
          </Appear>
        ))}
        <span className="text-ink-soft">{"}"}</span>
      </div>
    </Panel>
  );
}
