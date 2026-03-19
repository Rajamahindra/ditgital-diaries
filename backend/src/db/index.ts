// Uses Node.js 22.5+ built-in SQLite (node:sqlite) — no native compilation needed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require("node:sqlite");
import path from "path";
import fs from "fs";

const DB_DIR = path.join(__dirname, "../../data");
const DB_PATH = path.join(DB_DIR, "digital_diaries.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

export const db = new DatabaseSync(DB_PATH);

// Enable WAL + foreign keys
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Run migrations immediately on import
import { runMigrations } from "./migrate";
runMigrations();

/**
 * Run a SELECT and return all rows.
 */
export function queryAll<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params) as T[];
  } catch (err) {
    console.error("DB queryAll error:", err, "\nSQL:", sql);
    throw err;
  }
}

/**
 * Run a SELECT and return the first row or null.
 */
export function queryOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T | null {
  try {
    const stmt = db.prepare(sql);
    return (stmt.get(...params) as T) || null;
  } catch (err) {
    console.error("DB queryOne error:", err, "\nSQL:", sql);
    throw err;
  }
}

/**
 * Run INSERT/UPDATE/DELETE and return run result.
 */
export function execute(sql: string, params: unknown[] = []): { changes: number; lastInsertRowid: number | bigint } {
  try {
    return db.prepare(sql).run(...params);
  } catch (err) {
    console.error("DB execute error:", err, "\nSQL:", sql);
    throw err;
  }
}
