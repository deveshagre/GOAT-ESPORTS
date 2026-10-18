"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SessionPayload } from "@/lib/auth/types";

const links = [
  { label: "HOME", href: "/" },
  { label: "MOBILE", href: "/games/mobile" },
  { label: "PC / LAPTOP", href: "/games/pc" },
  { label: "FAMILY", href: "/games/family" },
  { label: "ACHIEVEMENTS", href: "/achievements" },
  { label: "FOUNDERS", href: "/founder" },
];

export function Header({ session }: { session?: SessionPayload | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="GOAT Esports home">
        <Image
          src="/images/logo/goat-logo-header.svg"
          alt="GOAT Esports"
          width={190}
          height={48}
          priority
          className="site-logo-img"
        />
      </Link>
      <nav id="mobile-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        {session ? (
          <Link
            href={session.role === "OWNER" ? "/admin" : "/account"}
            onClick={() => setMenuOpen(false)}
          >
            {session.role === "OWNER" ? "OWNER PORTAL" : "PLAYER PORTAL"}
          </Link>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            SIGN IN
          </Link>
        )}
      </nav>

      {session ? (
        <Link
          className="header-auth-badge"
          href={session.role === "OWNER" ? "/admin" : "/account"}
          title={`Signed in as ${session.name} (${session.role})`}
        >
          <span className={`header-auth-dot header-auth-dot--${session.role.toLowerCase()}`} />
          <span>{session.role}</span>
        </Link>
      ) : (
        <Link className="header-auth-link" href="/login">
          SIGN IN
        </Link>
      )}

      <Link className="header-cta" href="/contact">
        CONTACT <span aria-hidden="true">↗</span>
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
