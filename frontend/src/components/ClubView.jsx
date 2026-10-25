import { CLUB, K_MIN, DAYS, BLOCKS, HEAT, AGENT_TALK } from "../data.js";
import { DiscordLink, Stat, Hello, SectionHead, decisionState } from "./common.jsx";

function Heat() {
  let best = { v: -1 };
  HEAT.forEach((r, bi) => r.forEach((v, di) => { if (v > best.v) best = { v, b: bi, d: di }; }));
  return (
    <div className="heat-wrap">
      <table className="heat">
        <tbody>
          <tr><th />{DAYS.map((d) => <th key={d}>{d}</th>)}</tr>
          {HEAT.map((row, bi) => (
            <tr key={bi}>
              <th className="rowh">{BLOCKS[bi]}</th>
              {row.map((v, di) => {
                const a = 0.1 + 0.85 * (v / best.v);
                const cls = (a > 0.55 ? "hot" : "") + (bi === best.b && di === best.d ? " best" : "");
                return <td key={di} className={cls} style={{ background: `rgba(var(--heat), ${a.toFixed(2)})` }} title={v + " students free"}>{v}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DemandRow({ d, queue, propose }) {
  if (d.state === "hidden") {
    return (
      <div className="crow">
        <div className="t"><b>{d.name}</b><small>Fewer than {K_MIN} students, so the count is hidden for privacy</small></div>
        <div />
        <span className="muted">—</span>
      </div>
    );
  }
  const linked = d.queueId && queue.find((x) => x.id === d.queueId);
  const state = linked ? decisionState(linked) : d.state;
  return (
    <div className="crow">
      <div className="t"><b>{d.name}</b><small>{d.mix} · best {d.best}</small></div>
      <div className="n">
        <b>{d.count}</b>
        <div className="bar"><i style={{ width: (d.count / 14) * 100 + "%" }} /></div>
      </div>
      {state === "live" ? <span className="tag-state st-live">✓ {d.event || "Event approved"}</span>
        : state === "pending" ? <span className="tag-state st-pending">Waiting for admin</span>
        : state === "declined" ? <span className="tag-state muted">Declined by admin</span>
        : <button type="button" className="btn-main" onClick={() => propose(d)}>Propose event</button>}
    </div>
  );
}

export default function ClubView({ demand, queue, propose }) {
  const hackState = decisionState(queue.find((x) => x.id === "q2"));
  const total = demand.filter((d) => d.count >= K_MIN).reduce((s, d) => s + d.count, 0);
  return (
    <>
      <Hello title={CLUB.name} sub={`Demand from students in the categories you run. You only see counts, never names, and never for groups smaller than ${K_MIN}.`} who={{ ini: CLUB.ini, name: CLUB.name, sub: "Club officer" }} />
      <div className="stats">
        <Stat v={total} s="students want things you run" lead />
        <Stat v="Thu 5–9pm" s="best time · 24 of them free" />
        <Stat v={hackState === "live" ? 2 : 1} s={hackState === "live" ? "events live" : "event live"} />
        <Stat v={12} s="students going" />
      </div>

      <section className="section">
        <SectionHead title="What students want" right={<div className="cats">{CLUB.cats.map((c) => <span key={c} className="cat">{c}</span>)}</div>} />
        <div className="card">
          {demand.map((d) => <DemandRow key={d.name} d={d} queue={queue} propose={propose} />)}
        </div>
      </section>

      <div className="grid2">
        <section className="section">
          <SectionHead title="Your events" />
          <article className="card ecard">
            <div className="eh">
              <div><h3>DSA night</h3><span className="lvlkey">Thu 7pm · co-hosted with Women in Tech, who run the beginner track</span></div>
              <span className="pill p-good">live</span>
            </div>
            <span className="label">12 of 14 interested students said yes</span>
            <div className="progress"><i style={{ width: (12 / 14) * 100 + "%" }} /></div>
            <details className="talk">
              <summary>How your agent set this up</summary>
              <ol>
                {AGENT_TALK.map((m, i) => <li key={i} className={m[0]}><b>{m[1]}: </b>{m[2]}</li>)}
              </ol>
            </details>
            <div className="actions"><DiscordLink label="Open event channel" /></div>
          </article>

          <article className="card ecard">
            <div className="eh">
              <div><h3>Hackathon prep workshop</h3><span className="lvlkey">Sat 2pm · 11 students interested</span></div>
              <span className={"pill " + (hackState === "live" ? "p-good" : hackState === "declined" ? "p-muted" : "p-amber")}>
                {hackState === "live" ? "approved" : hackState === "declined" ? "declined" : "waiting for admin"}
              </span>
            </div>
            <span className="lvlkey">
              {hackState === "live" ? "Approved. Invites went to the 11 interested students. Names arrive as they say yes."
                : hackState === "declined" ? "The admin declined this event."
                : "Students get invites once an admin approves it."}
            </span>
            {hackState === "live" && <div className="actions"><DiscordLink label="Open event channel" /></div>}
          </article>
        </section>

        <section className="section">
          <SectionHead title="When these students are free" right="anonymous counts" />
          <div className="card" style={{ paddingTop: 12 }}>
            <Heat />
            <p className="foot">Only students interested in Coding or Tech careers. The outlined cell is the best time.</p>
          </div>
        </section>
      </div>
    </>
  );
}
