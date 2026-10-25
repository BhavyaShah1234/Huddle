import { useEffect, useRef, useState } from "react";
import { LEVELS, SLOTS, DAYS } from "../data.js";

function freeSummary(free) {
  const on = Object.keys(free).filter((k) => free[k]).map((k) => { const p = k.split("-"); return p[0] + " " + p[1].toLowerCase(); });
  return on.length ? on.join(", ") : "no free times set";
}
const titleCase = (s) => s.replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

function quickReplies(step) {
  if (step === "askLevel") return LEVELS;
  if (step === "askTime") return ["Weekday mornings", "Weekday evenings", "Weekends", "Use my free times"];
  if (step === "askName") return ["Garba", "Pickleball", "Study group"];
  return ["Add an interest", "Update my free times", "What do you share?"];
}

// Private chat with the student's agent, plus their free-time grid.
export default function AgentDrawer({ open, tab, setTab, onClose, chat, setChat, free, setFree, interests, setInterests }) {
  const [flow, setFlow] = useState({ step: "idle", name: null, level: null });
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const f = lastFocus.current && document.body.contains(lastFocus.current) ? lastFocus.current : document.getElementById("meChip");
      if (f) f.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    (tab === "chat" ? inputRef.current : closeRef.current)?.focus();
  }, [open, tab]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chat, tab, open]);

  if (!open) return null;

  const findInterest = (name) => interests.find((i) => i.name.toLowerCase() === name.toLowerCase());

  function handle(text) {
    const t = text.trim();
    if (!t) return;
    const msgs = [{ who: "out", text: t }];
    const say = (text, share) => msgs.push({ who: "in", text, share: share || null });
    const low = t.toLowerCase();
    let nextFlow = flow;

    if (flow.step === "askLevel") {
      const lvl = LEVELS.find((l) => low.includes(l)) || (/never|first time|zero/.test(low) ? "new" : /pro|expert|years/.test(low) ? "advanced" : null);
      if (!lvl) say("Pick the closest one: new, beginner, intermediate or advanced.");
      else { nextFlow = { ...flow, level: lvl, step: "askTime" }; say(`Got it, ${lvl}. When are you usually free for ${flow.name}?`); }
    } else if (flow.step === "askTime") {
      const windows = /use my|my free/.test(low) ? freeSummary(free) : t;
      const existing = findInterest(flow.name);
      if (existing) setInterests(interests.map((i) => (i === existing ? { ...i, level: flow.level } : i)));
      else setInterests([...interests, { name: flow.name, level: flow.level, total: 1, atLevel: 1, levels: [[flow.level, 1]], state: "search", search: "Your agent is looking for people at your level who are free then." }]);
      say(`${existing ? "Updated " : "Added "}${flow.name} ✓ Here's everything I'll share, under an anonymous ID:`,
        `${flow.name.toLowerCase()} · ${flow.level}\nfree: ${windows}\nid: anon_4821`);
      say("Nobody sees your name until you say yes to a group. I'll message you when I find people.");
      nextFlow = { step: "idle", name: null, level: null };
    } else if (flow.step === "idle" && /free time|schedule|when i'm free|availability/.test(low)) {
      say("Tap the times you're usually free. I only share rough windows like \"Thu evening\", never your calendar.");
      setTab("schedule");
    } else if (flow.step === "idle" && /share|privacy|what do you/.test(low)) {
      say("Only the activity, your level and rough free times, under an anonymous ID. Your name goes to a group only after you say yes. Your calendar, inbox and reasons stay with me.");
    } else if (flow.step === "idle" && /^add( an)? interest/.test(low)) {
      nextFlow = { ...flow, step: "askName" };
      say("What would you like to do?");
    } else {
      const name = titleCase(t.replace(/^(i want to|i'd like to|i wanna|add|learn|do|try)\s+/i, ""));
      nextFlow = { ...flow, name, step: "askLevel" };
      const ex = findInterest(name);
      say(ex ? `You already have ${ex.name} (${ex.level}). What's your level now?` : `Nice, ${name}! What's your level?`);
    }
    setFlow(nextFlow);
    setChat([...chat, ...msgs]);
  }

  const freeCount = Object.keys(free).filter((k) => free[k]).length;

  return (
    <>
      <div className="drawer-back" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
        <div className="dh">
          <span className="pa">AI</span>
          <div><b id="drawerTitle">Your agent</b><span>Private. Only you see this chat.</span></div>
          <button type="button" className="x" ref={closeRef} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="dtabs">
          <button type="button" aria-pressed={tab === "chat"} onClick={() => setTab("chat")}>Chat</button>
          <button type="button" aria-pressed={tab === "schedule"} onClick={() => setTab("schedule")}>My free times</button>
        </div>
        <div className="dbody" ref={bodyRef}>
          {tab === "chat" ? (
            chat.map((m, i) => (
              <div key={i} className={"bub " + m.who}>
                {m.text}
                {m.share && <span className="share">{m.share}</span>}
              </div>
            ))
          ) : (
            <>
              <p className="sched-note">When are you usually free? Tap to toggle. Your agent shares only these rough windows, never your calendar.</p>
              <table className="sched">
                <tbody>
                  <tr><th />{DAYS.map((d) => <th key={d}>{d}</th>)}</tr>
                  {SLOTS.map((s) => (
                    <tr key={s}>
                      <th className="rowh">{s}</th>
                      {DAYS.map((d) => {
                        const key = d + "-" + s, on = !!free[key];
                        return (
                          <td key={d}>
                            <button type="button" aria-pressed={on} aria-label={`${d} ${s.toLowerCase()}, ${on ? "free" : "busy"}`} onClick={() => setFree({ ...free, [key]: !on })}>
                              {on ? "free" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="sched-note">{freeCount} free time blocks: {freeSummary(free)}.</p>
              <div className="actions" style={{ justifyContent: "flex-start" }}>
                <button type="button" className="btn-main" onClick={() => {
                  setChat([...chat, { who: "in", text: `Saved ✓ ${freeCount} free time blocks. I'll use them to rank your matches.`, share: "free: " + freeSummary(free) }]);
                  setTab("chat");
                }}>Save free times</button>
              </div>
            </>
          )}
        </div>
        {tab === "chat" && (
          <div className="dfoot">
            <div className="quick">
              {quickReplies(flow.step).map((q) => (
                <button key={q} type="button" onClick={() => { handle(q); inputRef.current?.focus(); }}>{q}</button>
              ))}
            </div>
            <form className="dform" onSubmit={(e) => { e.preventDefault(); handle(input); setInput(""); }}>
              <input ref={inputRef} type="text" autoComplete="off" placeholder="Tell your agent what you want to do…" aria-label="Message your agent" value={input} onChange={(e) => setInput(e.target.value)} />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
