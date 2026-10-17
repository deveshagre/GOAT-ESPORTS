import type { Metadata, Viewport } from "next";
import { LogoIntro } from "@/components/logo-intro";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { InteractionEffects } from "@/components/interaction-effects";
import { getSession } from "@/lib/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOAT Esports — Built for the moment",
  description: "The official home of GOAT Esports. The next chapter starts here.",
  icons: {
    icon: [
      { url: "/images/logo/goat-favicon.svg", type: "image/svg+xml" },
      { url: "/images/logo/goat-favicon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [
      { url: "/images/logo/goat-favicon.png", sizes: "256x256" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#10100f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <LogoIntro isLoggedIn={Boolean(session)} />
        <InteractionEffects />
        <div id="site-content">
          <Header session={session} />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
