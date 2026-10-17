import { GameDirectory } from "@/components/game-directory";
import { gamesByDivision } from "@/data/games";

export default function MobileGamesPage() {
  return <main className="public-page arena-page" id="home">
    <div className="page-kicker"><span>GOAT ESPORTS / DIVISIONS</span><span>01 — MOBILE</span></div>
    <GameDirectory division="mobile" entries={gamesByDivision.mobile} />
    <p className="page-note">Artwork shown is cinematic concept art, not official game assets. Team details will be added as verified information becomes available.</p>
  </main>;
}
