"use client";

import { useRef } from "react";
import type { Chapter as ChapterData } from "@/story/scenario";
import { DEMO_LABEL } from "@/story/scenario";
import { useIsDesktop, usePinnedProgress, useReducedMotion } from "./motion/hooks";
import { useViewMode } from "./ViewMode";

export default function Chapter({
  chapter,
  index,
  renderPhone,
  renderBehind,
}: {
  chapter: ChapterData;
  index: number;
  renderPhone: (progress: number) => React.ReactNode;
  renderBehind: (progress: number) => React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const { mode } = useViewMode();
  const pinned = isDesktop;
  const raw = usePinnedProgress(ref, pinned);
  // Mobile has no pinning; it shows the finished state (step 4 adds in-view playback).
  const progress = reduced || !pinned ? 1 : raw;
  const showBehind = mode === "behind";

  return (
    <section
      ref={ref}
      id={chapter.id}
      className={`relative scroll-mt-[var(--header-h)] border-t border-line ${
        index % 2 ? "bg-cream-2" : "bg-cream"
      }`}
      style={pinned ? { height: `${chapter.length}vh` } : undefined}
    >
      <div
        className={
          pinned
            ? "sticky top-[var(--header-h)] flex h-[calc(100vh-var(--header-h))] flex-col overflow-hidden"
            : "flex flex-col"
        }
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 lg:py-6">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl text-clay">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-sans text-xs font-medium uppercase tracking-wide text-clay">
                {chapter.label}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-medium leading-tight text-ink md:text-3xl">
                {chapter.caption}
              </h2>
            </div>
          </div>

          <div
            className={`mt-6 grid min-h-0 flex-1 grid-cols-1 items-center gap-10 ${
              showBehind ? "lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16" : ""
            }`}
          >
            <div className="flex min-h-0 flex-col items-center">
              <p className="mb-3 font-sans text-xs font-medium uppercase tracking-wide text-ink-soft">
                What Shreya sees
              </p>
              {renderPhone(progress)}
            </div>

            {showBehind && (
              <div className="flex min-h-0 flex-col">
                <p className="mb-3 flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-wide text-clay">
                  Behind the scenes
                  <span className="rounded-full border border-line bg-cream px-2 py-0.5 normal-case tracking-normal text-ink-soft">
                    {DEMO_LABEL}
                  </span>
                </p>
                {renderBehind(progress)}
              </div>
            )}
          </div>
        </div>

        {pinned && (
          <div className="h-0.5 w-full bg-line/60" aria-hidden="true">
            <div
              className="h-full origin-left bg-clay"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
