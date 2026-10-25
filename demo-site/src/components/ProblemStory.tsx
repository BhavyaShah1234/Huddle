"use client";

import { useRef } from "react";
import { PROBLEM_BEATS, PROBLEM_LENGTH, PROBLEM_VISUAL } from "@/story/problem";
import { usePinnedProgress, useReducedMotion } from "./motion/hooks";
import { useAudience } from "./ViewMode";

// Positions are % of the visual's box, so the scene scales with it while labels stay in rem.
const SHREYA = { x: 22, y: 50 };
const OTHERS = [
  { x: 8, y: 16 },
  { x: 44, y: 10 },
  { x: 94, y: 88 },
  { x: 50, y: 90 },
  { x: 10, y: 84 },
];
// Club members at her level, around the club box, and the direction each drifts away.
const DRIFTERS = [
  { x: 55, y: 14, dx: -10, dy: -10 },
  { x: 93, y: 12, dx: 5, dy: -10 },
  { x: 95, y: 58, dx: 4, dy: 14 },
  { x: 55, y: 60, dx: -12, dy: 12 },
];

const at = (i: number) => PROBLEM_BEATS[i].at;
const span = (p: number, a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1);
const EASE = "var(--ease-out-strong)";

function Dot({
  x,
  y,
  shown,
  pulse,
  delay = 0,
  className = "bg-clay",
}: {
  x: number;
  y: number;
  shown: boolean;
  pulse?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 motion-reduce:transition-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: shown ? 1 : 0,
        scale: shown ? "1" : "0.4",
        transition: `opacity 500ms ${EASE} ${delay}ms, scale 500ms ${EASE} ${delay}ms`,
      }}
    >
      {pulse && (
        <span className={`absolute inset-0 animate-ping rounded-full opacity-40 motion-reduce:animate-none ${className}`} />
      )}
      <span className={`absolute inset-0 rounded-full ${className}`} />
    </span>
  );
}

function Scene({ p }: { p: number }) {
  const clubIn = p >= at(1);
  const scattered = p >= at(3);
  const drift = span(p, at(2), at(3) - 0.02);
  const draw = span(p, at(4), 0.97);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/3] [--ar:1.333] sm:aspect-[2/1] sm:[--ar:2]"
      style={{ width: "min(100%, 46rem, calc((100svh - var(--header-h) - 15rem) * var(--ar)))" }}
    >
      {/* Percentage coordinates keep strokes in px, so pathLength-based drawing stays exact. */}
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {OTHERS.map((o, i) => (
          <line
            key={i}
            x1={`${SHREYA.x}%`}
            y1={`${SHREYA.y}%`}
            x2={`${o.x}%`}
            y2={`${o.y}%`}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            stroke="var(--color-clay)"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={draw > 0 ? 1 : 0}
          />
        ))}
      </svg>

      <div
        className="absolute flex w-[34%] flex-col gap-1.5 rounded-md border border-line bg-cream-2 px-3 py-2.5 motion-reduce:transition-none"
        style={{
          left: "58%",
          top: "18%",
          opacity: clubIn ? (scattered ? 0.3 : 1) : 0,
          translate: clubIn ? "0 0" : "0 0.5rem",
          transition: `opacity 600ms ${EASE}, translate 600ms ${EASE}`,
        }}
      >
        <span className="font-serif text-base font-medium leading-tight text-ink sm:text-lg">{PROBLEM_VISUAL.club}</span>
        <span className="flex flex-wrap gap-1">
          {PROBLEM_VISUAL.mismatches.map((m, i) => (
            <span
              key={m}
              className="rounded-full border border-conflict/30 bg-conflict/10 px-1.5 py-0.5 font-sans text-[0.6875rem] leading-none whitespace-nowrap text-conflict motion-reduce:transition-none"
              style={{
                opacity: p >= at(1) + 0.02 + i * 0.03 ? 1 : 0,
                transition: `opacity 400ms ${EASE}`,
              }}
            >
              ✕ {m}
            </span>
          ))}
        </span>
      </div>

      {DRIFTERS.map((d, i) => (
        <span
          key={i}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-soft/50"
          style={{
            left: `${d.x + d.dx * drift}%`,
            top: `${d.y + d.dy * drift}%`,
            opacity: clubIn ? 1 - drift : 0,
          }}
        />
      ))}

      {OTHERS.map((o, i) => (
        <Dot key={i} x={o.x} y={o.y} shown={scattered} pulse delay={i * 90} />
      ))}

      <Dot x={SHREYA.x} y={SHREYA.y} shown pulse={scattered} />
      <span
        className="absolute mt-3 -translate-x-1/2 rounded-sm bg-cream px-1 font-sans text-sm font-medium text-ink"
        style={{ left: `${SHREYA.x}%`, top: `${SHREYA.y}%` }}
      >
        {PROBLEM_VISUAL.student}
      </span>
    </div>
  );
}

export default function ProblemStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { audience } = useAudience();
  const raw = usePinnedProgress(ref, audience === "student");
  const p = reduced ? 1 : raw;
  const active = PROBLEM_BEATS.reduce((cur, b, i) => (p >= b.at ? i : cur), 0);

  if (audience !== "student") return null;

  return (
    <section
      ref={ref}
      aria-label="The problem"
      className="relative bg-cream"
      style={{ height: `${PROBLEM_LENGTH}vh` }}
    >
      <div className="sticky top-[var(--header-h)] flex h-[calc(100vh-var(--header-h))] flex-col justify-center gap-8 overflow-hidden px-6 py-8">
        <Scene p={p} />

        <div className="mx-auto grid w-full max-w-3xl text-center">
          {PROBLEM_BEATS.map((b, i) => {
            const on = i === active;
            return (
              <div
                key={i}
                aria-hidden={!on}
                className="[grid-area:1/1] motion-reduce:transition-none"
                style={{
                  opacity: on ? 1 : 0,
                  translate: on ? "0 0" : i < active ? "0 -0.5rem" : "0 0.5rem",
                  transition: `opacity 450ms ${EASE}, translate 450ms ${EASE}`,
                }}
              >
                <p className="font-serif text-2xl leading-tight font-medium text-ink sm:text-3xl md:text-4xl">
                  {b.text}
                </p>
                {b.sub && (
                  <p className="mt-3 font-sans text-base leading-relaxed text-ink-soft md:text-lg">{b.sub}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
