import Link from "next/link";
import Image from "next/image";
import type { Game, GameDivision } from "@/data/games";

function GameCard({ game, featured = false }: { game: Game; featured?: boolean }) {
  return (
    <Link
      className={`arena-card${featured ? " arena-card--featured" : ""}`}
      href={`/games/${game.slug}`}
      id={`game-${game.slug}`}
    >
      <span className="arena-card__media">
        <Image
          className="arena-card__img"
          src={game.artwork}
          alt={game.artAlt}
          fill
          sizes={featured
            ? "(max-width: 620px) 100vw, (max-width: 900px) 100vw, 60vw"
            : "(max-width: 620px) 100vw, (max-width: 900px) 50vw, 30vw"}
        />
        <span className="arena-card__shade" aria-hidden="true" />
      </span>
      <span className="arena-card__content">
        <span className="arena-card__genre">{game.genre}</span>
        <span className="arena-card__title">{game.title}</span>
        <span className="arena-card__cta">
          Explore <span aria-hidden="true">↗</span>
        </span>
      </span>
    </Link>
  );
}

export function GameDirectory({ division, entries }: { division: GameDivision; entries: Game[] }) {
  if (!entries.length) return null;
  const [featured, ...rest] = entries;

  const divisionTitle = division === "mobile" ? "Mobile" : division === "pc" ? "PC" : "Family";

  return (
    <section className="arena" aria-label={`${divisionTitle} game directory`}>
      <div className="arena__header">
        <p className="arena__eyebrow">GOAT ESPORTS DIVISION</p>
        <h2 className="arena__heading">{division === "family" ? "FAMILY & COMMUNITY" : "CHOOSE YOUR ARENA"}</h2>
        <p className="arena__sub">
          {division === "family"
            ? "Party squads, tactical co-op, and fight night showdowns with the GOAT crew."
            : "Every title we compete in. One roster. One mission."}
        </p>
      </div>
      <div className={`arena__grid arena__grid--${division}`}>
        <GameCard game={featured} featured />
        {rest.map((game) => (
          <GameCard game={game} key={game.slug} />
        ))}
      </div>
    </section>
  );
}
