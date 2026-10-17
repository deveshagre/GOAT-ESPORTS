import Link from "next/link";
import { organizationContact } from "@/data/organization";
import { PublicPageHeading } from "@/components/public-page";

export default function FounderPage() {
  return <main className="public-page founder-page" id="home">
    <div className="page-kicker"><span>GOAT ESPORTS / LEADERSHIP</span><span>FOUNDER PROFILE</span></div>
    <PublicPageHeading eyebrow="FOUNDER & CEO" title="VEDANT SHUKLA" description="The portrait and biography are placeholders until approved material is supplied." />
    <div className="founder-profile">
      <div className="founder-portrait" role="img" aria-label="Founder portrait not yet supplied"><span>VS</span><small>PORTRAIT / TBA</small></div>
      <div className="founder-bio"><p className="eyebrow">ORGANIZATION LEADERSHIP</p><h2>{organizationContact.title}</h2><p>A founder biography will be published here when approved. No personal history or organization claims are assumed.</p>
        <a className="button button-red" href={`mailto:${organizationContact.email}`}>EMAIL {organizationContact.founder.toUpperCase()} <span aria-hidden="true">↗</span></a>
        <nav className="founder-socials" aria-label="Founder social channels">{organizationContact.social.map((item) => <Link key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}<span aria-hidden="true">↗</span></Link>)}</nav>
      </div>
    </div>
  </main>;
}
