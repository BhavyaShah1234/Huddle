// Club-side behind-the-scenes cards, ported from the prototype's Club tab
// (ClubView.jsx: demand rows, free-time heatmap, agent talk, event card).

import {
  BLOCKS,
  CLUB,
  CLUB_CHIPS,
  CLUB_DEMAND,
  CLUB_TALK,
  COHOST,
  DAYS,
  DEMAND_TOTAL,
  EVENT,
  HEAT,
  INVITE_ASK_AT,
  INVITE_CHECK_AT,
  INVITE_DELIVERED_AT,
  INVITEES,
  K_MIN,
  POOL_SAMPLES,
  STUDENT_INVITE_PHONE,
  STUDENT_PHONE_IN,
} from "@/story/club";
import { THREADS } from "@/story/scenario";
import { playBeats } from "@/story/playback";
import PhoneMock from "../phone/PhoneMock";
import { Stats } from "./StudentCards";
import { Appear, Face, Panel, Pill } from "./ui";

const MAX_DEMAND = Math.max(...CLUB_DEMAND.map((d) => d.count));

/** Spot demand: anonymous agent shares → pooled counts → demand rows. */
export function DemandPool({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-3">
      <Appear on={progress >= 0.04}>
        <Panel label={<>Anonymous pool · from student agents</>} meta="no names · no IDs kept">
          <div className="flex flex-wrap items-center gap-1.5">
            {POOL_SAMPLES.map((s, i) => (
              <Appear key={s} as="span" on={progress >= 0.06 + i * 0.025}>
                <span className="inline-block rounded-sm border border-line bg-cream px-2 py-0.5 font-mono text-[10.5px] text-ink-soft">
                  {s}
                </span>
              </Appear>
            ))}
            <Appear as="span" on={progress >= 0.28} className="font-sans text-xs text-ink-soft">
              … → pooled into counts
            </Appear>
          </div>
          <p className="mt-2 font-sans text-[11px] text-ink-soft">
            Each student&rsquo;s agent shares only interest, level and rough free times. The pool keeps counts,
            not who.
          </p>
        </Panel>
      </Appear>

      <Appear on={progress >= 0.36}>
        <Stats
          items={[
            { v: DEMAND_TOTAL, s: "students want things you run", lead: true },
            { v: "Thu 5–9pm", s: "best time · 24 of them free" },
            { v: 0, s: "events live" },
          ]}
        />
      </Appear>

      <Panel
        label={<>What students want</>}
        meta={
          <span className="flex gap-1 font-sans">
            {CLUB.cats.map((c) => (
              <Pill key={c}>{c}</Pill>
            ))}
          </span>
        }
        bodyClassName="px-4 py-1.5"
      >
        {CLUB_DEMAND.map((d, i) => {
          const hidden = d.count < K_MIN;
          const chosen = i === 0 && progress >= 0.8;
          return (
            <Appear
              key={d.name}
              on={progress >= 0.42 + i * 0.05}
              className={`grid grid-cols-[minmax(0,1fr)_110px_auto] items-center gap-3 border-b border-line py-1.5 font-sans last:border-b-0 ${
                chosen ? "-mx-2 rounded-sm bg-clay-soft/25 px-2" : ""
              }`}
            >
              <div className="min-w-0">
                <b className="block truncate text-sm font-medium text-ink">{d.name}</b>
                <small className="block truncate text-[11px] text-ink-soft">
                  {hidden ? `Fewer than ${K_MIN} students, so the count is hidden for privacy` : `${d.mix} · best ${d.best}`}
                </small>
              </div>
              {hidden ? (
                <span className="text-center text-ink-soft">—</span>
              ) : (
                <div className="flex items-center gap-2">
                  <b className="w-6 text-right font-serif text-lg font-medium text-ink">{d.count}</b>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream">
                    <i className="block h-full rounded-full bg-clay" style={{ width: `${(d.count / MAX_DEMAND) * 100}%` }} />
                  </div>
                </div>
              )}
              {hidden ? (
                <Pill>🔒 hidden</Pill>
              ) : (
                <span
                  className={`rounded-sm px-2.5 py-1 text-[11px] font-medium ${
                    chosen ? "bg-clay text-cream" : "border border-line text-ink-soft"
                  }`}
                >
                  {chosen ? "Planning ✓" : "Propose event"}
                </span>
              )}
            </Appear>
          );
        })}
      </Panel>
    </div>
  );
}

/** Plan: when these students are free (prototype's Heat). */
export function Heatmap({ progress }: { progress: number }) {
  let best = { v: -1, b: 0, d: 0 };
  HEAT.forEach((r, b) => r.forEach((v, d) => { if (v > best.v) best = { v, b, d }; }));
  const showBest = progress >= 0.22;

  return (
    <Panel label={<>When these students are free</>} meta="anonymous counts">
      <table className="w-full table-fixed border-separate border-spacing-[3px] font-sans text-[10.5px]">
        <tbody>
          <tr>
            <th className="w-[70px]" />
            {DAYS.map((d) => (
              <th key={d} className="font-medium text-ink-soft">{d}</th>
            ))}
          </tr>
          {HEAT.map((row, b) => (
            <tr key={b}>
              <th className="pr-1 text-left font-medium whitespace-nowrap text-ink-soft">{BLOCKS[b]}</th>
              {row.map((v, d) => {
                const on = progress >= 0.06 + b * 0.03;
                const a = 0.1 + 0.85 * (v / best.v);
                const isBest = b === best.b && d === best.d;
                return (
                  <td
                    key={d}
                    title={`${v} students free`}
                    className={`chip h-6 rounded-sm text-center tabular-nums transition-opacity duration-500 ${
                      a > 0.55 ? "text-cream" : "text-ink"
                    } ${isBest && showBest ? "outline-2 outline-offset-1 outline-ink" : ""}`}
                    style={{
                      background: `color-mix(in srgb, var(--color-clay) ${Math.round(a * 100)}%, var(--color-cream))`,
                      opacity: on ? 1 : 0,
                    }}
                  >
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-sans text-[11px] text-ink-soft">
        Only students interested in Coding or Tech careers.{" "}
        <Appear as="span" on={showBest}>
          The outlined cell is the best time: Thu 5–9pm, {best.v} free.
        </Appear>
      </p>
    </Panel>
  );
}

/** Plan: club agent ↔ club agent (prototype's AGENT_TALK). */
export function ClubNegotiation({ progress }: { progress: number }) {
  return (
    <Panel label={<>Club agent ↔ club agent</>} meta={`${CLUB.name} ↔ ${COHOST}`}>
      <div className="grid grid-cols-3 gap-1.5">
        {CLUB_CHIPS.map((c) => {
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
      <ul className="mt-2.5 space-y-1">
        {CLUB_TALK.map((m, i) => (
          <Appear as="li" key={i} on={progress >= m.at} className={`flex ${m.side === "us" ? "" : "justify-end"}`}>
            <div
              className={`max-w-[85%] rounded-md border bg-cream px-2.5 py-1 font-sans text-[12px] leading-snug text-ink ${
                m.side === "us" ? "border-clay/30" : "border-line"
              }`}
            >
              <span className="mr-1 text-[10px] font-medium text-ink-soft">{m.who}</span>
              {m.text}
            </div>
          </Appear>
        ))}
      </ul>
    </Panel>
  );
}

type InviteState = "queued" | "delivered" | "checking" | "asking" | "yes" | "pass";

function inviteState(t: number, answerT: number, answer: "yes" | "pass"): InviteState {
  if (t >= answerT) return answer;
  if (t >= INVITE_ASK_AT) return "asking";
  if (t >= INVITE_CHECK_AT) return "checking";
  if (t >= INVITE_DELIVERED_AT) return "delivered";
  return "queued";
}

function tally(t: number) {
  let yes = 0;
  let pass = 0;
  for (const s of INVITEES) {
    if (t < s.answerT) continue;
    if (s.answer === "yes") yes++;
    else pass++;
  }
  return { yes, pass, waiting: INVITEES.length - yes - pass };
}

// Rendered at full size and scaled, as in EscalationPhone.
const MINI_H = 500;
const MINI_SCALE = 0.68;

/** Invite: request fans out to each student's agent; a student phone shows one of them. */
export function InviteFanout({ progress }: { progress: number }) {
  const t = progress;
  const { yes, pass, waiting } = tally(t);
  const { shown, typing, draft } = playBeats(STUDENT_INVITE_PHONE, progress, "student-invite");
  const phoneIn = progress >= STUDENT_PHONE_IN;

  return (
    <div className="grid min-h-0 grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <Panel
        label={<>Event request · fan-out</>}
        meta={`${CLUB.name} + ${COHOST}`}
      >
        <Appear on={t >= INVITE_DELIVERED_AT} className="mb-2.5 flex flex-wrap items-center gap-1.5 font-sans text-xs text-ink-soft">
          <b className="font-medium text-ink">{EVENT.title}</b>
          <Pill tone="amber">{EVENT.when}</Pill>
          <Pill tone="amber">{EVENT.track}</Pill>
          <span>→ {INVITEES.length} student agents</span>
        </Appear>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-2 xl:grid-cols-2">
          {INVITEES.map((s) => {
            const st = inviteState(t, s.answerT, s.answer);
            return (
              <Appear
                key={s.anonId}
                on={t >= INVITE_DELIVERED_AT}
                className="flex items-center justify-between gap-2 rounded-sm border border-line bg-cream px-2 py-1 font-sans"
              >
                <span className="min-w-0 truncate font-mono text-[10.5px] text-ink">
                  {s.anonId} <span className="text-[10px]">🔒</span>
                </span>
                {st === "delivered" && <Pill>delivered</Pill>}
                {st === "checking" && (
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-ink-soft" title="Private fit check, never shared">
                    🔒 <span className="redact inline-block h-2 w-10">{s.privateCheck}</span>
                  </span>
                )}
                {st === "asking" && <Pill tone="amber">asking student</Pill>}
                {st === "yes" && <Pill tone="good">✓ yes</Pill>}
                {st === "pass" && <Pill>passed</Pill>}
                {st === "queued" && <Pill>…</Pill>}
              </Appear>
            );
          })}
        </div>
        <Appear on={t >= INVITE_ASK_AT} className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-2 font-sans text-xs text-ink-soft">
          <span><b className="text-resolved">{yes}</b> said yes</span>
          <span><b className="text-ink">{pass}</b> passed</span>
          <span><b className="text-clay">{waiting}</b> still deciding</span>
          <span>🔒 the club sees none of these names yet</span>
        </Appear>
      </Panel>

      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out-strong ${
          phoneIn ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-10 opacity-0"
        }`}
        aria-hidden={!phoneIn}
      >
        <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">
          What one student sees
        </p>
        <div style={{ width: MINI_H * (9 / 19.2) * MINI_SCALE, height: MINI_H * MINI_SCALE }}>
          <PhoneMock
            style={{ height: MINI_H, transform: `scale(${MINI_SCALE})`, transformOrigin: "top left" }}
            messages={shown}
            view="agent"
            threads={["agent"]}
            contacts={THREADS}
            typing={typing}
            draft={draft}
          />
        </div>
        <p className="mt-2 max-w-[180px] text-center font-sans text-[11px] text-ink-soft">
          Shreya&rsquo;s own agent asks her. The club never messages her directly.
        </p>
      </div>
    </div>
  );
}

/** Event live: names revealed only for students who said yes. */
export function EventLive({ progress }: { progress: number }) {
  const t = 1 + progress;
  const { yes, pass } = tally(t);
  const going = INVITEES.filter((s) => s.answer === "yes" && t >= s.answerT);
  const done = yes + pass === INVITEES.length;

  return (
    <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Panel label={<>Your events</>} meta={CLUB.name}>
        <div className="flex items-start justify-between gap-3 font-sans">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink">{EVENT.title}</h3>
            <p className="text-[11px] text-ink-soft">{EVENT.when} · {EVENT.detail}</p>
          </div>
          <Pill tone={done ? "good" : "amber"}>{done ? "live" : "filling"}</Pill>
        </div>
        <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft">
          {yes} of {EVENT.invited} interested students said yes
        </p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full origin-left rounded-full bg-clay transition-transform duration-700 ease-out-strong"
            style={{ transform: `scaleX(${yes / EVENT.invited})` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-y-1">
          <div className="flex">
            {going.map((s) => (
              <Face key={s.anonId} you={s.name === "Shreya"}>{s.name.slice(0, 2).toUpperCase()}</Face>
            ))}
          </div>
          <span className="ml-2 font-sans text-xs text-ink-soft">
            {going.map((s) => s.name).join(", ")}
          </span>
        </div>
        <Appear on={progress >= 0.75} className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2.5">
          <span className="font-sans text-xs font-medium whitespace-nowrap text-clay">Open event channel ↗</span>
          <span className="font-sans text-[11px] text-ink-soft">room + beginner track posted</span>
        </Appear>
      </Panel>

      <Panel label={<>Consent ledger</>} meta="names only after yes" bodyClassName="px-4 py-2">
        <ul className="font-sans text-[12px]">
          {INVITEES.map((s) => {
            const answered = t >= s.answerT;
            return (
              <li key={s.anonId} className="flex items-center justify-between gap-2 border-b border-line py-[3px] last:border-b-0">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="font-mono text-[10.5px] text-ink-soft">{s.anonId}</span>
                  <span className="text-ink-soft">→</span>
                  {answered && s.answer === "yes" ? (
                    <span className="font-medium text-ink">{s.name}</span>
                  ) : answered ? (
                    <span className="text-ink-soft">never shown</span>
                  ) : (
                    <span className="text-ink-soft">deciding…</span>
                  )}
                </span>
                {answered ? (
                  s.answer === "yes" ? (
                    <span className="font-mono text-[10.5px] text-resolved">✓ {s.time}</span>
                  ) : (
                    <span className="text-[11px] text-ink-soft">🔒 passed</span>
                  )
                ) : (
                  <span className="text-[11px] text-clay">asking</span>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
