"use client";

import { useEffect, useState } from "react";
import { CHAPTERS, type ChapterId } from "@/story/scenario";
import { ViewModeToggle } from "./ViewMode";

function useActiveChapter() {
  const [active, setActive] = useState<ChapterId | null>(null);

  useEffect(() => {
    let ticking = false;

    function measure() {
      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      let current: ChapterId | null = null;
      for (const c of CHAPTERS) {
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
  }, []);

  return active;
}

export default function Header() {
  const active = useActiveChapter();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-6 lg:h-16 lg:flex-nowrap">
        <a href="#top" className="flex h-14 items-center font-serif text-lg text-ink lg:h-auto">
          Huddle
        </a>

        <nav
          aria-label="Chapters"
          className="no-scrollbar order-3 -mx-6 flex w-[calc(100%+3rem)] items-center gap-1 overflow-x-auto border-t border-line px-6 py-2 lg:order-none lg:mx-0 lg:w-auto lg:border-t-0 lg:p-0"
        >
          {CHAPTERS.map((c, i) => {
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

        <ViewModeToggle size="sm" />
      </div>
    </header>
  );
}
