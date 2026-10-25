"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

// Same breakpoint logic as never-miss-a-lead's useIsDesktop, via
// useSyncExternalStore so it doesn't setState inside an effect.
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useIsDesktop(breakpoint = 1024) {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * 0→1 progress through a tall section whose inner content is sticky.
 * Same rAF-throttled measure as PinnedShowcase, but returns the raw value
 * instead of an index so beats can be placed anywhere along the chapter.
 * The sticky top is the header height, read from the --header-h CSS var (rem).
 */
export function usePinnedProgress(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let ticking = false;

    function measure() {
      const el = ref.current;
      if (!el) return;
      const headerH = parseFloat(
        getComputedStyle(el).getPropertyValue("--header-h"),
      ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight - headerH;
      const total = rect.height - viewport;
      const p = total > 0 ? (headerH - rect.top) / total : 0;
      setProgress(Math.min(Math.max(p, 0), 1));
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
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, enabled]);

  return progress;
}
