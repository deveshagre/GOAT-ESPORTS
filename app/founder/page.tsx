import Link from "next/link";
import { founders } from "@/data/organization";
import { PublicPageHeading } from "@/components/public-page";

export default function FounderPage() {
  return (
    <main className="public-page founder-page" id="home">
      <div className="page-kicker">
        <span>GOAT ESPORTS / LEADERSHIP</span>
        <span>FOUNDERS DIRECTORY</span>
      </div>
      <PublicPageHeading
        eyebrow="ORGANIZATION LEADERSHIP"
        title="THE CO-FOUNDERS"
        description="The vision, discipline, and competitive standard behind GOAT Esports. Two leaders. One organization."
      />
      <div className="founders-list">
        {founders.map((founder, idx) => (
          <section className="founder-profile" key={founder.name} aria-labelledby={`founder-${idx}`}>
            <div className="founder-portrait" role="img" aria-label={`${founder.name} portrait placeholder`}>
              <span>{founder.initials}</span>
              <small>{founder.title.toUpperCase()} / {founder.name.toUpperCase()}</small>
            </div>
            <div className="founder-bio">
              <p className="eyebrow">{founder.title.toUpperCase()}</p>
              <h2 id={`founder-${idx}`}>{founder.name}</h2>
              <p>{founder.bio}</p>
              <a className="button button-red" href={`mailto:${founder.email}`}>
                CONTACT {founder.name.split(" ")[0].toUpperCase()} <span aria-hidden="true">↗</span>
              </a>
              <nav className="founder-socials" aria-label={`${founder.name} social channels`}>
                {founder.social.map((item) => (
                  <Link key={item.label} href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
