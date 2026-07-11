import path from "path";
import fs from "fs";
import { createClient, type Client } from "@libsql/client";

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

// ─── Always use libsql ────────────────────────────────────────────────────────
// In production: remote Turso database
// In development: local file via libsql file: protocol
let client: Client;

if (TURSO_URL && TURSO_TOKEN) {
  console.log("🌐 Using Turso remote database:", TURSO_URL);
  client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
} else {
  const DB_DIR = path.join(__dirname, "../../data");
  const DB_PATH = path.join(DB_DIR, "digital_diaries.db");
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  console.log("💾 Using local SQLite:", DB_PATH);
  client = createClient({ url: `file:${DB_PATH}` });
}

export { client };

// ─── Compatibility shim — mirrors the node:sqlite sync API ───────────────────
// Routes use db.prepare(sql).all/get/run — we wrap these as sync-looking but
// actually execute via a shared promise queue flushed before each request.

type Row = Record<string, unknown>;
type RunResult = { changes: number; lastInsertRowid: number | bigint };

function prepare(sql: string) {
  return {
    all: (...params: unknown[]): Row[] => {
      throw new Error(`[db] Use allAsync. SQL: ${sql.slice(0, 60)}`);
    },
    get: (...params: unknown[]): Row | undefined => {
      throw new Error(`[db] Use getAsync. SQL: ${sql.slice(0, 60)}`);
    },
    run: (...params: unknown[]): RunResult => {
      throw new Error(`[db] Use runAsync. SQL: ${sql.slice(0, 60)}`);
    },
    allAsync: async (...params: unknown[]): Promise<Row[]> => {
      const r = await client.execute({ sql, args: params as (string | number | bigint | null | ArrayBuffer)[] });
      return r.rows.map(row => Object.fromEntries(r.columns.map((c, i) => [c, row[i]])));
    },
    getAsync: async (...params: unknown[]): Promise<Row | undefined> => {
      const r = await client.execute({ sql, args: params as (string | number | bigint | null | ArrayBuffer)[] });
      if (!r.rows.length) return undefined;
      return Object.fromEntries(r.columns.map((c, i) => [c, r.rows[0][i]]));
    },
    runAsync: async (...params: unknown[]): Promise<RunResult> => {
      const r = await client.execute({ sql, args: params as (string | number | bigint | null | ArrayBuffer)[] });
      return { changes: r.rowsAffected, lastInsertRowid: r.lastInsertRowid ?? 0 };
    },
  };
}

async function exec(sql: string): Promise<void> {
  const stmts = sql.split(";").map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    await client.execute(s);
  }
}

export const db = { prepare, exec };
