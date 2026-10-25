import { CHAPTERS, THREADS, type Chapter, type Contact } from "./scenario";
import { CLUB_CHAPTERS, CLUB_CONTACTS } from "./club";

export type Audience = "student" | "club";

export const STORIES: Record<
  Audience,
  { chapters: Chapter[]; contacts: Record<string, Contact>; phoneLabel: string }
> = {
  student: { chapters: CHAPTERS, contacts: THREADS, phoneLabel: "What Shreya sees" },
  club: { chapters: CLUB_CHAPTERS, contacts: CLUB_CONTACTS, phoneLabel: "What the DevLabs officer sees" },
};
