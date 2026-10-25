// Shared pieces for behind-the-scenes cards, in never-miss-a-lead's card style.

export function Panel({
  label,
  meta,
  children,
  className = "",
  bodyClassName = "p-4",
}: {
  label: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`flex min-h-0 flex-col rounded-md border border-line bg-cream-2 ${className}`}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5 font-sans text-xs text-ink-soft">
        <span className="flex items-center gap-2">{label}</span>
        {meta && <span className="font-mono">{meta}</span>}
      </div>
      <div className={`min-h-0 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/** Fades/blurs in once `on` is true (scroll-driven, so it reverses on scroll-back). */
export function Appear({
  on,
  children,
  className = "",
  as: Tag = "div",
}: {
  on: boolean;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span" | "tr";
}) {
  return (
    <Tag className={`appear ${className}`} data-on={on}>
      {children}
    </Tag>
  );
}

const PILL = {
  good: "bg-resolved/12 text-resolved border-resolved/30",
  bad: "bg-conflict/10 text-conflict border-conflict/30",
  amber: "bg-clay-soft/50 text-clay border-clay/30",
  muted: "bg-cream text-ink-soft border-line",
  clay: "bg-clay text-cream border-clay",
};

export function Pill({
  tone = "muted",
  children,
  className = "",
}: {
  tone?: keyof typeof PILL;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`chip inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-sans text-[11px] font-medium whitespace-nowrap ${PILL[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Masked name as in the prototype's match list: first letter + ••• 🔒. */
export function Masked({ name, revealed = false }: { name: string; revealed?: boolean }) {
  return revealed ? (
    <span className="font-medium text-ink">{name}</span>
  ) : (
    <span className="text-ink" title="Name is shared once you both say yes">
      {name.charAt(0)}
      <span className="tracking-widest text-ink-soft">•••</span>
      <span className="ml-0.5 text-[10px]">🔒</span>
    </span>
  );
}

export function Face({ children, you, anon }: { children: React.ReactNode; you?: boolean; anon?: boolean }) {
  return (
    <span
      className={`-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-cream-2 font-sans text-[10px] font-semibold first:ml-0 ${
        you ? "bg-clay text-cream" : anon ? "bg-cream text-ink-soft" : "bg-ink text-cream"
      }`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-sans text-[11px] font-medium uppercase tracking-wide text-ink-soft ${className}`}>
      {children}
    </p>
  );
}

export function Lock() {
  return <span aria-label="private">🔒</span>;
}
