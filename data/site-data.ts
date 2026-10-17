export type RosterSlot = {
  number: string;
  role: string;
  status: "open" | "announced";
};

export type Match = {
  opponent: string;
  event: string;
  date: string;
  status: "upcoming" | "result";
  score?: string;
};

export type NewsStory = {
  category: string;
  title: string;
  summary: string;
  date: string;
  imageTone: "red" | "steel" | "grain";
};

// These fields intentionally stay empty until GOAT's roster and fixtures are confirmed.
export const roster: RosterSlot[] = [];

export const matches: Match[] = [];

export const news: NewsStory[] = [];

export const achievements = [
  { value: "—", label: "TITLES" },
  { value: "—", label: "FINALS" },
  { value: "—", label: "YEARS IN THE GAME" },
];
