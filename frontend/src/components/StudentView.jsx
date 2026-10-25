import { ME, EVENTS, MATCHES, score } from "../data.js";
import { DiscordLink, Stat, Hello, SectionHead } from "./common.jsx";

function Poster({ event: EVENT, rsvp, setRsvp }) {
  const d = new Date(Date.now() + EVENT.days * 864e5);
  const when = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <article className="card poster">
      <div className="pz" style={EVENT.theme}>
        <span className="stamp">IN {EVENT.days} DAYS</span>
        <div>
          <div className="host">{EVENT.host} present</div>
          <div className={"big" + (EVENT.stacked ? " stacked" : "")}>{EVENT.big[0]}<span>{EVENT.big[1]}</span></div>
          <div className="glyph">{EVENT.glyph}</div>
        </div>
        <div className="meta">
          <span>{when.toUpperCase()} · {EVENT.time.toUpperCase()}</span>
          <span>{EVENT.place}</span>
        </div>
      </div>
      <div className="pinfo">
        <div className="eyebrow">
          <span className="count">in {EVENT.days} days</span>
          <span className="label">upcoming club event</span>
        </div>
        <h3>{EVENT.name}</h3>
        <ul>
          {[when + " · " + EVENT.time, EVENT.place, "Hosted by " + EVENT.host, EVENT.tracks].map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="why">
          Picked for you because you're into {EVENT.fits.join(" and ")}. {EVENT.going + (rsvp ? 1 : 0)} students going.
        </p>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          {rsvp ? (
            <>
              <span className="pill p-good">✓ you're going</span>
              <DiscordLink label="Open event channel" />
              <button type="button" className="btn-ghost" onClick={() => setRsvp(false)}>Can't go</button>
            </>
          ) : (
            <button type="button" className="btn-main" onClick={() => setRsvp(true)}>I'm going</button>
          )}
        </div>
      </div>
    </article>
  );
}

function MatchList({ name }) {
  const list = (MATCHES[name] || []).slice().sort((a, b) => score(b) - score(a)).slice(0, 5);
  return (
    <div className="matches">
      <div className="mhead">
        <span className="label">{list.length ? `Top ${list.length} matches` : "Matches"}</span>
        <span className="label">schedule + level</span>
      </div>
      {!list.length && <span className="lvlkey">No one else yet.</span>}
      {list.map((m, i) => {
        const s = score(m);
        return (
          <div key={m[0]} className={"mrow" + (i === 0 ? " top" : "")} title={`Schedule overlap ${m[1]}% · level fit ${m[2]}%`}>
            {m[3] ? (
              <span className="nm">{m[0]}</span>
            ) : (
              <span className="nm masked" title="Name is shared once you both say yes">
                {m[0].charAt(0) + "•••"}<span className="lock">🔒</span>
              </span>
            )}
            <div className="mb"><i style={{ width: s + "%" }} /></div>
            <span className="pct">{s}%</span>
          </div>
        );
      })}
      {list.some((m) => !m[3]) && <span className="lvlkey">🔒 Names appear once you both say yes.</span>}
    </div>
  );
}

function GroupBox({ g }) {
  return (
    <div className="box group">
      <div className="bt"><b>{g.title}</b><span className="pill p-good">✓ you're in</span></div>
      <span className="lvlkey">{g.kind}</span>
      <p className="when">{g.when}</p>
      <div className="faces">
        {g.people ? (
          <>
            <span className="face you">{ME.ini}</span>
            {g.people.map((p) => <span key={p} className="face">{p.slice(0, 2).toUpperCase()}</span>)}
            <span>You, {g.people.join(" and ")}</span>
          </>
        ) : (
          <span>{g.going} going, including you</span>
        )}
      </div>
      <div className="actions"><DiscordLink label={g.channel} /></div>
    </div>
  );
}

function InviteBox({ iv, answer, setAnswer }) {
  if (answer === "yes") {
    return (
      <div className="box group">
        <div className="bt"><b>{iv.title}</b><span className="pill p-amber">waiting on others</span></div>
        <p className="when">{iv.when}</p>
        <span className="lvlkey">You said yes. Names and the Discord chat appear once everyone says yes.</span>
      </div>
    );
  }
  if (answer === "no") {
    return (
      <div className="box search">
        <span className="lvlkey">You passed on this one. Nobody was told. Your agent keeps looking.</span>
        <div className="actions"><button type="button" className="btn-ghost" onClick={() => setAnswer(null)}>Undo</button></div>
      </div>
    );
  }
  return (
    <div className="box invite">
      <div className="bt"><b>{iv.title}</b><span className="pill p-amber">invite for you</span></div>
      <p className="when">{iv.when}</p>
      <div className="faces">
        {[0, 1, 2].map((k) => <span key={k} className="face anon">?</span>)}
        <span>{iv.who}</span>
      </div>
      <span className="lvlkey">Names are shared only if everyone says yes.</span>
      <div className="actions">
        <button type="button" className="btn-ghost" onClick={() => setAnswer("no")}>Not this time</button>
        <button type="button" className="btn-main" onClick={() => setAnswer("yes")}>I'm in</button>
      </div>
    </div>
  );
}

function InterestCard({ it, inviteAnswer, setInviteAnswer }) {
  return (
    <article className="card icard">
      <div className="ih"><h3>{it.name}</h3><span className="lvl">{it.level}</span></div>
      <div className="counts">
        <div><b>{it.total}</b><span>{it.total === 1 ? "interested (just you)" : "interested on campus"}</span></div>
        {it.total > 1 && <div className="yours"><b>{it.atLevel}</b><span>at your level, incl. you</span></div>}
      </div>
      {it.levels.length > 1 && (
        <>
          <div className="lvlbar">
            {it.levels.map((l) => <i key={l[0]} className={l[0] === it.level ? "mine" : "other"} style={{ flex: String(l[1]) }} />)}
          </div>
          <span className="lvlkey">{it.levels.map((l) => l[1] + " " + l[0]).join(" · ")}</span>
        </>
      )}
      <MatchList name={it.name} />
      {it.state === "group" && <GroupBox g={it.group} />}
      {it.state === "invite" && <InviteBox iv={it.invite} answer={inviteAnswer} setAnswer={setInviteAnswer} />}
      {it.state === "search" && <div className="box search"><span className="lvlkey">{it.search}</span></div>}
    </article>
  );
}

export default function StudentView({ interests, inviteAnswer, setInviteAnswer, rsvp, setRsvp, openDrawer }) {
  const groups = interests.filter((i) => i.state === "group").length;
  const invites = inviteAnswer ? 0 : 1;
  return (
    <>
      <Hello title={`Hi ${ME.name} 👋`} sub="Who on campus wants the same things you do, and the groups you're already in." who={ME} onOpen={() => openDrawer("chat")} />
      <div className="posters">
        {EVENTS.map((ev) => (
          <Poster key={ev.id} event={ev} rsvp={!!rsvp[ev.id]} setRsvp={(v) => setRsvp({ ...rsvp, [ev.id]: v })} />
        ))}
      </div>
      <p className="suggest-note">Suggestions based on your interests</p>
      <div className="stats">
        <Stat v={interests.length} s="your interests" />
        <Stat v={groups} s="groups you're in" lead />
        <Stat v={invites} s={invites === 1 ? "invite waiting for you" : "invites waiting for you"} />
      </div>
      <section className="section">
        <SectionHead title="Your interests" right="counts are anonymous" />
        <div className="interests">
          {interests.map((it) => <InterestCard key={it.name} it={it} inviteAnswer={inviteAnswer} setInviteAnswer={setInviteAnswer} />)}
          <button type="button" className="card add-card" onClick={() => openDrawer("chat")}><span>+ Add an interest</span></button>
        </div>
      </section>
      <div className="card privacy">
        <span className="lvl">privacy</span>
        <p>Your agent shares only the activity, your level and rough free times, under an anonymous ID. Your name goes to a group only after you say yes. Your calendar, inbox and reasons never leave your agent.</p>
      </div>
    </>
  );
}
