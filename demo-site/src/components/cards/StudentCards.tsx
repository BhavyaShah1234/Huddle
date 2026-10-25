// Cards ported from the Huddle prototype's Student tab and agent drawer
// (StudentView.jsx, AgentDrawer.jsx), restyled to the cream theme.

import {
  DAYS,
  SLOTS,
  FREE,
  ME,
  PRIVACY,
  WORKSHOP,
  type Interest,
  type Window,
} from "@/story/huddle";
import { Face, Panel, Pill } from "./ui";

/** Agent drawer → "My free times" tab. */
export function FreeTimesCard({ highlight = [] as Window[] }: { highlight?: Window[] }) {
  return (
    <Panel label={<>My free times</>} meta="rough windows only">
      <table className="w-full table-fixed border-separate border-spacing-[3px] font-sans text-[10.5px]">
        <tbody>
          <tr>
            <th className="w-[64px]" />
            {DAYS.map((d) => (
              <th key={d} className="font-medium text-ink-soft">
                {d}
              </th>
            ))}
          </tr>
          {SLOTS.map((s) => (
            <tr key={s}>
              <th className="pr-1 text-left font-medium text-ink-soft">{s}</th>
              {DAYS.map((d) => {
                const key = `${d}-${s}` as Window;
                const free = FREE.includes(key);
                const hot = highlight.includes(key);
                return (
                  <td
                    key={d}
                    className={`chip h-6 rounded-sm border text-center ${
                      hot
                        ? "border-clay bg-clay text-cream"
                        : free
                          ? "border-clay-soft bg-clay-soft/40 text-clay"
                          : "border-line bg-cream"
                    }`}
                  >
                    {free ? "free" : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-sans text-xs leading-relaxed text-ink-soft">
        Your agent shares only these rough windows, never your calendar.
        {highlight.length > 0 && (
          <>
            {" "}
            <span className="font-medium text-clay">Highlighted</span>: shared for swimming.
          </>
        )}
      </p>
    </Panel>
  );
}

/** Student tab → interest card header (counts + level bar). */
export function InterestSummary({ it }: { it: Interest }) {
  return (
    <div className="font-sans">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-ink">{it.name}</h3>
        <Pill tone="amber">{it.level}</Pill>
      </div>
      <div className="mt-2 flex gap-6">
        <div>
          <b className="font-serif text-2xl font-medium text-ink">{it.total}</b>
          <span className="ml-1.5 text-xs text-ink-soft">swimmer agents on campus</span>
        </div>
        <div>
          <b className="font-serif text-2xl font-medium text-clay">{it.atLevel}</b>
          <span className="ml-1.5 text-xs text-ink-soft">at your level, incl. you</span>
        </div>
      </div>
      <div className="mt-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        {it.levels.map(([l, n]) => (
          <i key={l} className={l === it.level ? "bg-clay" : "bg-line"} style={{ flex: n }} />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-ink-soft">
        {it.levels.map(([l, n]) => `${n} ${l}`).join(" · ")} · counts are anonymous
      </p>
    </div>
  );
}

/** Student tab → InviteBox. */
export function InviteBox({
  state,
  title,
  when,
  detail,
}: {
  state: "invite" | "waiting" | "both";
  title: string;
  when: string;
  detail: string;
}) {
  return (
    <div
      className={`chip rounded-md border p-3.5 font-sans ${
        state === "both" ? "border-resolved/40 bg-resolved/5" : "border-clay/30 bg-cream"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <b className="text-sm font-medium text-ink">{title}</b>
        {state === "invite" && <Pill tone="amber">invite for you</Pill>}
        {state === "waiting" && <Pill tone="amber">waiting on others</Pill>}
        {state === "both" && <Pill tone="good">✓ both said yes</Pill>}
      </div>
      <p className="mt-1 text-sm text-ink">{when}</p>
      <p className="text-xs text-ink-soft">{detail}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex">
          <Face you>{ME.ini}</Face>
          <Face anon={state !== "both"}>{state === "both" ? "ME" : "?"}</Face>
        </div>
        <span className="text-xs text-ink-soft">
          {state === "both" ? "You and Mei" : "1 swimmer at your level"}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-ink-soft">
        {state === "invite"
          ? "Names are shared only if everyone says yes."
          : state === "waiting"
            ? "You said yes. Names appear once everyone says yes."
            : "Everyone said yes. Names and contact are unlocked."}
      </p>
      {state === "invite" && (
        <div className="mt-2.5 flex justify-end gap-2">
          <span className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink-soft">Not this time</span>
          <span className="rounded-sm bg-clay px-3 py-1.5 text-xs font-medium text-cream">I&rsquo;m in</span>
        </div>
      )}
    </div>
  );
}

/** Student tab → GroupBox. */
export function GroupBox({
  title,
  kind,
  when,
  people,
  channel,
}: {
  title: string;
  kind: string;
  when: string;
  people: string[];
  channel: string;
}) {
  return (
    <div className="rounded-md border border-resolved/40 bg-resolved/5 p-3.5 font-sans">
      <div className="flex items-center justify-between gap-2">
        <b className="text-sm font-medium text-ink">{title}</b>
        <Pill tone="good">✓ you&rsquo;re in</Pill>
      </div>
      <p className="text-[11px] text-ink-soft">{kind}</p>
      <p className="mt-1 text-sm text-ink">{when}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex">
          <Face you>{ME.ini}</Face>
          {people.map((p) => (
            <Face key={p}>{p.slice(0, 2).toUpperCase()}</Face>
          ))}
        </div>
        <span className="text-xs text-ink-soft">You and {people.join(" and ")}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-clay">{channel} ↗</p>
    </div>
  );
}

/** Student tab → event Poster, compact. Uses the prototype's poster colors for this event. */
export function Poster() {
  const t = WORKSHOP.theme;
  return (
    <div className="grid grid-cols-[132px_1fr] overflow-hidden rounded-md border border-line bg-cream font-sans">
      <div className="relative flex flex-col justify-between p-3" style={{ background: t.bg, color: t.dim }}>
        <span className="self-start rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wider" style={{ background: t.coral, color: t.bg }}>
          IN {WORKSHOP.days} DAYS
        </span>
        <div>
          <p className="text-[8px] uppercase tracking-wider">{WORKSHOP.host} present</p>
          <p className="font-serif text-[22px] font-semibold leading-[0.95]" style={{ color: t.coral }}>
            {WORKSHOP.big[0]}
            <br />
            <span style={{ color: t.amber }}>{WORKSHOP.big[1]}</span>
          </p>
          <p className="mt-1 text-[8px]">{WORKSHOP.glyph}</p>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-clay">upcoming club event · fits you</p>
        <h4 className="font-serif text-base font-medium text-ink">{WORKSHOP.name}</h4>
        <ul className="mt-1 space-y-0.5 text-[11.5px] text-ink-soft">
          <li>In {WORKSHOP.days} days · {WORKSHOP.time}</li>
          <li>{WORKSHOP.place}</li>
          <li>{WORKSHOP.tracks}</li>
        </ul>
        <p className="mt-1.5 text-[11px] text-ink">
          Picked because you&rsquo;re into {WORKSHOP.fits.join(" and ")} (advanced). {WORKSHOP.going} going.
        </p>
      </div>
    </div>
  );
}

/** Student tab → stats row. */
export function Stats({ items }: { items: { v: React.ReactNode; s: string; lead?: boolean }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((x) => (
        <div
          key={x.s}
          className={`rounded-md border p-3 font-sans ${x.lead ? "border-clay/40 bg-clay-soft/30" : "border-line bg-cream-2"}`}
        >
          <span className={`block font-serif text-2xl font-medium ${x.lead ? "text-clay" : "text-ink"}`}>{x.v}</span>
          <span className="text-[11px] text-ink-soft">{x.s}</span>
        </div>
      ))}
    </div>
  );
}

/** Student tab → privacy card. */
export function PrivacyCard() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-line bg-cream p-3 font-sans">
      <Pill tone="muted">privacy</Pill>
      <p className="text-xs leading-relaxed text-ink-soft">{PRIVACY}</p>
    </div>
  );
}
