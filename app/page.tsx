import { achievements, matches, news, roster } from "@/data/site-data";
import { SectionHeading } from "@/components/section-heading";
import Image from "next/image";
import Link from "next/link";
import { gamesByDivision } from "@/data/games";
import { organizationContact } from "@/data/organization";
import { HeroGlassMotion } from "@/components/interaction-effects";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

function RosterSection() {
  return (
    <section className="section roster-section" id="roster" aria-labelledby="roster-title">
      <div className="section-topline"><span>01 / THE PEOPLE</span><span>COMPETITIVE DIVISION</span></div>
      <SectionHeading eyebrow="THE LINEUP" title="THE ROSTER" id="roster-title" action={<span className="section-side-note">ANNOUNCEMENTS / TBA</span>} />
      {roster.length ? <div className="roster-grid">
        {roster.map((player) => (
          <article className="roster-slot" key={player.number}>
            <div className="slot-photo" aria-label={`Roster position ${player.number} awaiting announcement`}>
              <span className="slot-number">{player.number}</span>
              <span className="slot-mark" aria-hidden="true">G</span>
              <span className="slot-caption">PLAYER ANNOUNCEMENT<br />COMING SOON</span>
            </div>
            <div className="slot-meta"><span>{player.role}</span><span>—</span></div>
          </article>
        ))}
      </div> : <div className="home-empty-state"><span>ROSTER / TBA</span><p>Player names, roles, and lineups will be published here after official announcements.</p></div>}
    </section>
  );
}

function MatchCenter() {
  return (
    <section className="match-section" id="matches" aria-labelledby="matches-title">
      <div className="match-inner">
        <div className="section-topline"><span>02 / ON THE SERVER</span><span>FIXTURES / TBA</span></div>
        <SectionHeading eyebrow="THE MATCH CENTER" title="ALL BUSINESS." id="matches-title" action={<span className="section-side-note">EVERY ROUND COUNTS</span>} />
        {matches.length ? (
          <div className="match-list">
            {matches.map((match) => <article className="match-row" key={`${match.date}-${match.opponent}`}>
              <span className="match-date">{match.date}</span><span className="match-event">{match.event}</span>
              <strong>GOAT <span className="match-vs">VS</span> {match.opponent}</strong>
              <span className={`match-status ${match.status}`}>{match.score ?? "UPCOMING"}</span>
            </article>)}
          </div>
        ) : (
          <div className="match-empty">
            <span className="empty-icon" aria-hidden="true">✳</span>
            <div><p className="empty-title">THE NEXT MATCH IS TAKING SHAPE.</p><p>Official fixtures and results will appear here as soon as they’re announced.</p></div>
            <span className="empty-label">SCHEDULE<br />TBA</span>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsSection() {
  return (
    <section className="section news-section" id="news" aria-labelledby="news-title">
      <div className="section-topline"><span>03 / FROM THE CAMP</span><span>NOTES FROM GOAT</span></div>
      <SectionHeading eyebrow="LATEST STORIES" title="THE LATEST" id="news-title" action={news.length ? <a href="#community" className="text-link">MORE FROM GOAT <Arrow diagonal /></a> : <span className="section-side-note">UPDATES / TBA</span>} />
      {news.length ? <div className="news-grid">{news.map((story) => <article className="news-card" key={story.title}>
        <div className={`news-art ${story.imageTone}`}><span className="news-art-mark">G</span></div>
        <p className="news-kicker">{story.category} <span>·</span> {story.date}</p><h3>{story.title}</h3><p>{story.summary}</p>
      </article>)}</div> : (
        <div className="news-empty"><span className="news-empty-index">01—00</span><div><p>GOOD STORIES TAKE TIME.</p><span>Editorial updates from the team will land here.</span></div><span className="news-empty-mark">GOAT / JOURNAL</span></div>
      )}
    </section>
  );
}

function Achievements() {
  return <section className="stats-section" aria-label="Team achievements">
    <div className="stats-intro"><span>04 / THE STANDARD</span><p>THE WORK<br />COMES FIRST.</p></div>
    <div className="stats-list">{achievements.map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
    <p className="stats-note">Our record will speak for itself.<br />We’re just getting started.<br /><Link href="/achievements">VIEW RECORDS ↗</Link></p>
  </section>;
}

function Community() {
  return <section className="community" id="community" aria-labelledby="community-title">
    <div className="community-topline"><span>05 / STAY CLOSE</span><span>THE GOAT COMMUNITY</span></div>
    <div className="community-copy"><p className="eyebrow">THE CROWD IS PART OF THE GAME</p><h2 id="community-title">WE’RE JUST<br /><em>GETTING</em> STARTED.</h2>
      <p className="community-description">Follow the organization’s next steps and reach the team through official contact channels.</p>
      <Link className="button button-outline" href="/contact">CONTACT GOAT <Arrow /></Link>
    </div>
    <div className="community-stamp" aria-hidden="true"><span>GOAT</span><span>EST. / NEXT</span></div>
  </section>;
}

function PlatformSelection() {
  return <section className="section platform-section" id="divisions" aria-labelledby="divisions-title">
    <div className="section-topline"><span>01 / CHOOSE YOUR ARENA</span><span>GOAT ESPORTS DIVISIONS</span></div>
    <SectionHeading eyebrow="COMPETE WITH GOAT" title="THREE WAYS IN." id="divisions-title" action={<span className="section-side-note">MOBILE / PC / FAMILY</span>} />
    <div className="platform-grid">
      <Link className="platform-panel platform-mobile" href="/games/mobile">
        <span className="platform-index">01 — MOBILE</span><span className="platform-mark" aria-hidden="true">M</span>
        <span className="platform-title">MOBILE<br />ESPORTS</span><span className="platform-count">{gamesByDivision.mobile.length} GAME DIRECTORIES</span><span className="platform-arrow" aria-hidden="true">↗</span>
      </Link>
      <Link className="platform-panel platform-pc" href="/games/pc">
        <span className="platform-index">02 — PC / LAPTOP</span><span className="platform-mark" aria-hidden="true">P</span>
        <span className="platform-title">PC / LAPTOP<br />ESPORTS</span><span className="platform-count">{gamesByDivision.pc.length} GAME DIRECTORIES</span><span className="platform-arrow" aria-hidden="true">↗</span>
      </Link>
      <Link className="platform-panel platform-family" href="/games/family">
        <span className="platform-index">03 — FAMILY</span><span className="platform-mark" aria-hidden="true">F</span>
        <span className="platform-title">FAMILY<br />COMMUNITY</span><span className="platform-count">{gamesByDivision.family.length} GAME DIRECTORIES</span><span className="platform-arrow" aria-hidden="true">↗</span>
      </Link>
    </div>
  </section>;
}

function FounderFeature() {
  return <section className="founder-feature" aria-labelledby="founder-feature-title">
    <div className="founder-feature-art" aria-hidden="true"><span>VS · NB</span><span>GOAT / LEADERSHIP</span></div>
    <div className="founder-feature-copy">
      <p className="eyebrow">THE PEOPLE BEHIND GOAT</p>
      <h2 id="founder-feature-title">BUILT WITH<br />INTENT.</h2>
      <p>Meet {organizationContact.founder}, {organizationContact.title} of GOAT Esports. Leading the organization with a player-first vision across all competitive and community divisions.</p>
      <Link className="text-link" href="/founder">MEET THE FOUNDERS <Arrow diagonal /></Link>
    </div>
  </section>;
}

export default function Home() {
  return <main id="home">
    <section className="hero" aria-labelledby="hero-title">
      <HeroGlassMotion />
      <Image className="hero-image" src="/images/goat-team-hero.png" alt="A team of anonymous esports competitors standing in a dark arena" fill preload sizes="100vw" />
      <Image className="hero-crystal-art hero-crystal-art-desktop" src="/images/goat-ruby-glass-shards-v2.png" alt="" fill sizes="100vw" aria-hidden="true" />
      <Image className="hero-crystal-art hero-crystal-art-mobile" src="/images/goat-ruby-glass-mobile-v2.png" alt="" fill sizes="100vw" aria-hidden="true" />
      <div className="hero-glass-light" aria-hidden="true" />
      <div className="hero-shade" />
      <div className="hero-content"><p className="hero-kicker"><span className="live-dot" /> INDEPENDENT ESPORTS ORGANIZATION</p>
        <h1 id="hero-title">BUILT FOR<br />THE <em>MOMENT.</em></h1>
        <p className="hero-subtitle">Compete with purpose.<br />Ready for what’s next.</p>
        <a className="button button-red" href="#roster">MEET GOAT <Arrow /></a>
      </div>
      <div className="hero-index"><span>01 — 05</span><span>COMPETE / CREATE / REPEAT</span></div>
      <a className="scroll-cue" href="#roster"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></a>
    </section>
    <div className="ticker" aria-label="GOAT Esports, built for the moment"><div className="ticker-track">{Array.from({ length: 4 }, (_, index) => <span key={index}>GOAT ESPORTS <b>✳</b> BUILT FOR THE MOMENT <b>✳</b> THE NEXT CHAPTER <b>✳</b></span>)}</div></div>
    <PlatformSelection />
    <RosterSection />
    <MatchCenter />
    <NewsSection />
    <Achievements />
    <FounderFeature />
    <Community />
  </main>;
}
