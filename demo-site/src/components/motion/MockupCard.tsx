export default function MockupCard({
  headerLabel,
  headerMeta,
  children,
}: {
  headerLabel: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm rounded-md border border-line bg-cream-2">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-sans text-xs text-ink-soft">
        <span className="flex items-center gap-2">{headerLabel}</span>
        {headerMeta && <span className="font-mono">{headerMeta}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
