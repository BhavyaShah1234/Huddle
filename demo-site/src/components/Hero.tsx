"use client";

import { INTRO, TAGLINE } from "@/story/scenario";
import { CLUB_HERO } from "@/story/club";
import Reveal from "./motion/Reveal";
import HeroBlob from "./motion/HeroBlob";
import { AudienceTabs, useAudience, ViewModeToggle } from "./ViewMode";

const COPY = {
  student: {
    eyebrow: "Agent-to-agent coordination",
    title: TAGLINE,
    intro: INTRO,
    hint: "Scroll to follow Shreya, a CS junior looking for a swim partner.",
  },
  club: CLUB_HERO,
};

export default function Hero() {
  const { audience } = useAudience();
  const c = COPY[audience];

  return (
    <section
      id="top"
      className="relative mx-auto max-w-4xl scroll-mt-[var(--header-h)] overflow-hidden px-6 py-28 md:py-40"
    >
      <HeroBlob />
      <Reveal className="relative">
        <p className="font-sans text-xs font-medium uppercase tracking-wide text-clay">
          {c.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink md:text-7xl">
          {c.title}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-soft md:text-xl">
          {c.intro}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
          <AudienceTabs />
          <ViewModeToggle />
          <span className="font-sans text-sm text-ink-soft">{c.hint}</span>
        </div>
      </Reveal>
    </section>
  );
}
