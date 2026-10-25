import { INTRO, TAGLINE } from "@/story/scenario";
import Reveal from "./motion/Reveal";
import HeroBlob from "./motion/HeroBlob";
import { ViewModeToggle } from "./ViewMode";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto max-w-4xl scroll-mt-[var(--header-h)] overflow-hidden px-6 py-28 md:py-40"
    >
      <HeroBlob />
      <Reveal className="relative">
        <p className="font-sans text-xs font-medium uppercase tracking-wide text-clay">
          Agent-to-agent coordination
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink md:text-7xl">
          {TAGLINE}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-soft md:text-xl">
          {INTRO}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <ViewModeToggle />
          <span className="font-sans text-sm text-ink-soft">
            Scroll to follow Shreya, a CS junior looking for a swim partner.
          </span>
        </div>
      </Reveal>
    </section>
  );
}
