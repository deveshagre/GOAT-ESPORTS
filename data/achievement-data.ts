export type Achievement = {
  gameSlug: string;
  tournament: string;
  placement: string;
  date: string;
  image?: string;
};

// Add only verified placements and tournament history here.
export const achievements: Achievement[] = [];

