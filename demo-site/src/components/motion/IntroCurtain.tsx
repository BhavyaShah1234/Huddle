"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "huddle-intro-shown";

export default function IntroCurtain() {
  const [phase, setPhase] = useState<"hold" | "wipe" | "done">("hold");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);

    if (reduceMotion || alreadyShown) {
      const skipTimer = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(skipTimer);
    }

    const wipeTimer = setTimeout(() => setPhase("wipe"), 300);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    }, 300 + 650);
    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div aria-hidden="true" className="intro-curtain" data-phase={phase}>
      <span className="font-serif text-xl text-cream">Huddle</span>
    </div>
  );
}
