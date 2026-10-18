import Link from "next/link";
import { organizationContact } from "@/data/organization";
import { PublicPageHeading } from "@/components/public-page";

export default function ContactPage() {
  return (
    <main className="public-page contact-page" id="home">
      <div className="page-kicker">
        <span>GOAT ESPORTS / GET IN TOUCH</span>
        <span>DIRECT CONTACT</span>
      </div>
      <PublicPageHeading
        eyebrow="CONTACT"
        title="START A CONVERSATION."
        description="For organization enquiries, tournament opportunities, or talent representation, connect directly with the founders."
      />
      <div className="contact-emails-grid" style={{ display: "grid", gap: "10px", margin: "24px 0" }}>
        <a className="contact-email" href={`mailto:${organizationContact.email}?subject=GOAT%20Esports%20Enquiry`}>
          <span>{organizationContact.email} (Nitendra)</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a className="contact-email" href={`mailto:${organizationContact.secondaryEmail}?subject=GOAT%20Esports%20Enquiry`}>
          <span>{organizationContact.secondaryEmail} (Vedant)</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <section className="contact-social-section" aria-labelledby="contact-social-title">
        <p className="eyebrow">FOUNDERS CHANNELS</p>
        <h2 id="contact-social-title">FOLLOW THE FOUNDERS.</h2>
        <nav className="contact-social-list" aria-label="Founders social channels">
          {organizationContact.social.map((item) => (
            <Link href={item.href} target="_blank" rel="noreferrer" key={item.label}>
              {item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </section>
      <p className="contact-note">
        These are the founders&apos; verified personal and executive channels. Official GOAT organization channels are managed through the leadership desk.
      </p>
    </main>
  );
}
