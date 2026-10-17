import { GameDirectory } from "@/components/game-directory";
import { gamesByDivision } from "@/data/games";

export default function PcGamesPage() {
  return <main className="public-page arena-page" id="home">
    <div className="page-kicker"><span>GOAT ESPORTS / DIVISIONS</span><span>02 — PC / LAPTOP</span></div>
    <GameDirectory division="pc" entries={gamesByDivision.pc} />
    <p className="page-note">Artwork shown is cinematic concept art, not official game assets. Team details will be added as verified information becomes available.</p>
  </main>;
}
