import { LEVELS, type Level, type Window } from "./huddle";
import { SWIMMERS, type Swimmer } from "./swimmers";

// Same formula as the prototype's data.js `score`:
//   match = 60% schedule overlap + 40% level fit
// Level fit follows the prototype's numbers: same level 100, one apart 60, two apart 20.
// Commitment (sessions/week, closer to Shreya's is better) breaks ties.

export const SHREYA_SWIM = {
  level: "intermediate" as Level,
  windows: ["Mon-Morning", "Tue-Morning", "Wed-Morning", "Thu-Morning", "Fri-Morning"] as Window[],
  commitment: 3,
};

export const TOP_N = 5;

export type Ranked = Swimmer & {
  schedule: number;
  levelFit: number;
  score: number;
  rank: number;
};

export function scheduleOverlap(mine: Window[], theirs: Window[]) {
  const shared = mine.filter((w) => theirs.includes(w)).length;
  return Math.round((shared / mine.length) * 100);
}

export function levelFit(a: Level, b: Level) {
  const gap = Math.abs(LEVELS.indexOf(a) - LEVELS.indexOf(b));
  return Math.max(0, 100 - 40 * gap);
}

export const score = (schedule: number, level: number) =>
  Math.round(0.6 * schedule + 0.4 * level);

export function rank(me = SHREYA_SWIM, swimmers = SWIMMERS): Ranked[] {
  return swimmers
    .filter(
      (s) =>
        s.response === "interested" ||
        (s.response === "asking" && s.askedResult === "interested"),
    )
    .map((s) => {
      const schedule = scheduleOverlap(me.windows, s.windows);
      const lf = levelFit(me.level, s.level);
      return { ...s, schedule, levelFit: lf, score: score(schedule, lf), rank: 0 };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Math.abs(a.commitment - me.commitment) -
          Math.abs(b.commitment - me.commitment),
    )
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export const RANKING = rank();
