// The club side of the demo: a DevLabs officer and the club's Huddle agent.
// Data is ported from the Huddle prototype's Club tab (frontend/src/data.js:
// CLUB, K_MIN, CLUB_DEMAND, HEAT, DAYS, BLOCKS, AGENT_TALK). Same timing model
// as scenario.ts: every `at` is a point in the chapter's scroll progress.

import type { Beat, Chapter, Contact } from "./scenario";

export const CLUB = { name: "DevLabs", ini: "DL", cats: ["Coding", "Tech careers"] };
export const COHOST = "Women in Tech";

/** Groups smaller than this are never shown to clubs. */
export const K_MIN = 5;

export type Demand = {
  name: string;
  cat: string;
  count: number;
  mix?: string;
  best?: string;
};

export const CLUB_DEMAND: Demand[] = [
  { name: "DSA / LeetCode night", cat: "Coding", count: 14, mix: "3 beginner · 6 intermediate · 5 advanced", best: "Thu 5–9pm" },
  { name: "Hackathon prep", cat: "Coding", count: 11, mix: "mixed levels", best: "Sun 1–5pm" },
  { name: "Web dev with React", cat: "Coding", count: 8, mix: "mostly beginner", best: "Wed 5–9pm" },
  { name: "AI / ML study group", cat: "Coding", count: 7, mix: "mostly intermediate", best: "Tue 5–9pm" },
  { name: "Resume + interview prep", cat: "Tech careers", count: 6, mix: "mixed levels", best: "Mon 5–9pm" },
  { name: "Rust", cat: "Coding", count: 3 },
];

export const VISIBLE_DEMAND = CLUB_DEMAND.filter((d) => d.count >= K_MIN);
export const DEMAND_TOTAL = VISIBLE_DEMAND.reduce((s, d) => s + d.count, 0);

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const BLOCKS = ["7–10am", "10am–1pm", "1–5pm", "5–9pm", "9pm+"];
/** Anonymous counts of Coding / Tech careers students free in each block (rows = BLOCKS). */
export const HEAT = [
  [6, 3, 7, 4, 2, 1, 1],
  [2, 2, 3, 2, 4, 8, 6],
  [4, 6, 4, 7, 9, 15, 19],
  [13, 12, 15, 24, 11, 10, 14],
  [6, 5, 7, 8, 14, 12, 4],
];

/** The pool: what individual student agents contribute. Only these fields; no IDs are kept. */
export const POOL_SAMPLES = [
  "DSA · intermediate · Thu eve",
  "DSA · advanced · Thu eve",
  "Hackathon · beginner · Sun aft",
  "React · beginner · Wed eve",
  "DSA · beginner · Tue eve",
  "AI/ML · intermediate · Tue eve",
  "DSA · intermediate · Mon eve",
  "Resume · mixed · Mon eve",
];

export const CLUB_CONTACTS: Record<string, Contact> = {
  agent: { name: "DevLabs agent", ini: "DL", color: "#b4603a" },
};

export const CLUB_CHAPTERS: Chapter[] = [
  {
    id: "club-demand",
    label: "Spot demand",
    caption: "The officer asks what students want. Counts only, never names.",
    length: 260,
    stamp: "Tue 10:05 AM",
    beats: [
      { at: 0.12, from: "me", text: "What do students want right now?" },
      {
        at: 0.36,
        from: "them",
        text: `${DEMAND_TOTAL} students want things you run. Top three:\n• DSA / LeetCode night: 14\n• Hackathon prep: 11\n• Web dev with React: 8`,
      },
      {
        at: 0.62,
        from: "them",
        text: `You only see counts, never names. Anything under ${K_MIN} students stays hidden.`,
      },
    ],
  },
  {
    id: "club-plan",
    label: "Plan",
    caption: "Its agent finds a time and negotiates a co-host with another club.",
    length: 300,
    stamp: "Tue 10:07 AM",
    beats: [
      { at: 0.08, from: "me", text: "Let's do DSA night. When can they come?" },
      { at: 0.22, from: "them", text: "Thursday 5–9pm. 24 of them are free then." },
      {
        at: 0.34,
        from: "them",
        text: `${COHOST}'s agent wants to run one too. Co-host and split the food?`,
      },
      { at: 0.46, from: "me", text: "Yes. Our budget is $300." },
      {
        at: 0.88,
        from: "them",
        text: `Done: Thu 7–9pm, co-hosted with ${COHOST}. Food split $100 / $80, and they run the beginner track.`,
      },
    ],
  },
  {
    id: "club-invite",
    label: "Invite",
    caption: "The request goes to each student's agent. Students decide; the club waits.",
    length: 320,
    stamp: "Tue 10:12 AM",
    beats: [
      { at: 0.08, from: "me", text: "Send it." },
      {
        at: 0.2,
        from: "them",
        text: "Invite sent to 14 students' agents. Names show up only when someone says yes.",
      },
      { at: 0.88, from: "them", text: "9 yes so far. I'll keep you posted." },
    ],
  },
  {
    id: "club-live",
    label: "Event live",
    caption: "Only students who said yes are revealed. The rest stay anonymous.",
    length: 260,
    stamp: "Thu 9:00 AM",
    beats: [
      { at: 0.1, from: "me", text: "How's DSA night looking?" },
      {
        at: 0.34,
        from: "them",
        text: "12 of 14 said yes. Their first names are in the event channel.",
      },
      { at: 0.52, from: "them", text: "2 passed. Nobody was told who, including you." },
      { at: 0.7, from: "them", text: "Want me to post the room and the beginner track info?" },
      { at: 0.84, from: "me", text: "Yes, post it." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Behind-the-scenes content
// ---------------------------------------------------------------------------

/** Plan: club agent ↔ club agent (prototype's AGENT_TALK). */
export const CLUB_TALK: { at: number; side: "us" | "them"; who: string; text: string }[] = [
  { at: 0.52, side: "us", who: "DevLabs agent", text: "Can host Thu 7–9pm. $300. Need a co-host for food." },
  { at: 0.6, side: "them", who: "Women in Tech agent", text: "Can co-host Thu. $150, 2 officers." },
  { at: 0.67, side: "us", who: "DevLabs agent", text: "Pizza $180, split $120 / $60?" },
  { at: 0.74, side: "them", who: "Women in Tech agent", text: "$100 / $80, and we run the beginner track." },
  { at: 0.81, side: "us", who: "DevLabs agent", text: "Accepted. Confirming with my officer." },
];

export const CLUB_CHIPS = [
  { id: "time", label: "Time", conflict: "Thu, which hours?", resolved: "Thu 7–9pm", raisedAt: 0.5, resolvedAt: 0.6 },
  { id: "cost", label: "Food cost", conflict: "$120 / $60?", resolved: "$100 / $80", raisedAt: 0.67, resolvedAt: 0.74 },
  { id: "roles", label: "Roles", conflict: "who runs beginners?", resolved: "WiT: beginner track", raisedAt: 0.7, resolvedAt: 0.81 },
];

export const EVENT = {
  title: "DSA night",
  when: "Thu 7–9pm",
  detail: `Co-hosted with ${COHOST}, who run the beginner track`,
  track: "beginner–intermediate track",
  invited: 14,
};

/**
 * The 14 interested students, one agent each. Answers play on a two-chapter
 * timeline: t = progress in Invite (0–1), then 1 + progress in Event live.
 * `name` is only ever shown for students who said yes.
 */
export type Invitee = {
  anonId: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  answer: "yes" | "pass";
  answerT: number;
  /** What the student's agent checked privately before asking. */
  privateCheck: string;
  time?: string;
};

export const INVITEES: Invitee[] = [
  { anonId: "anon_4821", name: "Shreya", level: "intermediate", answer: "yes", answerT: 0.66, privateCheck: "Thu eve free, level fits", time: "10:19 AM" },
  { anonId: "anon_1a7c", name: "Rohan", level: "advanced", answer: "yes", answerT: 0.46, privateCheck: "Free after 6pm", time: "10:14 AM" },
  { anonId: "anon_9e02", name: "Alex", level: "advanced", answer: "yes", answerT: 0.5, privateCheck: "Wants interview prep", time: "10:15 AM" },
  { anonId: "anon_33bd", name: "Kim", level: "advanced", answer: "yes", answerT: 0.54, privateCheck: "Already in DevLabs", time: "10:16 AM" },
  { anonId: "anon_c410", name: "Jordan", level: "intermediate", answer: "yes", answerT: 0.58, privateCheck: "Thu lab ends 6:30", time: "10:17 AM" },
  { anonId: "anon_77f1", name: "Tanvi", level: "intermediate", answer: "yes", answerT: 0.62, privateCheck: "Prefers co-ed group", time: "10:18 AM" },
  { anonId: "anon_5be9", name: "Aisha", level: "beginner", answer: "yes", answerT: 0.7, privateCheck: "First club event", time: "10:21 AM" },
  { anonId: "anon_e2a6", name: "Ethan", level: "intermediate", answer: "pass", answerT: 0.74, privateCheck: "Thu is shift night" },
  { anonId: "anon_08cc", name: "Ben", level: "beginner", answer: "yes", answerT: 0.78, privateCheck: "Needs beginner track", time: "10:24 AM" },
  { anonId: "anon_6d3f", name: "Grace", level: "advanced", answer: "yes", answerT: 0.82, privateCheck: "Mentoring hours", time: "10:26 AM" },
  { anonId: "anon_b915", name: "Divya", level: "intermediate", answer: "yes", answerT: 1.1, privateCheck: "Checked with roommate", time: "Wed 8:02 PM" },
  { anonId: "anon_2f84", name: "Carlos", level: "beginner", answer: "yes", answerT: 1.16, privateCheck: "Bus home at 9:30", time: "Wed 9:40 PM" },
  { anonId: "anon_d07e", name: "Hiro", level: "advanced", answer: "pass", answerT: 1.2, privateCheck: "Exam Friday" },
  { anonId: "anon_4c59", name: "Fatima", level: "intermediate", answer: "yes", answerT: 1.24, privateCheck: "Wanted a study buddy", time: "Thu 8:31 AM" },
];

/** Invite: per-agent stages before the answer. */
export const INVITE_DELIVERED_AT = 0.22;
export const INVITE_CHECK_AT = 0.28;
export const INVITE_ASK_AT = 0.36;

/** Invite: Shreya's phone, showing one of those 14 agents asking its student. */
export const STUDENT_INVITE_PHONE: Beat[] = [
  {
    at: 0.5,
    from: "them",
    text: `${CLUB.name} + ${COHOST} are hosting DSA night, Thu 7pm, beginner–intermediate track. It fits your level and your Thursday evening. Want in?`,
  },
  { at: 0.64, from: "me", text: "Yes!" },
  { at: 0.72, from: "them", text: "You're in. Your first name goes to the organizers now." },
];
export const STUDENT_PHONE_IN = 0.42;

export const CLUB_HERO = {
  eyebrow: "Club view · agent-to-agent coordination",
  title: "See what students want. Never who, until they say yes.",
  intro:
    "Club officers get an agent in iMessage too. It reads an anonymous pool of what students' agents share, helps plan an event, and sends the invite back through each student's own agent. Names only arrive for students who say yes.",
  hint: "Scroll to follow a DevLabs officer planning DSA night.",
};
