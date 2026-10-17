import { PublicPageHeading } from "@/components/public-page";
import { AchievementBrowser } from "@/components/achievement-browser";

export default function AchievementsPage() {
  return <main className="public-page" id="home">
    <div className="page-kicker"><span>GOAT ESPORTS / RECORD</span><span>VERIFIED RESULTS ONLY</span></div>
    <PublicPageHeading eyebrow="THE RECORD" title="ACHIEVEMENTS" description="Tournament names, placements, dates, and supporting imagery belong here once independently verified and approved for publication." />
    <AchievementBrowser />
  </main>;
}
