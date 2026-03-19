import { db } from "./index";

export async function runMigrations() {
  console.log("Running SQLite migrations...");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      plan TEXT DEFAULT 'free',
      is_verified INTEGER DEFAULT 0,
      is_banned INTEGER DEFAULT 0,
      email_verify_token TEXT,
      password_reset_token TEXT,
      password_reset_expires TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      unique_id TEXT UNIQUE,
      username TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      layout TEXT NOT NULL DEFAULT '{"sections":[],"theme":{},"meta":{}}',
      is_published INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      template_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      thumbnail TEXT,
      layout TEXT NOT NULL DEFAULT '{}',
      is_premium INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      visitor_ip TEXT,
      user_agent TEXT,
      referrer TEXT,
      meta TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      starts_at TEXT DEFAULT (datetime('now')),
      ends_at TEXT,
      payment_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ai_requests (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      prompt TEXT NOT NULL,
      response TEXT,
      tokens_used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_cards_username ON cards(username)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_analytics_card_id ON analytics(card_id)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_card_id ON leads(card_id)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      featured_image TEXT,
      images TEXT DEFAULT '[]',
      category_id TEXT,
      tags TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      seo_title TEXT,
      seo_description TEXT,
      publish_date TEXT,
      deleted_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT,
      url TEXT NOT NULL,
      size INTEGER,
      mime_type TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log("✅ SQLite migrations complete");
}
