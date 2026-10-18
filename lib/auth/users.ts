import crypto from "crypto";
import type { User, UserRole } from "./types";
import { getDbPool, initDbSchema } from "@/lib/db/client";

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256").toString("hex");
}

type StoredUser = User & {
  salt: string;
  passwordHash: string;
};

// Seed salt
const DEFAULT_SALT = "goat_esports_salt_2026";

export function isOwnerEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const configured = process.env.OWNER_EMAIL?.toLowerCase().trim();
  return (
    normalized === "adiebhadauria@gmail.com" ||
    normalized === "vedantyt0777@gmail.com" ||
    normalized === "owner@goatesports.com" ||
    (Boolean(configured) && normalized === configured)
  );
}

// Initial seeded accounts
const SEED_USERS: StoredUser[] = [
  {
    id: "user_owner_01",
    email: "adiebhadauria@gmail.com",
    name: "Nitendra Bhadauria",
    role: "OWNER",
    salt: DEFAULT_SALT,
    passwordHash: hashPassword("goat2026", DEFAULT_SALT),
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user_owner_02",
    email: "vedantyt0777@gmail.com",
    name: "Vedant Shukla",
    role: "OWNER",
    salt: DEFAULT_SALT,
    passwordHash: hashPassword("goat2026", DEFAULT_SALT),
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user_owner_03",
    email: "owner@goatesports.com",
    name: "GOAT Executive Desk",
    role: "OWNER",
    salt: DEFAULT_SALT,
    passwordHash: hashPassword("goat2026", DEFAULT_SALT),
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user_player_01",
    email: "player@goatesports.com",
    name: "Aman 'VORTEX' Roy",
    role: "PLAYER",
    gameSlug: "bgmi",
    inGameName: "GOAT・Vortex",
    teamRole: "Assaulter & IGL",
    salt: DEFAULT_SALT,
    passwordHash: hashPassword("goat2026", DEFAULT_SALT),
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "user_fan_01",
    email: "fan@goatesports.com",
    name: "Devesh Agre",
    role: "VISITOR",
    salt: DEFAULT_SALT,
    passwordHash: hashPassword("goat2026", DEFAULT_SALT),
    createdAt: "2026-02-01T00:00:00Z",
  },
];

// In-memory runtime fallback map
const runtimeUsers: Map<string, StoredUser> = new Map(
  SEED_USERS.map((u) => [u.email.toLowerCase(), u])
);

let dbInitialized = false;

async function ensureDbReady(): Promise<boolean> {
  const db = getDbPool();
  if (!db) return false;
  if (dbInitialized) return true;

  try {
    await initDbSchema();

    // Check if seeds need to be inserted
    for (const seed of SEED_USERS) {
      await db.query(
        `
        INSERT INTO users (id, email, name, role, game_slug, in_game_name, team_role, salt, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (email) DO NOTHING
      `,
        [
          seed.id,
          seed.email,
          seed.name,
          seed.role,
          seed.gameSlug || null,
          seed.inGameName || null,
          seed.teamRole || null,
          seed.salt,
          seed.passwordHash,
          seed.createdAt,
        ]
      );
    }

    dbInitialized = true;
    return true;
  } catch (err) {
    console.warn("PostgreSQL connection fallback to memory store:", err);
    return false;
  }
}

function mapRowToUser(row: Record<string, unknown>): StoredUser {
  return {
    id: row.id as string,
    email: (row.email as string).toLowerCase(),
    name: row.name as string,
    role: row.role as UserRole,
    gameSlug: (row.game_slug as string) || undefined,
    inGameName: (row.in_game_name as string) || undefined,
    teamRole: (row.team_role as string) || undefined,
    salt: row.salt as string,
    passwordHash: row.password_hash as string,
    createdAt: (row.created_at as Date)?.toISOString() || new Date().toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const dbReady = await ensureDbReady();
  const db = getDbPool();

  if (dbReady && db) {
    try {
      const res = await db.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [normalizedEmail]);
      if (res.rows.length > 0) {
        const { salt: _, passwordHash: __, ...user } = mapRowToUser(res.rows[0]);
        return user;
      }
      return null;
    } catch {
      // Fall through to memory
    }
  }

  const stored = runtimeUsers.get(normalizedEmail);
  if (!stored) return null;
  const { salt: _, passwordHash: __, ...user } = stored;
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const dbReady = await ensureDbReady();
  const db = getDbPool();

  if (dbReady && db) {
    try {
      const res = await db.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length > 0) {
        const { salt: _, passwordHash: __, ...user } = mapRowToUser(res.rows[0]);
        return user;
      }
      return null;
    } catch {
      // Fall through
    }
  }

  for (const stored of runtimeUsers.values()) {
    if (stored.id === id) {
      const { salt: _, passwordHash: __, ...user } = stored;
      return user;
    }
  }
  return null;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const dbReady = await ensureDbReady();
  const db = getDbPool();

  let stored: StoredUser | null = null;

  if (dbReady && db) {
    try {
      const res = await db.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [normalizedEmail]);
      if (res.rows.length > 0) {
        stored = mapRowToUser(res.rows[0]);
      }
    } catch {
      // Fall through
    }
  }

  if (!stored) {
    stored = runtimeUsers.get(normalizedEmail) || null;
  }

  if (!stored) return null;

  const computedHash = hashPassword(password, stored.salt);
  if (computedHash !== stored.passwordHash) {
    return null;
  }

  if (isOwnerEmail(normalizedEmail) && stored.role !== "OWNER") {
    stored.role = "OWNER";
    if (dbReady && db) {
      try {
        await db.query("UPDATE users SET role = 'OWNER' WHERE email = $1", [normalizedEmail]);
      } catch {
        // Ignore
      }
    }
  }

  const { salt: _, passwordHash: __, ...user } = stored;
  return user;
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ user?: User; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const role: UserRole = isOwnerEmail(normalizedEmail) ? "OWNER" : "VISITOR";

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const newUser: StoredUser = {
    id,
    email: normalizedEmail,
    name: name.trim() || normalizedEmail.split("@")[0],
    role,
    salt,
    passwordHash,
    createdAt,
  };

  const dbReady = await ensureDbReady();
  const db = getDbPool();

  if (dbReady && db) {
    try {
      await db.query(
        `
        INSERT INTO users (id, email, name, role, salt, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [id, normalizedEmail, newUser.name, role, salt, passwordHash, createdAt]
      );
    } catch (err) {
      console.error("Failed to insert into PostgreSQL, falling back to memory:", err);
      runtimeUsers.set(normalizedEmail, newUser);
    }
  } else {
    runtimeUsers.set(normalizedEmail, newUser);
  }

  const { salt: _, passwordHash: __, ...user } = newUser;
  return { user };
}

export async function getAllUsers(): Promise<User[]> {
  const dbReady = await ensureDbReady();
  const db = getDbPool();

  if (dbReady && db) {
    try {
      const res = await db.query("SELECT * FROM users ORDER BY created_at DESC");
      return res.rows.map((row) => {
        const { salt: _, passwordHash: __, ...user } = mapRowToUser(row);
        return user;
      });
    } catch {
      // Fall through
    }
  }

  return Array.from(runtimeUsers.values()).map(({ salt: _, passwordHash: __, ...user }) => user);
}
