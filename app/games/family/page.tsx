import { GameDirectory } from "@/components/game-directory";
import { gamesByDivision } from "@/data/games";

export default function FamilyGamesPage() {
  return (
    <main className="public-page arena-page" id="home">
      <div className="page-kicker">
        <span>GOAT ESPORTS / DIVISIONS</span>
        <span>03 — FAMILY &amp; COMMUNITY</span>
      </div>
      <GameDirectory division="family" entries={gamesByDivision.family} />
      <p className="page-note">
        Artwork shown is cinematic concept art, not official game assets. Community squad nights, fighting tournaments, and co-op streams are scheduled regularly.
      </p>
    </main>
  );
}
