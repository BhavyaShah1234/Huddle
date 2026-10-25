import { CHAPTERS, TYPING_LEAD, type Beat, type Chapter, type ThreadId } from "./scenario";

export type Message = {
  key: string;
  from: "me" | "them";
  text: string;
  share?: string;
  thread: ThreadId;
  /** Timestamp divider shown above this message (only the first of a run keeps it). */
  stamp?: string;
  /** When it was sent, e.g. "Mon 9:01 PM". */
  time?: string;
};

export type PhoneState = {
  messages: Message[];
  view: "list" | ThreadId;
  threads: ThreadId[];
  typing: ThreadId | null;
  /** Text being typed into the input bar by the phone's owner. */
  draft: string;
};

/** Beats that are visible at `progress`, plus typing/draft for the next pending beat. */
export function playBeats(
  beats: Beat[],
  progress: number,
  keyPrefix: string,
  stamp?: string,
) {
  const shown: Message[] = [];
  let typing: ThreadId | null = null;
  let draft = "";

  beats.forEach((b, i) => {
    const thread = b.thread ?? "agent";
    if (progress >= b.at) {
      shown.push({ key: `${keyPrefix}-${i}`, from: b.from, text: b.text, share: b.share, thread, stamp, time: stamp });
      return;
    }
    const lead = b.at - TYPING_LEAD;
    // Only the first pending beat animates, and only once everything before it is shown.
    if (shown.length !== i || progress < lead) return;
    if (b.from === "them") typing = thread;
    else {
      const t = (progress - lead) / TYPING_LEAD;
      draft = b.text.slice(0, Math.ceil(b.text.length * t));
    }
  });

  return { shown, typing: typing as ThreadId | null, draft };
}

/** Everything on the phone at a point in chapter `index` of a story (Shreya's by default). */
export function phoneState(
  index: number,
  progress: number,
  chapters: Chapter[] = CHAPTERS,
): PhoneState {
  const messages: Message[] = [];
  let typing: ThreadId | null = null;
  let draft = "";

  chapters.slice(0, index + 1).forEach((c, ci) => {
    const p = ci < index ? 1 : progress;
    const r = playBeats(c.beats, p, c.id, c.stamp);
    messages.push(...r.shown);
    if (ci === index) {
      typing = r.typing;
      draft = r.draft;
    }
  });

  // Only the first message of each stamp in each thread keeps its divider.
  const lastStamp: Partial<Record<ThreadId, string>> = {};
  for (const m of messages) {
    if (m.stamp && lastStamp[m.thread] === m.stamp) m.stamp = undefined;
    else if (m.stamp) lastStamp[m.thread] = m.stamp;
  }

  const views = chapters[index].views;
  const view = views
    ? [...views].reverse().find((v) => progress >= v.at)?.view ?? views[0].view
    : "agent";

  const threads: ThreadId[] = messages.some((m) => m.thread === "mei")
    ? ["mei", "agent"]
    : ["agent"];

  return { messages, view, threads, typing, draft };
}
