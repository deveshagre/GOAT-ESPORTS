import Link from "next/link";

export function PublicPageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="public-page-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    {description ? <p className="public-page-description">{description}</p> : null}
  </header>;
}

export function EmptyState({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="record-empty"><span>{label}</span><p>{children}</p></div>;
}

export function BackLink({ href = "/", children = "BACK TO HOME" }: { href?: string; children?: React.ReactNode }) {
  return <Link className="back-link" href={href}><span aria-hidden="true">←</span>{children}</Link>;
}
