import { Pool } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

/**
 * Auto-initializes the users table in PostgreSQL if it doesn't already exist.
 */
export async function initDbSchema(): Promise<void> {
  const db = getDbPool();
  if (!db) return;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'VISITOR',
      game_slug VARCHAR(64),
      in_game_name VARCHAR(128),
      team_role VARCHAR(128),
      salt VARCHAR(64) NOT NULL,
      password_hash VARCHAR(128) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    await db.query(createTableQuery);
  } catch (err) {
    console.error("Failed to initialize PostgreSQL schema:", err);
  }
}
