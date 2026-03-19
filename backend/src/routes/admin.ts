import { Router, Response } from "express";
import { db } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// ─── Media upload setup ───────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Migrations for posts/categories/media ───────────────────────────────────
db.exec(`
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
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
    seo_title TEXT,
    seo_description TEXT,
    publish_date TEXT,
    deleted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT,
    url TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Site Settings ────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed default settings
const defaultSettings: Record<string, string> = {
  site_name: "Digital Diaries",
  site_tagline: "AI-Powered Digital Identity Platform",
  hero_headline: "Build Your Professional Digital Identity in Minutes",
  hero_subheadline: "Not just a visiting card. A complete mini website with AI-generated content, real-time analytics, lead capture, and a live public URL — all in one.",
  hero_cta_primary: "Create Your Card Free",
  hero_cta_secondary: "Watch Demo",
  hero_stat_1_value: "50K+",
  hero_stat_1_label: "Professionals",
  hero_stat_2_value: "4.9★",
  hero_stat_2_label: "Rating",
  hero_stat_3_value: "2 min",
  hero_stat_3_label: "Setup time",
  features_title: "More than a card. A digital identity.",
  features_subtitle: "Every feature you need to build a powerful professional presence online.",
  pricing_title: "Choose your plan",
  pricing_subtitle: "Start free. Upgrade when you need more power.",
  plan_free_price: "₹0",
  plan_pro_price: "₹499",
  plan_business_price: "₹1,499",
  footer_text: "© 2026 Digital Diaries. All rights reserved.",
  logo_url: "",
  primary_color: "#0F172A",
  secondary_color: "#2563EB",
  accent_color: "#7C3AED",
};

for (const [key, value] of Object.entries(defaultSettings)) {
  const existing = db.prepare("SELECT key FROM site_settings WHERE key = ?").get(key);
  if (!existing) {
    db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)").run(key, value);
  }
}

// GET /api/admin/settings
adminRouter.get("/settings", async (_req, res: Response) => {
  try {
    const rows = db.prepare("SELECT key, value FROM site_settings").all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ settings });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// PUT /api/admin/settings
adminRouter.put("/settings", async (req: AuthRequest, res: Response) => {
  try {
    const { settings } = req.body as { settings: Record<string, string> };
    const now = new Date().toISOString();
    for (const [key, value] of Object.entries(settings)) {
      db.prepare("INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at")
        .run(key, value, now);
    }
    res.json({ message: "Settings saved" });
  } catch {
    res.status(500).json({ message: "Failed to save settings" });
  }
});

// ─── Templates admin ──────────────────────────────────────────────────────────
adminRouter.get("/templates", async (_req, res: Response) => {
  try {
    const templates = db.prepare("SELECT id, name, category, thumbnail, is_premium, tags FROM templates ORDER BY name ASC").all();
    res.json({ templates });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.put("/templates/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, is_premium } = req.body;
    db.prepare("UPDATE templates SET name=?, category=?, is_premium=? WHERE id=?")
      .run(name, category, is_premium ? 1 : 0, req.params.id);
    res.json({ message: "Template updated" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Card admin edit ──────────────────────────────────────────────────────────
adminRouter.get("/cards/:id", async (req: AuthRequest, res: Response) => {
  try {
    const card = db.prepare(
      `SELECT c.*, u.name as owner_name, u.email as owner_email
       FROM cards c JOIN users u ON c.user_id = u.id WHERE c.id = ?`
    ).get(req.params.id) as Record<string, unknown> | undefined;
    if (!card) return res.status(404).json({ message: "Card not found" });
    card.layout = typeof card.layout === "string" ? JSON.parse(card.layout as string) : card.layout;
    res.json({ card });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.put("/cards/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { layout, is_published, is_featured } = req.body;
    db.prepare("UPDATE cards SET layout=?, is_published=?, is_featured=?, updated_at=? WHERE id=?")
      .run(JSON.stringify(layout), is_published ? 1 : 0, is_featured ? 1 : 0, new Date().toISOString(), req.params.id);
    res.json({ message: "Card updated" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// Public settings endpoint (no auth needed) — exported separately
export const publicSettingsRouter = Router();
publicSettingsRouter.get("/public-settings", async (_req, res: Response) => {
  try {
    const rows = db.prepare("SELECT key, value FROM site_settings").all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ settings });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.get("/stats", async (_req, res: Response) => {
  try {
    const users = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    const cards = db.prepare("SELECT COUNT(*) as count FROM cards").get() as { count: number };
    const published = db.prepare("SELECT COUNT(*) as count FROM cards WHERE is_published = 1").get() as { count: number };
    const leads = db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number };
    const views = db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'view'").get() as { count: number };
    const posts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE deleted_at IS NULL").get() as { count: number };
    const publishedPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status='published' AND deleted_at IS NULL").get() as { count: number };
    const categories = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };

    const recentPosts = db.prepare(
      "SELECT id, title, slug, status, created_at FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5"
    ).all();
    const recentUsers = db.prepare(
      "SELECT id, name, email, plan, created_at FROM users ORDER BY created_at DESC LIMIT 5"
    ).all();

    res.json({
      stats: {
        totalUsers: users.count,
        totalCards: cards.count,
        publishedCards: published.count,
        totalLeads: leads.count,
        totalViews: views.count,
        totalPosts: posts.count,
        publishedPosts: publishedPosts.count,
        totalCategories: categories.count,
      },
      recentPosts,
      recentUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Users ────────────────────────────────────────────────────────────────────
adminRouter.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || "";
    const limit = 20;
    const offset = (page - 1) * limit;

    const where = search ? `WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'` : "";
    const users = db.prepare(
      `SELECT id, name, email, plan, is_verified, is_banned, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).all(limit, offset);
    const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get() as { count: number }).count;

    res.json({ users, total, page });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.post("/users/:id/ban", async (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare("SELECT is_banned FROM users WHERE id = ?").get(req.params.id) as { is_banned: number } | undefined;
    if (!user) return res.status(404).json({ message: "User not found" });
    db.prepare("UPDATE users SET is_banned = ? WHERE id = ?").run(user.is_banned ? 0 : 1, req.params.id);
    res.json({ message: "User ban status toggled" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Cards ────────────────────────────────────────────────────────────────────
adminRouter.get("/cards", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const cards = db.prepare(
      `SELECT c.id, c.unique_id, c.username, c.is_published, c.is_featured, c.created_at,
              u.name as owner_name, u.email as owner_email
       FROM cards c JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC LIMIT ? OFFSET ?`
    ).all(limit, offset);
    const total = (db.prepare("SELECT COUNT(*) as count FROM cards").get() as { count: number }).count;

    res.json({ cards, total, page });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.post("/cards/:id/feature", async (req: AuthRequest, res: Response) => {
  try {
    const card = db.prepare("SELECT is_featured FROM cards WHERE id = ?").get(req.params.id) as { is_featured: number } | undefined;
    if (!card) return res.status(404).json({ message: "Card not found" });
    db.prepare("UPDATE cards SET is_featured = ? WHERE id = ?").run(card.is_featured ? 0 : 1, req.params.id);
    res.json({ message: "Card feature status toggled" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Posts ────────────────────────────────────────────────────────────────────
adminRouter.get("/posts", async (req: AuthRequest, res: Response) => {
  try {
    const { search = "", category = "", status = "", page = "1" } = req.query;
    const limit = 20;
    const offset = (parseInt(page as string) - 1) * limit;

    let where = "WHERE p.deleted_at IS NULL";
    if (search) where += ` AND (p.title LIKE '%${search}%' OR p.content LIKE '%${search}%')`;
    if (category) where += ` AND p.category_id = '${category}'`;
    if (status) where += ` AND p.status = '${status}'`;

    const posts = db.prepare(
      `SELECT p.*, c.name as category_name FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    ).all(limit, offset);

    const total = (db.prepare(`SELECT COUNT(*) as count FROM posts p ${where}`).get() as { count: number }).count;
    res.json({ posts, total, page: parseInt(page as string) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.get("/posts/:id", async (req: AuthRequest, res: Response) => {
  try {
    const post = db.prepare(
      `SELECT p.*, c.name as category_name FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? AND p.deleted_at IS NULL`
    ).get(req.params.id) as Record<string, unknown> | undefined;
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.images = JSON.parse(post.images as string || "[]");
    post.tags = JSON.parse(post.tags as string || "[]");
    res.json({ post });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.post("/posts", async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, slug, content, excerpt, featured_image, images, category_id, tags, status, seo_title, seo_description, publish_date } = req.body;
    if (!title || !slug) return res.status(400).json({ message: "Title and slug required" });

    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO posts (id, title, subtitle, slug, content, excerpt, featured_image, images, category_id, tags, status, seo_title, seo_description, publish_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, subtitle || null, slug, content || null, excerpt || null, featured_image || null,
      JSON.stringify(images || []), category_id || null, JSON.stringify(tags || []),
      status || "draft", seo_title || null, seo_description || null, publish_date || null, now, now);

    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
    res.status(201).json({ post });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Failed to create post" });
  }
});

adminRouter.put("/posts/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, slug, content, excerpt, featured_image, images, category_id, tags, status, seo_title, seo_description, publish_date } = req.body;
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE posts SET title=?, subtitle=?, slug=?, content=?, excerpt=?, featured_image=?, images=?,
       category_id=?, tags=?, status=?, seo_title=?, seo_description=?, publish_date=?, updated_at=?
       WHERE id=? AND deleted_at IS NULL`
    ).run(title, subtitle || null, slug, content || null, excerpt || null, featured_image || null,
      JSON.stringify(images || []), category_id || null, JSON.stringify(tags || []),
      status || "draft", seo_title || null, seo_description || null, publish_date || null, now, req.params.id);

    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
    res.json({ post });
  } catch {
    res.status(500).json({ message: "Failed to update post" });
  }
});

adminRouter.delete("/posts/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { permanent } = req.query;
    if (permanent === "true") {
      db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    } else {
      db.prepare("UPDATE posts SET deleted_at = ? WHERE id = ?").run(new Date().toISOString(), req.params.id);
    }
    res.json({ message: "Post deleted" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Categories ───────────────────────────────────────────────────────────────
adminRouter.get("/categories", async (_req, res: Response) => {
  try {
    const categories = db.prepare("SELECT * FROM categories ORDER BY name ASC").all();
    res.json({ categories });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.post("/categories", async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) return res.status(400).json({ message: "Name and slug required" });
    const id = uuidv4();
    db.prepare("INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)").run(id, name, slug, description || null);
    const cat = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    res.status(201).json({ category: cat });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.put("/categories/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description } = req.body;
    db.prepare("UPDATE categories SET name=?, slug=?, description=? WHERE id=?").run(name, slug, description || null, req.params.id);
    const cat = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
    res.json({ category: cat });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.delete("/categories/:id", async (req: AuthRequest, res: Response) => {
  try {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    res.json({ message: "Category deleted" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ─── Media ────────────────────────────────────────────────────────────────────
adminRouter.get("/media", async (_req, res: Response) => {
  try {
    const media = db.prepare("SELECT * FROM media ORDER BY created_at DESC").all();
    res.json({ media });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

adminRouter.post("/media/upload", upload.array("files", 10), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploaded = [];

    for (const file of files) {
      const id = uuidv4();
      const url = `${baseUrl}/uploads/${file.filename}`;
      db.prepare(
        "INSERT INTO media (id, filename, original_name, url, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(id, file.filename, file.originalname, url, file.size, file.mimetype);
      uploaded.push({ id, filename: file.filename, original_name: file.originalname, url, size: file.size, mime_type: file.mimetype });
    }

    res.json({ media: uploaded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

adminRouter.delete("/media/:id", async (req: AuthRequest, res: Response) => {
  try {
    const media = db.prepare("SELECT filename FROM media WHERE id = ?").get(req.params.id) as { filename: string } | undefined;
    if (media) {
      const filePath = path.join(uploadDir, media.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      db.prepare("DELETE FROM media WHERE id = ?").run(req.params.id);
    }
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});
