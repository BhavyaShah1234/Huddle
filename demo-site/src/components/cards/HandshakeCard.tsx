import { HANDSHAKE } from "@/story/scenario";
import { Appear, Masked, Panel, Pill } from "./ui";

export default function HandshakeCard({ progress }: { progress: number }) {
  const unlocked = progress >= HANDSHAKE.unlockAt;
  return (
    <Panel label={<>Handshake · mutual consent</>} meta={unlocked ? "unlocked" : "locked"}>
      <ul className="space-y-1.5 font-sans text-sm">
        {HANDSHAKE.consents.map((c) => (
          <Appear as="li" key={c.who} on={progress >= c.at} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="text-resolved">✓</span>
              <span className="font-mono text-xs text-ink-soft">{c.who}</span>
              <span className="text-ink-soft">→</span>
              <Masked name={c.name} revealed={unlocked} />
              <span className="text-ink-soft">said yes</span>
            </span>
            <span className="font-mono text-[11px] text-ink-soft">{c.time}</span>
          </Appear>
        ))}
      </ul>
      <Appear on={unlocked} className="mt-3 grid grid-cols-1 gap-3 border-t border-line pt-3 sm:grid-cols-2">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-resolved">Unlocked for both</p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-ink">
            {HANDSHAKE.unlocked.map((s) => (
              <li key={s} className="flex gap-1.5"><span className="text-resolved">✓</span>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">Still private</p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-ink-soft">
            {HANDSHAKE.stillPrivate.map((s) => (
              <li key={s} className="flex gap-1.5"><span>🔒</span>{s}</li>
            ))}
          </ul>
        </div>
      </Appear>
      <div className="mt-3 flex">
        <Pill tone={unlocked ? "good" : "muted"}>{unlocked ? "✓ consent logged · names revealed" : "waiting for both"}</Pill>
      </div>
    </Panel>
  );
}
