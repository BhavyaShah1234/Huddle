// Ported from the Huddle prototype (BhavyaShah1234/Huddle, branch
// feature/1stprototype-frontend, frontend/src/data.js). Only the student-side
// data is used. Swimming is updated to match the demo story (intermediate).

export const ME = { name: "Shreya", ini: "SH", sub: "CS junior" };

export const LEVELS = ["new", "beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const SLOTS = ["Morning", "Afternoon", "Evening"] as const;
export type Day = (typeof DAYS)[number];
export type Slot = (typeof SLOTS)[number];
export type Window = `${Day}-${Slot}`;

// data.js FREE, plus the weekday mornings Shreya mentions in Onboard.
export const FREE: Window[] = [
  "Mon-Morning",
  "Tue-Morning",
  "Wed-Morning",
  "Thu-Morning",
  "Fri-Morning",
  "Tue-Evening",
  "Thu-Evening",
  "Sat-Afternoon",
  "Sun-Afternoon",
];

export const FIRST_MESSAGE =
  "Hi Shreya! Tell me something you'd like to do, like garba, pickleball or a CSE 340 study group. I'll find people at your level who are free when you are.";

export type Interest = {
  name: string;
  level: Level;
  total: number;
  atLevel: number;
  levels: [Level, number][];
};

export const SWIMMING: Interest = {
  name: "Swimming",
  level: "intermediate",
  total: 10,
  atLevel: 6,
  levels: [
    ["new", 1],
    ["beginner", 2],
    ["intermediate", 5],
    ["advanced", 2],
  ],
};

export const INTEREST_COUNT = 5; // Bharatanatyam, DSA, Swimming, Garba, Pottery

export const POD = {
  title: "Bharatanatyam practice",
  kind: "Pod",
  when: "Sundays 4:00–4:45pm · practice room",
  people: ["Ananya", "Diya"],
};

export const WORKSHOP = {
  id: "bharatanatyam",
  name: "Bharatanatyam Workshop",
  host: "Indian Students Association",
  days: 5,
  time: "4pm – 6pm",
  place: "Student Pavilion, Dance Studio B",
  tracks: "Advanced adavus + abhinaya · live mridangam",
  fits: ["Bharatanatyam"],
  going: 9,
  big: ["Bharata", "natyam"],
  glyph: "✦ nritta · abhinaya · tala",
  theme: { bg: "#2b1022", coral: "#ffb347", amber: "#ff7a8a", dim: "#d3a9bd" },
};

export const PRIVACY =
  "Your agent shares only the activity, your level and rough free times, under an anonymous ID. Your name goes to a group only after you say yes. Your calendar, inbox and reasons never leave your agent.";
