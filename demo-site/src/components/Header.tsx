"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "@/story/scenario";
import { STORIES } from "@/story/stories";
import { AudienceTabs, useAudience, ViewModeToggle } from "./ViewMode";

function useActiveChapter(chapters: Chapter[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    function measure() {
      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      let current: string | null = null;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= headerH + 2) current = c.id;
      }
      setActive(current);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        measure();
        ticking = false;
      });
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapters]);

  return active;
}

export default function Header() {
  const { audience } = useAudience();
  const chapters = STORIES[audience].chapters;
  const active = useActiveChapter(chapters);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-6 lg:h-16 lg:flex-nowrap">
        <div className="flex h-14 items-center gap-3 lg:h-auto">
          <a href="#top" className="font-serif text-lg text-ink">
            Huddle
          </a>
          <AudienceTabs size="sm" />
        </div>

        <nav
          aria-label="Chapters"
          className="no-scrollbar order-3 -mx-6 flex w-[calc(100%+3rem)] items-center gap-1 overflow-x-auto border-t border-line px-6 py-2 lg:order-none lg:mx-0 lg:w-auto lg:border-t-0 lg:p-0"
        >
          {chapters.map((c, i) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={isActive ? "step" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-sans text-sm transition-colors duration-300 ${
                  isActive ? "bg-cream-2 text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] transition-colors duration-300 ${
                    isActive ? "bg-clay text-cream" : "bg-cream-2 text-ink-soft"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={isActive ? "font-medium" : undefined}>{c.label}</span>
              </a>
            );
          })}
        </nav>

        {/* On phones the view toggle lives in the hero, so the header stays two rows. */}
        <div className="hidden sm:block">
          <ViewModeToggle size="sm" />
        </div>
      </div>
    </header>
  );
}
