import { CLUB_CATS, RECENT } from "../data.js";
import { Stat, Hello, SectionHead } from "./common.jsx";

export default function AdminView({ queue, decide }) {
  const pending = queue.filter((x) => !x.decided).length;
  const done = queue
    .filter((x) => x.decided === "ok")
    .map((x) => [x.title, x.detail.split(" · ")[0], "Approved just now"])
    .concat(RECENT);
  return (
    <>
      <Hello title="Approvals" sub="New clubs and club events wait here for you. Small student pods form on their own and never need approval." who={{ ini: "AD", name: "Campus admin", sub: "Student life office" }} />
      <div className="stats">
        <Stat v={pending} s={pending === 1 ? "request waiting" : "requests waiting"} lead />
        <Stat v={9} s="active clubs" />
        <Stat v={6} s="club events this week" />
        <Stat v={48} s="student pods running" />
      </div>

      <section className="section">
        <SectionHead title="Waiting for you" />
        <div className="card queue">
          {queue.map((item) => (
            <div key={item.id} className="qrow">
              <span className={"kind " + (item.kind === "club" ? "k-club" : "k-event")}>{item.kind === "club" ? "new club" : "club event"}</span>
              <div className="t"><b>{item.title}</b><small>{item.detail}</small></div>
              {item.decided ? (
                <span className={"decided " + item.decided}>{item.decided === "ok" ? "✓ Approved" : "Declined"}</span>
              ) : (
                <div className="actions">
                  <button type="button" className="btn-ghost" onClick={() => decide(item.id, "no")}>Decline</button>
                  <button type="button" className="btn-main" onClick={() => decide(item.id, "ok")}>Approve</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid2">
        <section className="section">
          <SectionHead title="What each club can see" right="categories" />
          <div className="card tbl">
            <table className="plain">
              <tbody>
                <tr><th>Club</th><th>Sees demand for</th></tr>
                {CLUB_CATS.map((c) => <tr key={c[0]}><td>{c[0]}</td><td>{c[1]}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="lvlkey">A tech club never sees Garba or Bharatanatyam demand, and a dance club never sees coding demand.</p>
        </section>

        <section className="section">
          <SectionHead title="Recently approved" />
          <div className="card tbl">
            <table className="plain">
              <tbody>
                {done.map((d, i) => (
                  <tr key={i}>
                    <td><b>{d[0]}</b><div className="lvlkey">{d[1]}</div></td>
                    <td className="lvlkey">{d[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
