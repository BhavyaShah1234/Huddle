import type { Level, Window } from "./huddle";

// Ten swimmer agents that answer Shreya's request in Discover.
// Mei, Jordan, Sam and Dev come from the prototype's MATCHES; the rest are seeded.
// `name` stays private to each agent until both students say yes.

export type Response = "interested" | "declined" | "asking";

export type Swimmer = {
  anonId: string;
  name: string;
  level: Level;
  /** Rough free windows the agent is willing to share. */
  windows: Window[];
  /** Sessions per week. Used as the ranking tiebreak. */
  commitment: number;
  response: Response;
  /** What the student said, when the agent had to ask. */
  askedResult?: "interested" | "declined";
  publicReason: string;
  /** Never leaves the agent. Rendered redacted. */
  privateReason: string;
};

export const SWIMMERS: Swimmer[] = [
  {
    anonId: "anon_7f3a",
    name: "Mei",
    level: "intermediate",
    windows: ["Mon-Morning", "Tue-Morning", "Wed-Morning", "Thu-Morning", "Sat-Morning"],
    commitment: 3,
    response: "interested",
    publicReason: "Wants a regular lane partner",
    privateReason: "Training for a campus 1500m; mornings before lab",
  },
  {
    anonId: "anon_2c91",
    name: "Jordan",
    level: "intermediate",
    windows: ["Mon-Morning", "Wed-Morning", "Thu-Morning", "Fri-Morning"],
    commitment: 2,
    response: "interested",
    publicReason: "Open to a partner, flexible",
    privateReason: "Only swims when a friend drags them",
  },
  {
    anonId: "anon_b4e0",
    name: "Sam",
    level: "advanced",
    windows: ["Mon-Morning", "Tue-Morning", "Wed-Morning", "Thu-Morning", "Fri-Morning"],
    commitment: 4,
    response: "interested",
    publicReason: "Happy to pace someone",
    privateReason: "Ex-club swimmer, coaching on the side",
  },
  {
    anonId: "anon_5d18",
    name: "Priya",
    level: "intermediate",
    windows: ["Tue-Morning", "Wed-Morning", "Fri-Morning", "Sun-Morning"],
    commitment: 2,
    response: "asking",
    askedResult: "interested",
    publicReason: "Checking with student",
    privateReason: "Agent unsure about her new job hours",
  },
  {
    anonId: "anon_e730",
    name: "Rhea",
    level: "beginner",
    windows: ["Mon-Morning", "Tue-Morning", "Thu-Morning", "Fri-Morning"],
    commitment: 2,
    response: "asking",
    askedResult: "interested",
    publicReason: "Checking with student",
    privateReason: "Nervous about deep end",
  },
  {
    anonId: "anon_91ab",
    name: "Omar",
    level: "intermediate",
    windows: ["Tue-Morning", "Thu-Morning", "Sat-Afternoon"],
    commitment: 1,
    response: "interested",
    publicReason: "Casual, once a week",
    privateReason: "Recovering from a shoulder strain",
  },
  {
    anonId: "anon_c62f",
    name: "Lena",
    level: "advanced",
    windows: ["Mon-Morning", "Wed-Morning", "Fri-Morning", "Sat-Morning"],
    commitment: 5,
    response: "interested",
    publicReason: "Wants fast intervals",
    privateReason: "Trying out for the club team",
  },
  {
    anonId: "anon_08d4",
    name: "Dev",
    level: "beginner",
    windows: ["Wed-Morning", "Fri-Morning", "Sun-Afternoon"],
    commitment: 2,
    response: "interested",
    publicReason: "Learning freestyle",
    privateReason: "Doctor's orders, low impact",
  },
  {
    anonId: "anon_a5c3",
    name: "Alex",
    level: "intermediate",
    windows: ["Mon-Evening", "Wed-Evening"],
    commitment: 2,
    response: "declined",
    publicReason: "Evenings only right now",
    privateReason: "Morning class all semester",
  },
  {
    anonId: "anon_3f77",
    name: "Kai",
    level: "new",
    windows: ["Sat-Morning"],
    commitment: 1,
    response: "declined",
    publicReason: "Wants lessons, not a partner",
    privateReason: "Can't swim yet, embarrassed to say",
  },
];
