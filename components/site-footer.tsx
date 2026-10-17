import Link from "next/link";
import Image from "next/image";
import { organizationContact } from "@/data/organization";

export function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-main">
        <Link className="footer-brand" href="/" aria-label="GOAT Esports home">
          <Image
            src="/images/logo/goat-logo-header.svg"
            alt="GOAT Esports"
            width={190}
            height={48}
            className="footer-logo-img"
          />
        </Link>
        <p>BUILT FOR THE MOMENT.<br />READY FOR WHAT’S NEXT.</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/games/mobile">MOBILE</Link>
          <Link href="/games/pc">PC / LAPTOP</Link>
          <Link href="/games/family">FAMILY</Link>
          <Link href="/achievements">ACHIEVEMENTS</Link>
          <Link href="/founder">FOUNDER</Link>
          <Link href="/account">PLAYER PORTAL</Link>
          <Link href="/contact">CONTACT</Link>
        </nav>
      </div>
      <nav className="footer-social" aria-label="Founder social links">
        <span>FOUNDER CHANNELS</span>
        {organizationContact.social.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>
        ))}
        <a href={`mailto:${organizationContact.email}`}>{organizationContact.email}</a>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GOAT ESPORTS</span>
        <span>INDEPENDENT BY NATURE.</span>
        <Link href="/#home">BACK TO TOP ↑</Link>
      </div>
    </footer>
  );
}
