// The whole Huddle demo script lives here. Components only read this file,
// so copy, ordering and timing can be edited without touching them.
//
// Timing: every `at` is a point in the chapter's scroll progress (0 → 1).
// A beat appears once progress passes `at`. Incoming beats show a typing
// indicator for TYPING_LEAD before they land; outgoing beats are "typed" into
// the input bar for the same span.

import { FIRST_MESSAGE, WORKSHOP, POD } from "./huddle";

export const TAGLINE = "Find your people. At your level. When you're all free.";

export const INTRO =
  "Every student gets a personal agent in iMessage. Behind the scenes, agents find each other, rank matches, negotiate, and only then ask their student to say yes.";

export const DEMO_LABEL = "Demo view. Students never see this.";

export const TYPING_LEAD = 0.1;

export type ChapterId =
  | "onboard"
  | "discover"
  | "rank"
  | "negotiate"
  | "confirm"
  | "connect"
  | "updates";

export type ThreadId = "agent" | "mei";

export type Beat = {
  at: number;
  /** "me" is the phone's owner (blue, right). Anyone else is grey, left. */
  from: "me" | "them";
  text: string;
  /** Monospace "what I'll share" block inside the bubble, as in the prototype's agent chat. */
  share?: string;
  thread?: ThreadId;
};

export type PhoneView = { at: number; view: "list" | ThreadId };

export type Chapter = {
  id: ChapterId;
  label: string;
  /** One-line caption of the stage, shown above the split layout. */
  caption: string;
  /** Pinned scroll length in viewport heights. More beats → longer chapter. */
  length: number;
  /** Timestamp divider shown in the thread when this chapter's messages start. */
  stamp: string;
  beats: Beat[];
  /** Which screen the phone shows over the chapter. Defaults to the agent thread. */
  views?: PhoneView[];
  /** Students never see agent-to-agent negotiation; the phone shows this note instead. */
  phoneNote?: string;
};

export const THREADS: Record<ThreadId, { name: string; ini: string; color: string }> = {
  agent: { name: "Huddle agent", ini: "H", color: "#b4603a" },
  mei: { name: "Mei", ini: "M", color: "#5f7f5a" },
};

export const CHAPTERS: Chapter[] = [
  {
    id: "onboard",
    label: "Onboard",
    caption: "Shreya tells her agent what she wants, in plain words.",
    length: 280,
    stamp: "Mon 9:01 PM",
    beats: [
      { at: 0, from: "them", text: FIRST_MESSAGE },
      {
        at: 0.18,
        from: "me",
        text: "I swim about 3x a week, intermediate, want to get faster. Free weekday mornings, prefer the SDFC pool.",
      },
      {
        at: 0.42,
        from: "them",
        text: "Nice! Swimming, intermediate, 3x a week, working on speed. Here's everything I'll share, under an anonymous ID:",
        share: "swimming · intermediate · 3x/week\nfree: weekday mornings\nwhere: SDFC pool\nid: anon_4821",
      },
      {
        at: 0.68,
        from: "them",
        text: "Your name, your exact schedule and why you want to get faster stay with me. I'll text you when I find someone.",
      },
    ],
  },
  {
    id: "discover",
    label: "Discover",
    caption: "Her agent asks ten swimmer agents, under an anonymous ID.",
    length: 260,
    stamp: "Mon 9:03 PM",
    beats: [{ at: 0.12, from: "them", text: "Looking for swimmers at your level…" }],
  },
  {
    id: "rank",
    label: "Rank",
    caption: "Interested matches are scored: 60% schedule, 40% level.",
    length: 240,
    stamp: "Mon 9:03 PM",
    beats: [],
  },
  {
    id: "negotiate",
    label: "Negotiate",
    caption: "Two agents work out time, place and focus. Shreya sees none of it.",
    length: 340,
    stamp: "Mon 9:04 PM",
    beats: [],
    phoneNote: "Nothing new. Agents are talking.",
  },
  {
    id: "confirm",
    label: "Confirm",
    caption: "Only now does Shreya get asked. Mei gets asked too.",
    length: 340,
    stamp: "Mon 9:12 PM",
    beats: [
      {
        at: 0.1,
        from: "them",
        text: "Found a swim partner at your level. Wed 8am at SDFC: 20 min drills + 25 min intervals. Want it?",
      },
      { at: 0.24, from: "me", text: "Yes! Could she do twice a week?" },
      { at: 0.36, from: "them", text: "Let me check with her agent." },
      {
        at: 0.8,
        from: "them",
        text: "She's in. Saturdays work for her too: Wed 8am + Sat 9am at SDFC. Lock it in?",
      },
      { at: 0.92, from: "me", text: "Lock it in 🙌" },
    ],
  },
  {
    id: "connect",
    label: "Connect",
    caption: "Both said yes, so names unlock and a real thread opens.",
    length: 280,
    stamp: "Mon 9:16 PM",
    views: [
      { at: 0, view: "agent" },
      { at: 0.24, view: "list" },
      { at: 0.4, view: "mei" },
    ],
    beats: [
      {
        at: 0.1,
        from: "them",
        text: "You're both in! I shared your name and number with Mei. Say hi 👋",
      },
      {
        at: 0.2,
        from: "them",
        thread: "mei",
        text: "Hey Shreya! Mei here 🏊‍♀️ See you Wed 8am at SDFC?",
      },
      {
        at: 0.58,
        from: "me",
        thread: "mei",
        text: "Yes! Want to lead drills the first week?",
      },
      {
        at: 0.8,
        from: "them",
        thread: "mei",
        text: "Deal. You take intervals next week 💪",
      },
    ],
  },
  {
    id: "updates",
    label: "Updates",
    caption: "Later that week, Shreya asks what's new.",
    length: 260,
    stamp: "Thu 6:30 PM",
    views: [
      { at: 0, view: "list" },
      { at: 0.1, view: "agent" },
    ],
    beats: [
      { at: 0.2, from: "me", text: "what are the updates?" },
      {
        at: 0.45,
        from: "them",
        text: `Here's your week:\n• New match: Mei, swimming, Wed + Sat at SDFC\n• Invite accepted: ${POD.title} pod with ${POD.people.join(" and ")}, Sundays 4pm\n• Fits you: ${WORKSHOP.name}, in ${WORKSHOP.days} days, ${WORKSHOP.time}. ${WORKSHOP.going} going.`,
      },
      { at: 0.7, from: "them", text: "Want me to RSVP you to the workshop?" },
      { at: 0.86, from: "me", text: "Yes please!" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Behind-the-scenes content
// ---------------------------------------------------------------------------

export type Visibility = "shared" | "private";

/** Onboard: what the Profile skill extracts from Shreya's message. */
export const PROFILE: { key: string; value: string; vis: Visibility; at: number }[] = [
  { key: "interest", value: '"swimming"', vis: "shared", at: 0.26 },
  { key: "level", value: '"intermediate"', vis: "shared", at: 0.3 },
  { key: "goal", value: '"get faster"', vis: "private", at: 0.34 },
  { key: "commitment", value: '"3x/week"', vis: "shared", at: 0.38 },
  { key: "focus", value: '"intervals"', vis: "shared", at: 0.42 },
  { key: "free_windows", value: '["Mon–Fri morning"]', vis: "shared", at: 0.46 },
  { key: "exact_times", value: '"Mon/Wed/Fri 7:00am"', vis: "private", at: 0.5 },
  { key: "location_pref", value: '"SDFC pool"', vis: "shared", at: 0.54 },
  { key: "name", value: '"Shreya"', vis: "private", at: 0.58 },
  { key: "anon_id", value: '"anon_4821"', vis: "shared", at: 0.62 },
];

/** Discover: the outgoing request. */
export const REQUEST = {
  from: "anon_4821",
  fields: ["swimming", "intermediate", "weekday mornings", "SDFC", "3x/week"],
};

/** Negotiate: Shreya's agent ("us") and Mei's agent ("them"). */
export type ConstraintId = "time" | "place" | "focus" | "commitment";

export const CONSTRAINTS: {
  id: ConstraintId;
  label: string;
  conflict: string;
  resolved: string;
  /** Progress at which the chip turns green. */
  resolvedAt: number;
  /** Progress at which the conflict is first raised (chip turns red). */
  raisedAt: number;
}[] = [
  { id: "time", label: "Time", conflict: "7am vs not before 8am", resolved: "Wed 8:00am", raisedAt: 0.08, resolvedAt: 0.28 },
  { id: "place", label: "Place", conflict: "SDFC?", resolved: "SDFC pool", raisedAt: 0.34, resolvedAt: 0.42 },
  { id: "focus", label: "Focus", conflict: "intervals vs technique", resolved: "20 min drills + 25 min intervals", raisedAt: 0.5, resolvedAt: 0.72 },
  { id: "commitment", label: "Commitment", conflict: "3x vs 3x", resolved: "both regular", raisedAt: 0.78, resolvedAt: 0.86 },
];

export const NEGOTIATION: { at: number; side: "us" | "them"; text: string; constraint?: ConstraintId }[] = [
  { at: 0.06, side: "us", text: "Proposing Mon/Wed/Fri 7:00am.", constraint: "time" },
  { at: 0.14, side: "them", text: "My student can't do before 8am.", constraint: "time" },
  { at: 0.22, side: "us", text: "Wed 8:00am fits mine. Take Wed 8:00?", constraint: "time" },
  { at: 0.28, side: "them", text: "Wed 8:00am works.", constraint: "time" },
  { at: 0.34, side: "us", text: "Location: SDFC pool.", constraint: "place" },
  { at: 0.42, side: "them", text: "SDFC is our first choice too. Agreed.", constraint: "place" },
  { at: 0.5, side: "us", text: "Focus for my student is intervals.", constraint: "focus" },
  { at: 0.57, side: "them", text: "Mine wants technique work.", constraint: "focus" },
  { at: 0.64, side: "us", text: "Split it: 20 min drills, then 25 min intervals?", constraint: "focus" },
  { at: 0.72, side: "them", text: "Yes, and alternate who leads each week.", constraint: "focus" },
  { at: 0.78, side: "us", text: "Mine swims 3x/week.", constraint: "commitment" },
  { at: 0.86, side: "them", text: "Same. Both regular, it's a match. Asking our students.", constraint: "commitment" },
];

export const SHARED_VS_PRIVATE = {
  shared: ["Level: intermediate", "Rough windows: weekday mornings", "Pool: SDFC", "Focus: intervals", "3x/week"],
  private: ["Name", "Exact calendar", "Why she wants to get faster", "Mei's 1500m training plan", "Mei's lab schedule"],
};

/** Confirm: the second, smaller negotiation that escalates to Mei. */
export const ESCALATION: { at: number; side: "us" | "them"; text: string; escalate?: boolean }[] = [
  { at: 0.38, side: "us", text: "My student said yes. She'd like a second session each week." },
  { at: 0.42, side: "them", text: "I don't know my student's weekends. Asking her.", escalate: true },
  { at: 0.7, side: "them", text: "She can do Saturdays. Sat 9:00am at SDFC?" },
  { at: 0.76, side: "us", text: "Confirmed: Wed 8:00am + Sat 9:00am." },
];

/** Mei's phone in Confirm. Here Mei is "me" (blue), her agent is "them". */
export const MEI_PHONE: Beat[] = [
  {
    at: 0.5,
    from: "them",
    text: "A swimmer at your level wants to train with you: Wed 8am at SDFC, drills + intervals. They're asking about a 2nd day. Saturdays?",
  },
  { at: 0.62, from: "me", text: "Yes, Saturdays too." },
  { at: 0.68, from: "them", text: "Done. I'll lock in Wed 8am + Sat 9am." },
];

export const MEI_PHONE_IN = 0.44;

/** Connect: both consents and what unlocks. */
export const HANDSHAKE = {
  consents: [
    { who: "anon_4821", name: "Shreya", time: "9:12 PM", at: 0.04 },
    { who: "anon_7f3a", name: "Mei", time: "9:14 PM", at: 0.08 },
  ],
  unlockAt: 0.14,
  unlocked: ["First names", "Phone numbers (iMessage)", "Agreed plan: Wed 8am + Sat 9am, SDFC"],
  stillPrivate: ["Calendars", "Reasons and goals", "Other matches"],
};

export const SWIM_GROUP = {
  title: "Swim partners",
  kind: "Pair · alternating who leads",
  when: "Wed 8:00am + Sat 9:00am · SDFC pool",
  people: ["Mei"],
};
