# Huddle theme

Huddle copies the look of **never-miss-a-lead** (`/Users/ag/Workflows/Vercel website`): same framework, styling approach, animation setup and versions.

| | Reference | Huddle |
|---|---|---|
| Framework | Next 16.3.4 (App Router), React 19.2.8, TypeScript | same |
| Styling | Tailwind CSS 4.3.3 via `@tailwindcss/postcss`, tokens in `globals.css` `@theme inline` | same |
| Motion | Lenis 1.3.26 smooth scroll + hand-written CSS/IntersectionObserver/rAF (no animation lib) | same |

## Tokens

```css
:root {
  --color-cream: #f7f3ec;     /* page background */
  --color-cream-2: #f1ebdf;   /* alternate sections, cards */
  --color-ink: #2b2621;       /* text (never pure black) */
  --color-ink-soft: #5c554c;  /* secondary text */
  --color-clay: #b4603a;      /* single accent: buttons, eyebrows, active states */
  --color-clay-soft: #e7c9b8;
  --color-line: #e4dcca;      /* 1px borders instead of shadows */
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
}
```

Huddle adds `--color-conflict #b4483a`, `--color-resolved #5f7f5a` (muted status colors for negotiation chips) and `--header-h` (sticky header height, 6.5rem mobile / 4rem desktop).

**Fonts** (`next/font/google` in `layout.tsx`): Fraunces 400/500/600 → `font-serif` (headlines), Inter → `font-sans` (everything else).

## Type scale

| Role | Classes |
|---|---|
| Hero h1 | `font-serif text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight text-ink` |
| Section h2 | `font-serif text-3xl md:text-4xl font-medium leading-tight` |
| Eyebrow | `font-sans text-xs font-medium uppercase tracking-wide text-clay` |
| Body | `font-sans text-lg leading-relaxed text-ink-soft` |
| Step number | `font-serif text-2xl text-clay` ("01") |

## Components

```tsx
// Card: MockupCard.tsx (reused verbatim)
<div className="w-full max-w-sm rounded-md border border-line bg-cream-2">
  <div className="flex items-center justify-between border-b border-line px-4 py-3 font-sans text-xs text-ink-soft">…label… <span className="font-mono">meta</span></div>
  <div className="p-5">…</div>
</div>

// Button
className="btn-hover inline-flex items-center justify-center rounded-sm bg-clay px-8 py-4 font-sans text-base font-medium text-cream hover:bg-clay/90"

// Pill / count badge
className="flex h-6 min-w-6 items-center justify-center rounded-full bg-clay px-1.5 font-sans text-xs font-medium text-cream"

// Sticky header
className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-sm"
```

Sections: `border-t border-line`, alternating `bg-cream` / `bg-cream-2`, container `mx-auto max-w-5xl px-6` (Huddle uses `max-w-6xl` to fit phone + panel side by side).

Motion utility classes, copied verbatim into `globals.css`: `.reveal` (blur-in, fired once by `Reveal.tsx`), `.stagger-item` + `--stagger-index` (60ms stagger), `.hover-lift`, `.nav-link`, `.btn-hover`, `.hero-blob-*`, Lenis CSS, and a `prefers-reduced-motion` block that removes transforms and blur.

## Scroll technique: pinned sections

From `FeatureShowcase.tsx` → `PinnedShowcase`. A tall outer section creates scroll distance, the inner wrapper is `position: sticky` so the view stays put, and a rAF-throttled scroll listener turns the section's position into 0→1 progress. Content changes as a function of progress, and Lenis smooths the scroll.

```tsx
<section ref={containerRef} style={{ height: `${count * vhPerItem}vh` }}>
  <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center overflow-hidden">
    {/* content driven by activeIndex */}
  </div>
</section>

useEffect(() => {
  let ticking = false;
  function measure() {
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
    setActiveIndex(Math.min(Math.floor(progress * count), count - 1));
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { measure(); ticking = false; });
  }
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, [count]);
```

```tsx
// SmoothScroll.tsx (reused verbatim)
new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1, touchMultiplier: 2, anchors: true, autoRaf: true });
```

Below 1024px (`useIsDesktop`) the reference drops pinning and stacks items with `Reveal`.

### How Huddle reuses it
- `usePinnedProgress(ref)` in `src/components/motion/hooks.ts` is the same measure, but it returns raw progress and offsets by `--header-h` because the sticky top sits under the header.
- `Chapter.tsx` is the pinned section. Each chapter's length (vh) comes from `scenario.ts`, and progress drives both the phone (which bubbles have arrived) and the behind-the-scenes card (which rows, chips and stages are revealed).
- Chapter nav links are plain `#id` anchors. Lenis `anchors: true` smooth-scrolls to them and respects `scroll-margin-top`, so each chapter sets `scroll-mt-[var(--header-h)]`.
- Reduced motion forces progress to 1 (final states, no animation). Lenis already honors `respectReducedMotion`.

## The one exception: the phone
Inside `PhoneMock`, the UI follows real iOS iMessage rather than the site theme: system font stack, white screen, `#0A84FF` outgoing and `#E9E9EB` incoming bubbles, 18px radius with tails, and a three-dot typing indicator. Everything around the phone uses the theme above.
