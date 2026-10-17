import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/users";
import { logoutAction } from "@/app/actions/auth";

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/account");
  }

  const user = await getUserById(session.userId);

  return (
    <main className="public-page portal-page" id="home">
      <div className="page-kicker">
        <span>AUTHENTICATED PORTAL</span>
        <span>
          ROLE: <strong>{session.role}</strong>
        </span>
      </div>

      <div className="portal-header">
        <div className="portal-badge-wrap">
          <span className={`portal-role-badge portal-role-badge--${session.role.toLowerCase()}`}>
            {session.role === "OWNER" ? "ORGANIZATION OWNER" : session.role === "PLAYER" ? "ACTIVE PRO PLAYER" : "VERIFIED SUPPORTER"}
          </span>
          <span className="portal-status-live">● ACTIVE SESSION</span>
        </div>
        <h1 className="portal-name">{user?.name || session.name}</h1>
        <p className="portal-email">{session.email}</p>
      </div>

      <div className="portal-grid">
        {/* Profile Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <span className="portal-card-eyebrow">IDENTITY &amp; ROSTER</span>
            <h2>COMPETITIVE PROFILE</h2>
          </div>
          <div className="portal-info-list">
            <div className="portal-info-row">
              <span>STATUS</span>
              <strong>{session.role === "PLAYER" ? "ACTIVE ROSTER" : session.role === "OWNER" ? "MANAGEMENT" : "COMMUNITY"}</strong>
            </div>
            {user?.inGameName && (
              <div className="portal-info-row">
                <span>IN-GAME CALLSIGN</span>
                <strong className="portal-ign">{user.inGameName}</strong>
              </div>
            )}
            {user?.teamRole && (
              <div className="portal-info-row">
                <span>TACTICAL ROLE</span>
                <strong>{user.teamRole}</strong>
              </div>
            )}
            {user?.gameSlug && (
              <div className="portal-info-row">
                <span>ASSIGNED TITLE</span>
                <Link href={`/games/${user.gameSlug}`} className="portal-link">
                  {user.gameSlug.toUpperCase()} DIRECTORY ↗
                </Link>
              </div>
            )}
            <div className="portal-info-row">
              <span>SECURITY LEVEL</span>
              <strong>TIER {session.role === "OWNER" ? "1 (FULL ROOT)" : session.role === "PLAYER" ? "2 (ROSTER)" : "3 (PUBLIC)"}</strong>
            </div>
          </div>
        </div>

        {/* Private Team Tools or Actions */}
        <div className="portal-card">
          <div className="portal-card-header">
            <span className="portal-card-eyebrow">OPERATIONS</span>
            <h2>{session.role === "PLAYER" ? "SCRIM & STRATEGY BRIEF" : session.role === "OWNER" ? "EXECUTIVE ACTIONS" : "SUPPORTER PERKS"}</h2>
          </div>

          {session.role === "PLAYER" && (
            <div className="portal-notes">
              <div className="portal-note-item">
                <span className="portal-note-date">PRACTICE TODAY · 18:00 IST</span>
                <p>Map VOD review: Erangel Phase 4 rotations and split pushes with coach.</p>
              </div>
              <div className="portal-note-item">
                <span className="portal-note-date">HARDWARE SPECIFICATIONS</span>
                <p>Official device setup: 120 FPS target, 4-finger claw, gyro enabled.</p>
              </div>
            </div>
          )}

          {session.role === "OWNER" && (
            <div className="portal-owner-shortcut">
              <p>You have full administrative privileges across GOAT Esports.</p>
              <Link href="/admin" className="button button-red portal-admin-btn">
                OPEN OWNER DASHBOARD →
              </Link>
            </div>
          )}

          {session.role === "VISITOR" && (
            <div className="portal-notes">
              <div className="portal-note-item">
                <span className="portal-note-date">COMMUNITY STATUS</span>
                <p>Welcome to GOAT Esports. Official merchandise drops and exclusive fan tournament registrations will be notified to this email.</p>
              </div>
            </div>
          )}

          <div className="portal-actions">
            <form action={logoutAction}>
              <button type="submit" className="portal-logout-btn">
                SIGN OUT OF SESSION ↗
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
