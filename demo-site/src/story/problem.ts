// The problem story shown above the hero on the Student tab.
// `at` is the point in the section's scroll progress (0 → 1) where a beat takes over.

export const PROBLEM_LENGTH = 280; // vh

export type ProblemBeat = { at: number; text: string; sub?: string };

export const PROBLEM_BEATS: ProblemBeat[] = [
  { at: 0, text: "Shreya swims 3x a week and wants to get faster." },
  {
    at: 0.2,
    text: "ASU has a swim club. Semester dues, the wrong pace, and it meets when she's in class.",
  },
  { at: 0.4, text: "So she stops going. So does everyone else at her level." },
  {
    at: 0.6,
    text: "They're on campus. They'll just never meet.",
    sub: "No club at all? Ironman, Bharatanatyam, pottery: even worse.",
  },
  { at: 0.85, text: "Huddle's agents find them." },
];

export const PROBLEM_VISUAL = {
  student: "Shreya",
  club: "Swim Club",
  mismatches: ["semester dues", "beginner pace", "Tue/Thu 4pm"],
};
