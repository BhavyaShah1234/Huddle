import { useCallback, useEffect, useState } from "react";
import * as data from "./data.js";
import StudentView from "./components/StudentView.jsx";
import ClubView from "./components/ClubView.jsx";
import AdminView from "./components/AdminView.jsx";
import AgentDrawer from "./components/AgentDrawer.jsx";

const VIEWS = ["student", "club", "admin"];
const viewFromHash = () => {
  const h = window.location.hash.replace("#", "");
  return VIEWS.includes(h) ? h : "student";
};

export default function App() {
  const [view, setView] = useState(viewFromHash);

  // Student state
  const [interests, setInterests] = useState(data.INTERESTS);
  const [inviteAnswer, setInviteAnswer] = useState(null);
  const [rsvp, setRsvp] = useState({});
  const [chat, setChat] = useState([data.FIRST_MESSAGE]);
  const [free, setFree] = useState(data.FREE);
  const [drawer, setDrawer] = useState({ open: false, tab: "chat" });

  // Club + admin state (shared: club proposals land in the admin queue)
  const [queue, setQueue] = useState(data.QUEUE);
  const [demand, setDemand] = useState(data.CLUB_DEMAND);

  useEffect(() => {
    document.body.dataset.view = view;
  }, [view]);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function switchView(v) {
    setView(v);
    try { window.history.replaceState(null, "", "#" + v); } catch (e) {}
  }

  function propose(d) {
    const id = "p" + queue.length;
    setQueue([...queue, { id, kind: "event", title: d.name, detail: `${data.CLUB.name} · ${d.best} · ${d.count} students interested · ${d.cat}`, decided: null }]);
    setDemand(demand.map((x) => (x === d ? { ...x, queueId: id } : x)));
  }

  function decide(id, decided) {
    setQueue(queue.map((x) => (x.id === id ? { ...x, decided } : x)));
  }

  const openDrawer = (tab) => setDrawer({ open: true, tab: tab || "chat" });
  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);

  return (
    <>
      <div className="wrap">
        <header className="app">
          <div className="brand">
            <div className="mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round"><path d="M3 15c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 3 3 3" /></svg>
            </div>
            <div><h1>Huddle</h1><p>Find your people. At your level. When you're all free.</p></div>
          </div>
          <div className="who-am-i">
            <nav className="roles" role="tablist" aria-label="Preview as">
              {VIEWS.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => switchView(v)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </nav>
            <span className="preview-note">Prototype preview. In the app, each person only sees their own screen.</span>
          </div>
        </header>

        <main>
          <div className="section" style={{ gap: 22 }}>
            {view === "student" && (
              <StudentView interests={interests} inviteAnswer={inviteAnswer} setInviteAnswer={setInviteAnswer} rsvp={rsvp} setRsvp={setRsvp} openDrawer={openDrawer} />
            )}
            {view === "club" && <ClubView demand={demand} queue={queue} propose={propose} />}
            {view === "admin" && <AdminView queue={queue} decide={decide} />}
          </div>
        </main>

        <footer>Example data for the Track 2 prototype.</footer>
      </div>

      <AgentDrawer
        open={drawer.open}
        tab={drawer.tab}
        setTab={(tab) => setDrawer((d) => ({ ...d, tab }))}
        onClose={closeDrawer}
        chat={chat}
        setChat={setChat}
        free={free}
        setFree={setFree}
        interests={interests}
        setInterests={setInterests}
      />
    </>
  );
}
