import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/auth/users";
import { games } from "@/data/games";
import { logoutAction } from "@/app/actions/auth";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  // Strict role check: only OWNER can access admin tools
  if (session.role !== "OWNER") {
    return (
      <main className="public-page access-denied-page" id="home">
        <div className="page-kicker">
          <span>SECURITY PROTOCOL</span>
          <span className="access-denied-pill">403 FORBIDDEN</span>
        </div>
        <div className="access-denied-content">
          <p className="eyebrow">UNAUTHORIZED ELEVATION</p>
          <h1>ACCESS RESTRICTED</h1>
          <p className="access-denied-desc">
            Your account (<strong>{session.email}</strong>) is verified as <strong>{session.role}</strong>.
            Executive operations and roster mutations require <strong>OWNER</strong> credentials.
          </p>
          <div className="access-denied-actions">
            <Link href="/account" className="button button-red">
              RETURN TO PLAYER PORTAL →
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="portal-logout-btn">
                SWITCH ACCOUNT / SIGN OUT ↗
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const allUsers = await getAllUsers();
  const mobileCount = games.filter((g) => g.division === "mobile").length;
  const pcCount = games.filter((g) => g.division === "pc").length;
  const familyCount = games.filter((g) => g.division === "family").length;

  return (
    <main className="public-page admin-page" id="home">
      <div className="page-kicker">
        <span>EXECUTIVE CONTROL</span>
        <span>
          OWNER ROOT: <strong>{session.email}</strong>
        </span>
      </div>

      <div className="admin-header">
        <div>
          <span className="portal-role-badge portal-role-badge--owner">ROOT ACCESS GRANTED</span>
          <h1 className="admin-title">ORGANIZATION OPERATIONS</h1>
          <p className="admin-sub">
            Verified management console for GOAT Esports rosters, announcements, and team credentials.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="portal-logout-btn">
            LOCK &amp; SIGN OUT ↗
          </button>
        </form>
      </div>

      {/* KPI Stats */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">ORGANIZATION DIVISIONS</span>
          <strong className="admin-kpi-value">3</strong>
          <span className="admin-kpi-sub">Mobile ({mobileCount}) · PC ({pcCount}) · Family ({familyCount})</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">TOTAL ARENAS</span>
          <strong className="admin-kpi-value">{games.length}</strong>
          <span className="admin-kpi-sub">Active game directories</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">SYSTEM IDENTITIES</span>
          <strong className="admin-kpi-value">{allUsers.length}</strong>
          <span className="admin-kpi-sub">Authorized credentials</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">SECURITY AUDIT</span>
          <strong className="admin-kpi-value admin-kpi-green">SECURE</strong>
          <span className="admin-kpi-sub">HMAC-SHA256 session integrity</span>
        </div>
      </div>

      {/* User / Roster Management Table */}
      <section className="admin-section">
        <div className="admin-section-header">
          <span className="eyebrow">IDENTITY MANAGEMENT</span>
          <h2>REGISTERED ACCOUNTS &amp; ROLES</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>USER / CALLSIGN</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>ASSIGNMENT</th>
                <th>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    {u.inGameName && <span className="admin-ign">{u.inGameName}</span>}
                  </td>
                  <td className="admin-email-cell">{u.email}</td>
                  <td>
                    <span className={`portal-role-badge portal-role-badge--${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.teamRole || (u.role === "OWNER" ? "Organization Head" : "Community Supporter")}</td>
                  <td className="admin-date-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Ops Panel */}
      <section className="admin-section">
        <div className="admin-section-header">
          <span className="eyebrow">COMMAND PIPELINE</span>
          <h2>MANAGEMENT ACTIONS</h2>
        </div>
        <div className="admin-ops-grid">
          <div className="admin-op-card">
            <h3>ROSTER MUTATIONS</h3>
            <p>Assign players to starting lineups, captains, and bench substitutions across divisions.</p>
            <Link href="/games/mobile" className="button button-red admin-op-btn">
              MANAGE MOBILE ROSTERS →
            </Link>
          </div>
          <div className="admin-op-card">
            <h3>FIXTURE SCHEDULER</h3>
            <p>Publish verified tournament schedules, opponent match records, and competitive brackets.</p>
            <Link href="/games/pc" className="button button-red admin-op-btn">
              MANAGE PC FIXTURES →
            </Link>
          </div>
          <div className="admin-op-card">
            <h3>CONTACT &amp; AUDIT</h3>
            <p>View inbound inquiries, sponsor communications, and server-side authorization logs.</p>
            <Link href="/contact" className="button button-outline admin-op-btn">
              CONTACT DESK ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
