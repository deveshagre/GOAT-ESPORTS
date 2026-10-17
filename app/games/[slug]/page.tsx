import { notFound } from "next/navigation";
import Image from "next/image";
import { BackLink } from "@/components/public-page";
import { games, getGame, getGameProfile } from "@/data/games";
import { achievements } from "@/data/achievement-data";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="detail-data-row"><span>{label}</span><div>{children}</div></div>;
}

function Members({ players }: { players: { id: string; name: string; role: string }[] }) {
  return players.length ? <ul className="detail-member-list">{players.map((player) => <li key={player.id}><strong>{player.name}</strong><span>{player.role}</span></li>)}</ul> : <em>NOT ANNOUNCED</em>;
}

export default async function GameDetailPage({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const profile = getGameProfile(slug);
  const gameAchievements = achievements.filter((achievement) => achievement.gameSlug === slug);

  return <main className="public-page game-detail-page" id="home">
    <div className="page-kicker"><span>{game.platformLabel}</span><span>GAME PROFILE / {game.number}</span></div>
    <div className={`game-detail-hero game-directory-${game.division}`}>
      <div><p className="eyebrow">GOAT ESPORTS / GAME DIRECTORY</p><h1>{game.title}</h1><p>Roster, captain, team setup, and match records are shown here when officially confirmed.</p></div>
      <div className="game-detail-art" aria-label={`${game.title} artwork`}>
        <Image src={game.artwork} alt={game.artAlt} fill sizes="(max-width: 620px) 90vw, 30vw" />
      </div>
    </div>
    <div className="game-detail-grid">
      <section className="game-record-section"><div className="game-record-heading"><p className="eyebrow">ROSTER</p><h2>LINEUP &amp; SQUAD</h2></div><div className="detail-data-list">
        <DetailRow label="CAPTAIN"><Members players={profile.captain ? [profile.captain] : []} /></DetailRow>
        <DetailRow label="STARTING LINEUP"><Members players={profile.startingLineup} /></DetailRow>
        <DetailRow label="SUBSTITUTES"><Members players={profile.substitutes} /></DetailRow>
        <DetailRow label="PAST PLAYERS"><Members players={profile.pastPlayers} /></DetailRow>
      </div></section>
      <section className="game-record-section"><div className="game-record-heading"><p className="eyebrow">TEAM NOTES</p><h2>{profile.setupTitle}</h2></div><div className="detail-data-list">
        <DetailRow label="SETUP / STRATEGY">{profile.setupNotes.length ? <ul className="detail-note-list">{profile.setupNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <em>NOT ANNOUNCED</em>}</DetailRow>
        <DetailRow label="ANNOUNCEMENTS">{profile.announcements.length ? <ul className="detail-note-list">{profile.announcements.map((item) => <li key={item}>{item}</li>)}</ul> : <em>NONE PUBLISHED</em>}</DetailRow>
      </div></section>
      <section className="game-record-section"><div className="game-record-heading"><p className="eyebrow">VERIFIED COMPETITION RECORD</p><h2>RESULTS &amp; FIXTURES</h2></div><div className="detail-data-list">
        <DetailRow label="TOURNAMENT HISTORY">{gameAchievements.length ? <ul className="detail-note-list">{gameAchievements.map((item) => <li key={`${item.tournament}-${item.date}`}><strong>{item.tournament}</strong><span>{item.placement} / {item.date}</span></li>)}</ul> : <em>NO VERIFIED PLACEMENTS</em>}</DetailRow>
        <DetailRow label="FIXTURES &amp; RESULTS">{profile.fixtures.length ? <ul className="detail-note-list">{profile.fixtures.map((item) => <li key={`${item.date}-${item.opponent}`}><strong>GOAT vs {item.opponent}</strong><span>{item.event} / {item.date} / {item.score ?? item.status}</span></li>)}</ul> : <em>NO FIXTURES PUBLISHED</em>}</DetailRow>
      </div></section>
    </div>
    <BackLink href={`/games/${game.division}`}>
      BACK TO {game.division === "mobile" ? "MOBILE" : game.division === "pc" ? "PC / LAPTOP" : "FAMILY"} GAMES
    </BackLink>
  </main>;
}
