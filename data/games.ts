export type GameDivision = "mobile" | "pc" | "family";

export type Game = {
  slug: string;
  title: string;
  division: GameDivision;
  platformLabel: string;
  number: string;
  artwork: string;
  artAlt: string;
  genre: string;
};

export type TeamMember = { id: string; name: string; role: string; gameSlug: string };
export type GameMatch = { opponent: string; event: string; date: string; status: "upcoming" | "result"; score?: string };
export type GameProfile = {
  gameSlug: string;
  captain?: TeamMember;
  startingLineup: TeamMember[];
  substitutes: TeamMember[];
  pastPlayers: TeamMember[];
  setupTitle: string;
  setupNotes: string[];
  fixtures: GameMatch[];
  announcements: string[];
};

export const games: Game[] = [
  // Mobile Division
  { slug: "bgmi", title: "BGMI", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "01", artwork: "/images/games/bgmi.jpg", artAlt: "Cinematic illustration of tactical operators parachuting into a war-torn urban battlefield at dusk", genre: "BATTLE ROYALE" },
  { slug: "free-fire", title: "Free Fire", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "02", artwork: "/images/games/free-fire.jpg", artAlt: "A lone warrior standing atop rubble overlooking a burning tropical island at sunset", genre: "BATTLE ROYALE" },
  { slug: "pokemon-unite", title: "Pokémon UNITE", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "03", artwork: "/images/games/pokemon-unite.jpg", artAlt: "Mystical creatures clashing in an energy-charged competitive arena", genre: "MOBA" },
  { slug: "call-of-duty-mobile", title: "Call of Duty: Mobile", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "04", artwork: "/images/games/call-of-duty-mobile.jpg", artAlt: "Special forces operator rappelling from a helicopter into a nighttime urban combat zone", genre: "TACTICAL SHOOTER" },
  { slug: "clash-of-clans", title: "Clash of Clans", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "05", artwork: "/images/games/clash-of-clans.jpg", artAlt: "Epic medieval siege scene with armies clashing at a burning fortress", genre: "STRATEGY" },
  { slug: "fc-mobile", title: "EA SPORTS FC Mobile", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "06", artwork: "/images/games/fc-mobile.jpg", artAlt: "Footballer striking a ball in a packed stadium under dramatic floodlights", genre: "SPORTS" },
  { slug: "efootball", title: "eFootball", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "07", artwork: "/images/games/efootball.jpg", artAlt: "Player celebrating a goal on a football pitch surrounded by fireworks and confetti", genre: "SPORTS" },
  { slug: "farlight-84", title: "Farlight 84", division: "mobile", platformLabel: "MOBILE ESPORTS", number: "08", artwork: "/images/games/farlight-84.jpg", artAlt: "Cinematic illustration of jetpack-equipped heroes fighting in an apocalyptic neo-sci-fi battleground", genre: "HERO BATTLE ROYALE" },

  // PC / Laptop Division
  { slug: "valorant", title: "VALORANT", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "01", artwork: "/images/games/valorant.jpg", artAlt: "Futuristic agent in a neon-lit corridor wielding glowing energy abilities", genre: "TACTICAL SHOOTER" },
  { slug: "dota-2-underdogs", title: "Dota 2: Underdogs", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "02", artwork: "/images/games/dota-2-underdogs.jpg", artAlt: "Fantasy titans clashing across a river between two ancient fortresses with magical energy", genre: "MOBA" },
  { slug: "marvel-rivals", title: "Marvel Rivals", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "03", artwork: "/images/games/marvel-rivals.jpg", artAlt: "Superheroes clashing in a destroyed cityscape with energy blasts illuminating the night", genre: "HERO SHOOTER" },
  { slug: "fortnite", title: "Fortnite", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "04", artwork: "/images/games/fortnite.jpg", artAlt: "A figure standing atop a massive build structure as a purple storm closes in", genre: "BATTLE ROYALE" },
  { slug: "counter-strike-2", title: "Counter-Strike 2", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "05", artwork: "/images/games/counter-strike-2.jpg", artAlt: "Counter-terrorist operator holding a rifle in a dust-filled alley with golden light rays", genre: "TACTICAL SHOOTER" },
  { slug: "rocket-league", title: "Rocket League", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "06", artwork: "/images/games/rocket-league.jpg", artAlt: "A rocket-powered car mid-aerial striking a glowing ball in a futuristic arena", genre: "VEHICULAR SPORTS" },
  { slug: "farlight-84-pc", title: "Farlight 84", division: "pc", platformLabel: "PC / LAPTOP ESPORTS", number: "07", artwork: "/images/games/farlight-84.jpg", artAlt: "Cinematic illustration of jetpack-equipped heroes fighting in an apocalyptic neo-sci-fi battleground", genre: "HERO BATTLE ROYALE" },

  // Family Division
  { slug: "repo", title: "REPO", division: "family", platformLabel: "FAMILY COMMUNITY", number: "01", artwork: "/images/games/repo.jpg", artAlt: "Cinematic sci-fi illustration of corporate salvage crew extracting alien artefacts in high-hazard darkness", genre: "TACTICAL EXTRACTION" },
  { slug: "phasmophobia", title: "PHASMOPHOBIA", division: "family", platformLabel: "FAMILY COMMUNITY", number: "02", artwork: "/images/games/phasmophobia.jpg", artAlt: "Cinematic eerie investigation inside a haunted corridor illuminated by EMF meters and UV glow", genre: "CO-OP HORROR" },
  { slug: "among-us", title: "AMONG US", division: "family", platformLabel: "FAMILY COMMUNITY", number: "03", artwork: "/images/games/among-us.jpg", artAlt: "Cinematic space station scene of neon-suited crewmates confronting a suspicious shadow in deep space", genre: "SOCIAL DEDUCTION" },
  { slug: "tekken-8", title: "TAKKEN 8", division: "family", platformLabel: "FAMILY COMMUNITY", number: "04", artwork: "/images/games/tekken-8.jpg", artAlt: "Cinematic martial arts titans clashing with lightning-infused fists in a stormy ruined arena", genre: "FIGHTING" },
];

export const gamesByDivision = {
  mobile: games.filter((game) => game.division === "mobile"),
  pc: games.filter((game) => game.division === "pc"),
  family: games.filter((game) => game.division === "family"),
};

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}

export function getGameProfile(slug: string): GameProfile {
  return gameProfiles[slug] ?? {
    gameSlug: slug,
    startingLineup: [],
    substitutes: [],
    pastPlayers: [],
    setupTitle: "Team setup",
    setupNotes: [],
    fixtures: [],
    announcements: [],
  };
}

// Profiles are intentionally empty until lineups and match data are confirmed.
export const gameProfiles: Record<string, GameProfile> = Object.fromEntries(games.map((game) => [game.slug, {
  gameSlug: game.slug,
  startingLineup: [],
  substitutes: [],
  pastPlayers: [],
  setupTitle: "Team setup / strategy",
  setupNotes: [],
  fixtures: [],
  announcements: [],
}])) as Record<string, GameProfile>;
