# Authentication & Security Architecture

GOAT Esports implements a server-verified session authentication and role-based access control (RBAC) architecture built for Next.js App Router and Server Actions.

---

## 1. Roles & Security Hierarchy

The organization enforces three server-assigned security tiers:

| Tier | Role | Description | Access Rights |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **`OWNER`** | Organization Leadership (Founder / Executive) | Full root access to `/admin` management console, roster mutations, and security overview. |
| **Tier 2** | **`PLAYER`** | Active Pro Player on Team Roster | Access to private `/account` portal with assigned game title, roster role, scrim briefs, and hardware settings. Restricted from `/admin` (403 Forbidden). |
| **Tier 3** | **`VISITOR`** | Registered Supporter / Fan | Access to basic `/account` supporter profile. Restricted from `/admin` (403 Forbidden). |

Roles are immutable on the client; sessions are cryptographically signed on the server.

---

## 2. Default Seed Accounts (For Local Testing & Development)

The system is seeded with test credentials for all three tiers:

| Account Type | Email | Password | Role | Default Redirect |
| :--- | :--- | :--- | :--- | :--- |
| **Owner** | `owner@goatesports.com` | `goat2026` | `OWNER` | `/admin` |
| **Pro Player** | `player@goatesports.com` | `goat2026` | `PLAYER` | `/account` |
| **Visitor / Fan** | `fan@goatesports.com` | `goat2026` | `VISITOR` | `/account` |

The `/login` portal includes quick-fill buttons to test each role with a single click.

---

## 3. Session & Cryptographic Token Architecture

- **Session Token**: HMAC-SHA256 signed JWT-style token (`encodedData.signature`).
- **Cookie Security**:
  - `httpOnly: true` (inaccessible to client JavaScript, preventing XSS token theft).
  - `sameSite: "lax"` (CSRF protection).
  - `secure: true` in production (enforced over HTTPS).
  - `maxAge: 7 days`.
- **Server-Side Validation**: Every protected route (`/account`, `/admin`) verifies the session signature with timing-safe comparison on the server before rendering private data.
- **Server Actions**: [`app/actions/auth.ts`](file:///Users/deves/Codes/goat/app/actions/auth.ts) handles `loginAction`, `registerAction`, and `logoutAction` without exposing credentials to client code.

---

## 4. Production Environment Configuration

To configure production secrets, create a `.env.local` or configure deployment environment variables:

```dotenv
# At least 32 random characters for HMAC-SHA256 signature
AUTH_SECRET=your-secure-32-byte-secret-key-here

# Verified Organization Owner Email (automatically elevates this user to OWNER upon authentication)
OWNER_EMAIL=vedant@goatesports.com

# Optional Google OAuth Integration
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret

# Optional PostgreSQL Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

### OAuth Callback URI
When using Google OAuth:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://YOUR_DOMAIN/api/auth/callback/google`
