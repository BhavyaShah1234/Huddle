import { DISCORD } from "../data.js";

export function DiscordLink({ label }) {
  return (
    <a className="btn discord" href={DISCORD} target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.5 5.3A16 16 0 0 0 15.6 4l-.5 1a15 15 0 0 0-6.2 0l-.5-1a16 16 0 0 0-3.9 1.3C2 9 1.4 12.6 1.7 16.2a16 16 0 0 0 4.8 2.4l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11.4 11.4 0 0 0 11.4 0l.4.3-1.6.8 1 1.6a16 16 0 0 0 4.8-2.4c.4-4.2-.6-7.8-2.9-10.9ZM8.7 14c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Zm6.6 0c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Z" /></svg>
      {" "}{label} ↗
    </a>
  );
}

export function Stat({ v, s, lead }) {
  return (
    <div className={"stat" + (lead ? " lead" : "")}>
      <span className="v">{v}</span>
      <span className="s">{s}</span>
    </div>
  );
}

export function Hello({ title, sub, who, onOpen }) {
  const inner = (
    <>
      <span className="pa">{who.ini}</span>
      <div>
        <b>{who.name}</b>
        <span>{who.sub}</span>
        {onOpen && <span className="hint"> · 💬 chat with your agent</span>}
      </div>
    </>
  );
  return (
    <div className="hello">
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      {onOpen ? (
        <button type="button" className="me" id="meChip" onClick={onOpen} aria-label="Chat with your agent about your interests and free times">{inner}</button>
      ) : (
        <div className="me">{inner}</div>
      )}
    </div>
  );
}

export function SectionHead({ title, right }) {
  return (
    <div className="section-h">
      <h3>{title}</h3>
      {right != null && (typeof right === "string" ? <span className="label">{right}</span> : right)}
    </div>
  );
}

export function decisionState(item) {
  return item.decided === "ok" ? "live" : item.decided === "no" ? "declined" : "pending";
}
