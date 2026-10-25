// Example data for the Track 2 prototype.

export const DISCORD = "https://discord.com/channels/@me";

export const ME = { name: "Shreya", ini: "SH", sub: "CS junior" };

export const INTERESTS = [
  { name: "Bharatanatyam", level: "advanced", total: 12, atLevel: 3, levels: [["beginner", 9], ["advanced", 3]],
    state: "group", group: { title: "Bharatanatyam practice", kind: "Pod", when: "Sundays 4:00–4:45pm · practice room", people: ["Ananya", "Diya"], channel: "Open pod chat" } },
  { name: "DSA / LeetCode", level: "intermediate", total: 14, atLevel: 6, levels: [["beginner", 3], ["intermediate", 6], ["advanced", 5]],
    state: "group", group: { title: "DSA night", kind: "Club event · DevLabs + Women in Tech", when: "Thu 7pm · beginner–intermediate track", people: null, going: 12, channel: "Open event channel" } },
  { name: "Swimming", level: "new", total: 5, atLevel: 3, levels: [["new", 3], ["intermediate", 2]],
    state: "invite", invite: { title: "Learn to swim", when: "Wed 7:00–7:45am · open swim, shallow end", who: "2 other beginners + a volunteer coach" } },
  { name: "Garba", level: "beginner", total: 18, atLevel: 11, levels: [["beginner", 11], ["intermediate", 5], ["advanced", 2]],
    state: "search", search: "Enough interest for a club event. Waiting for a dance or culture club to host it." },
  { name: "Pottery", level: "new", total: 1, atLevel: 1, levels: [["new", 1]],
    state: "search", search: "You're the first one. Your agent will ping you when someone else wants this." },
];

// Match % = 60% schedule overlap + 40% level fit. [name, schedule %, level %, name revealed?]
export const MATCHES = {
  "Bharatanatyam": [["Ananya", 94, 100, true], ["Diya", 81, 100, true], ["Kavya", 90, 20, false], ["Meera", 72, 20, false], ["Tara", 66, 20, false]],
  "DSA / LeetCode": [["Rohan", 92, 100, false], ["Alex", 88, 100, false], ["Kim", 75, 100, false], ["Jordan", 95, 60, false], ["Tanvi", 80, 60, false]],
  "Swimming": [["Mei", 95, 100, false], ["Jordan", 90, 100, false], ["Sam", 85, 60, false], ["Dev", 40, 60, false]],
  "Garba": [["Isha", 88, 100, false], ["Neel", 84, 100, false], ["Riya", 91, 60, false], ["Zoe", 70, 100, false], ["Aman", 65, 60, false]],
};
export const score = (m) => Math.round(0.6 * m[1] + 0.4 * m[2]);

// Upcoming club events that fit Shreya's interests. `theme` overrides the poster colors.
export const EVENTS = [
  { id: "devhacks", name: "DevHacks", host: "DevLabs + Women in Tech", days: 2, time: "6pm – midnight", place: "Engineering Center, Room 210",
    tracks: "Beginner and advanced tracks · free food", fits: ["DSA / LeetCode", "Hackathon prep"], going: 38,
    big: ["Dev", "Hacks"], glyph: "</> build · ship · eat" },
  { id: "bharatanatyam", name: "Bharatanatyam Workshop", host: "Indian Students Association", days: 5, time: "4pm – 6pm", place: "Student Pavilion, Dance Studio B",
    tracks: "Advanced adavus + abhinaya · live mridangam", fits: ["Bharatanatyam"], going: 9,
    big: ["Bharata", "natyam"], stacked: true, glyph: "✦ nritta · abhinaya · tala",
    theme: { "--pz-bg": "#2b1022", "--pz-coral": "#ffb347", "--pz-amber": "#ff7a8a", "--pz-dim": "#d3a9bd" } },
];

export const LEVELS = ["new", "beginner", "intermediate", "advanced"];
export const SLOTS = ["Morning", "Afternoon", "Evening"];
export const FREE = { "Thu-Evening": true, "Sun-Afternoon": true, "Sat-Afternoon": true, "Tue-Evening": true, "Wed-Morning": true };
export const FIRST_MESSAGE = { who: "in", text: "Hi Shreya! Tell me something you'd like to do, like garba, pickleball or a CSE 340 study group. I'll find people at your level who are free when you are." };

export const CLUB = { name: "DevLabs", ini: "DL", cats: ["Coding", "Tech careers"] };
export const K_MIN = 5;
export const CLUB_DEMAND = [
  { name: "DSA / LeetCode night", cat: "Coding", count: 14, mix: "3 beginner · 6 intermediate · 5 advanced", best: "Thu 5–9pm", state: "live", event: "DSA night · Thu 7pm" },
  { name: "Hackathon prep", cat: "Coding", count: 11, mix: "mixed levels", best: "Sun 1–5pm", state: "pending", queueId: "q2" },
  { name: "Web dev with React", cat: "Coding", count: 8, mix: "mostly beginner", best: "Wed 5–9pm", state: "open" },
  { name: "AI / ML study group", cat: "Coding", count: 7, mix: "mostly intermediate", best: "Tue 5–9pm", state: "open" },
  { name: "Resume + interview prep", cat: "Tech careers", count: 6, mix: "mixed levels", best: "Mon 5–9pm", state: "open" },
  { name: "Rust", cat: "Coding", count: 3, state: "hidden" },
];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const BLOCKS = ["7–10am", "10am–1pm", "1–5pm", "5–9pm", "9pm+"];
export const HEAT = [
  [6, 3, 7, 4, 2, 1, 1],
  [2, 2, 3, 2, 4, 8, 6],
  [4, 6, 4, 7, 9, 15, 19],
  [13, 12, 15, 24, 11, 10, 14],
  [6, 5, 7, 8, 14, 12, 4],
];
export const AGENT_TALK = [
  ["us", "DevLabs agent", "Can host Thu 7–9pm. $300. Need a co-host for food."],
  ["them", "Women in Tech agent", "Can co-host Thu. $150, 2 officers."],
  ["us", "DevLabs agent", "Pizza $180, split $120 / $60?"],
  ["them", "Women in Tech agent", "$100 / $80, and we run the beginner track."],
  ["us", "DevLabs agent", "Accepted. You approved it on Oct 22."],
];

export const QUEUE = [
  { id: "q1", kind: "club", title: "Bollywood Movie Club", detail: "Grew from a pod that met 3 times · 7 members · Film & culture", decided: null },
  { id: "q2", kind: "event", title: "Hackathon prep workshop", detail: "DevLabs · Sat 2pm · 11 students interested · Coding", decided: null },
  { id: "q3", kind: "event", title: "Garba night", detail: "Indian Students Association · Sat 7pm · 18 students interested · Dance & culture", decided: null },
  { id: "q4", kind: "club", title: "Pickleball Beginners", detail: "Grew from 2 pods · 6 members · Sports", decided: null },
];
export const CLUB_CATS = [
  ["DevLabs", "Coding, Tech careers"],
  ["Women in Tech", "Coding, Tech careers"],
  ["Indian Students Association", "Dance & culture, Film & culture"],
  ["Swim Club", "Sports"],
];
export const RECENT = [
  ["DSA night", "DevLabs + Women in Tech · Thu 7pm", "Approved Oct 22"],
  ["Women in Tech", "Added category: Tech careers", "Approved Oct 20"],
];
