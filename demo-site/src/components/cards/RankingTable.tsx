import { Fragment } from "react";
import { RANKING, SHREYA_SWIM, TOP_N } from "@/story/ranking";
import { Appear, Masked, Panel, Pill } from "./ui";

const ROW_AT = (i: number) => 0.1 + i * 0.06;
const TIE_AT = 0.68;
const CUT_AT = 0.6;

export default function RankingTable({ progress }: { progress: number }) {
  const tie = RANKING.length > 1 && RANKING[0].score === RANKING[1].score;
  return (
    <Panel label={<>Top {TOP_N} matches · schedule + level</>} meta="computed live">
      <p className="font-mono text-[11px] text-ink-soft">
        score = <span className="text-clay">0.6</span> × schedule overlap + <span className="text-clay">0.4</span> × level fit
        <span className="text-ink-soft"> · tiebreak: commitment (Shreya: {SHREYA_SWIM.commitment}x/wk)</span>
      </p>

      <table className="mt-3 w-full font-sans text-xs">
        <thead>
          <tr className="text-left text-[10.5px] uppercase tracking-wide text-ink-soft">
            <th className="w-6 pb-1.5 font-medium">#</th>
            <th className="pb-1.5 font-medium">Swimmer</th>
            <th className="hidden pb-1.5 font-medium sm:table-cell">Level</th>
            <th className="pb-1.5 text-right font-medium">Sched</th>
            <th className="pb-1.5 text-right font-medium">Level</th>
            <th className="pb-1.5 text-right font-medium">/wk</th>
            <th className="w-[34%] pb-1.5 pl-3 font-medium">Match</th>
          </tr>
        </thead>
        <tbody>
          {RANKING.map((r, i) => {
            const on = progress >= ROW_AT(i);
            const below = i >= TOP_N;
            return (
              <Fragment key={r.anonId}>
                {i === TOP_N && (
                  <tr>
                    <td colSpan={7} className="py-1">
                      <Appear on={progress >= CUT_AT} className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-wide text-clay">
                        <span className="h-px flex-1 border-t border-dashed border-clay" />
                        top {TOP_N} cut
                        <span className="h-px flex-1 border-t border-dashed border-clay" />
                      </Appear>
                    </td>
                  </tr>
                )}
                <tr
                  className={`appear border-t border-line ${i === 0 && on ? "bg-clay-soft/25" : ""} ${below && progress >= CUT_AT ? "opacity-45!" : ""}`}
                  data-on={on}
                >
                  <td className={`py-1.5 font-serif text-sm ${i === 0 ? "text-clay" : "text-ink-soft"}`}>{r.rank}</td>
                  <td className="py-1.5">
                    <Masked name={r.name} /> <span className="ml-1 font-mono text-[10.5px] text-ink-soft">{r.anonId}</span>
                  </td>
                  <td className="hidden py-1.5 text-ink-soft sm:table-cell">{r.level}</td>
                  <td className="py-1.5 text-right tabular-nums text-ink-soft">{r.schedule}%</td>
                  <td className="py-1.5 text-right tabular-nums text-ink-soft">{r.levelFit}%</td>
                  <td className="py-1.5 text-right tabular-nums text-ink-soft">{r.commitment}x</td>
                  <td className="py-1.5 pl-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream">
                        <div
                          className="h-full origin-left rounded-full bg-clay transition-transform duration-700 ease-out-strong"
                          style={{ transform: `scaleX(${on ? r.score / 100 : 0})` }}
                        />
                      </div>
                      <b className="w-8 text-right tabular-nums text-ink">{r.score}%</b>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-[11px] text-ink-soft">
        {tie && (
          <Appear on={progress >= TIE_AT} as="span" className="inline-flex items-center gap-1.5">
            <Pill tone="amber">tie at {RANKING[0].score}%</Pill>
            #1 wins on commitment: {RANKING[0].commitment}x/wk matches Shreya&rsquo;s {SHREYA_SWIM.commitment}x.
          </Appear>
        )}
        <span>🔒 Names appear once you both say yes.</span>
      </div>
    </Panel>
  );
}
