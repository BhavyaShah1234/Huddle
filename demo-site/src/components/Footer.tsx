import { TAGLINE } from "@/story/scenario";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-12 font-sans text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <span className="font-serif text-base text-ink">Huddle</span>
        <span>{TAGLINE}</span>
        <span>Hackathon prototype · scripted demo, no real data</span>
      </div>
    </footer>
  );
}
