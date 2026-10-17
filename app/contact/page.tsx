import Link from "next/link";
import { organizationContact } from "@/data/organization";
import { PublicPageHeading } from "@/components/public-page";

export default function ContactPage() {
  return <main className="public-page contact-page" id="home">
    <div className="page-kicker"><span>GOAT ESPORTS / GET IN TOUCH</span><span>DIRECT CONTACT</span></div>
    <PublicPageHeading eyebrow="CONTACT" title="START A CONVERSATION." description="For organization enquiries, contact GOAT directly by email. No contact form is shown because no form delivery service is configured." />
    <a className="contact-email" href={`mailto:${organizationContact.email}?subject=GOAT%20Esports%20Enquiry`}>{organizationContact.email}<span aria-hidden="true">↗</span></a>
    <section className="contact-social-section" aria-labelledby="contact-social-title"><p className="eyebrow">FOUNDER CHANNELS</p><h2 id="contact-social-title">FOLLOW VEDANT.</h2><nav className="contact-social-list" aria-label="Founder social channels">{organizationContact.social.map((item) => <Link href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label}<span aria-hidden="true">↗</span></Link>)}</nav></section>
    <p className="contact-note">These are the founder’s supplied profiles. Official GOAT organization social accounts have not been provided.</p>
  </main>;
}
