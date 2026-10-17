"use client";

import { useMemo, useState } from "react";
import { achievements } from "@/data/achievement-data";
import { games } from "@/data/games";
import { EmptyState } from "@/components/public-page";

export function AchievementBrowser() {
  const [gameFilter, setGameFilter] = useState("all");
  const filtered = useMemo(() => achievements.filter((item) => gameFilter === "all" || item.gameSlug === gameFilter), [gameFilter]);

  return <>
    <div className="achievement-filter">
      <label htmlFor="achievement-game">FILTER BY GAME</label>
      <select id="achievement-game" value={gameFilter} onChange={(event) => setGameFilter(event.target.value)}>
        <option value="all">ALL GAMES</option>
        {games.map((game) => <option value={game.slug} key={game.slug}>{game.title}</option>)}
      </select>
    </div>
    {filtered.length ? <div className="achievement-list">
      {filtered.map((item) => <article className="achievement-row" key={`${item.gameSlug}-${item.tournament}-${item.date}`}>
        <span>{item.date}</span><strong>{item.tournament}</strong><span>{item.placement}</span><span>{games.find((game) => game.slug === item.gameSlug)?.title ?? item.gameSlug}</span>
      </article>)}
    </div> : <EmptyState label="VERIFIED RECORDS / TBA">No tournament placements have been published. Verified results will be added here.</EmptyState>}
  </>;
}
