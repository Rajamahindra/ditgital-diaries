import { Router, Response } from "express";
import { db } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

export const cardsRouter = Router();

const PLAN_LIMITS: Record<string, number> = { free: 1, pro: 10, business: 999999 };

const DEFAULT_LAYOUT = {
  sections: [],
  theme: {
    primaryColor: "#0F172A",
    secondaryColor: "#2563EB",
    accentColor: "#7C3AED",
    backgroundColor: "#FFFFFF",
    textColor: "#0F172A",
    fontFamily: "Inter",
    borderRadius: "12px",
    darkMode: false,
  },
  meta: { title: "", description: "" },
};

function parseCard(row: Record<string, unknown>) {
  if (!row) return null;
  return {
    ...row,
    layout: typeof row.layout === "string" ? JSON.parse(row.layout as string) : row.layout,
    isPublished: row.is_published === 1 || row.is_published === 1n || row.is_published === "1" || row.is_published === true,
    isActive: row.is_active === 1 || row.is_active === 1n || row.is_active === "1" || row.is_active === true,
    isFeatured: row.is_featured === 1 || row.is_featured === 1n || row.is_featured === "1" || row.is_featured === true,
    uniqueId: row.unique_id,
  };
}

// GET /api/cards
cardsRouter.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.prepare(
      "SELECT * FROM cards WHERE user_id = ? ORDER BY created_at DESC"
    ).allAsync(req.user!.id) as Record<string, unknown>[];
    res.json({ cards: rows.map(parseCard) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
});

// GET /api/cards/public/:username
cardsRouter.get("/public/:username", async (req, res: Response) => {
  try {
    const row = await db.prepare(
      "SELECT * FROM cards WHERE username = ? AND CAST(is_published AS INTEGER) = 1 AND CAST(is_active AS INTEGER) = 1"
    ).getAsync(req.params.username) as Record<string, unknown> | undefined;
    if (!row) {
      // Try without is_active check (some old cards may have is_active = 0 by default)
      const rowAny = await db.prepare(
        "SELECT * FROM cards WHERE username = ? AND CAST(is_published AS INTEGER) = 1"
      ).getAsync(req.params.username) as Record<string, unknown> | undefined;
      if (!rowAny) return res.status(404).json({ message: "Card not found" });
      return res.json({ card: parseCard(rowAny) });
    }
    res.json({ card: parseCard(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch card" });
  }
});

// GET /api/cards/:id
cardsRouter.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const row = await db.prepare(
      "SELECT * FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.id, req.user!.id) as Record<string, unknown> | undefined;
    if (!row) return res.status(404).json({ message: "Card not found" });
    res.json({ card: parseCard(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch card" });
  }
});

// POST /api/cards
cardsRouter.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { username, templateId } = req.body;

    if (!username) return res.status(400).json({ message: "Username required" });
    if (!/^[a-z0-9-]+$/.test(username)) {
      return res.status(400).json({ message: "Username can only contain lowercase letters, numbers, and hyphens" });
    }

    // Check plan limits
    const countRow = await db.prepare(
      "SELECT COUNT(*) as count FROM cards WHERE user_id = ?"
    ).getAsync(req.user!.id) as { count: number };
    const limit = PLAN_LIMITS[req.user!.plan] || 1;
    if (countRow.count >= limit) {
      return res.status(403).json({ message: `Your ${req.user!.plan} plan allows ${limit} card(s). Upgrade to create more.` });
    }

    // Check username availability
    const existing = await db.prepare("SELECT id FROM cards WHERE username = ?").getAsync(username);
    if (existing) return res.status(409).json({ message: "Username already taken" });

    // Get template layout if provided
    let layout = DEFAULT_LAYOUT;
    if (templateId) {
      const template = await db.prepare(
        "SELECT layout FROM templates WHERE id = ?"
      ).getAsync(templateId) as { layout: string } | undefined;
      if (template) {
        layout = typeof template.layout === "string" ? JSON.parse(template.layout) : template.layout;
      }
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const year = new Date().getFullYear();

    // Generate unique_id
    const maxRow = await db.prepare(
      "SELECT MAX(CAST(SUBSTR(unique_id, 9) AS INTEGER)) as maxNum FROM cards WHERE unique_id LIKE ?"
    ).getAsync(`DD-${year}-%`) as { maxNum: number | null };
    const nextNum = (maxRow?.maxNum || 0) + 1;
    const uniqueId = `DD-${year}-${String(nextNum).padStart(6, "0")}`;

    await db.prepare(
      `INSERT INTO cards (id, unique_id, username, user_id, layout, template_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).runAsync(id, uniqueId, username, req.user!.id, JSON.stringify(layout), templateId || null, now, now);

    const row = await db.prepare("SELECT * FROM cards WHERE id = ?").getAsync(id) as Record<string, unknown>;
    res.status(201).json({ card: parseCard(row) });
  } catch (err: unknown) {
    console.error("Create card error:", err);
    if ((err as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Username already taken" });
    }
    res.status(500).json({ message: "Failed to create card" });
  }
});

// Strip large base64 data URLs from layout to prevent DB size issues
function sanitizeLayout(layout: unknown): unknown {
  if (!layout || typeof layout !== "object") return layout;
  const str = JSON.stringify(layout);
  // Replace any base64 data URLs longer than 10KB with empty string
  const sanitized = str.replace(/"data:image\/[^;]+;base64,[A-Za-z0-9+/=]{10240,}"/g, '""');
  try {
    return JSON.parse(sanitized);
  } catch {
    return layout;
  }
}

// POST /api/cards/cleanup-base64 — strips large base64 images from all cards (fixes Turso size issues)
cardsRouter.post("/cleanup-base64", async (_req, res: Response) => {
  try {
    const rows = await db.prepare("SELECT id, layout FROM cards").allAsync() as { id: string; layout: string }[];
    let fixed = 0;
    for (const row of rows) {
      if (!row.layout) continue;
      const original = row.layout;
      // Check if layout contains large base64
      if (!/data:image\/[^;]+;base64,[A-Za-z0-9+/=]{10240,}/.test(original)) continue;
      const cleaned = original.replace(/"data:image\/[^;]+;base64,[A-Za-z0-9+/=]{10240,}"/g, '""');
      await db.prepare("UPDATE cards SET layout = ?, updated_at = ? WHERE id = ?")
        .runAsync(cleaned, new Date().toISOString(), row.id);
      fixed++;
    }
    res.json({ message: `Cleaned ${fixed} cards`, fixed });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ message: "Cleanup failed" });
  }
});

// PUT /api/cards/:id
cardsRouter.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { layout } = req.body;

    const existing = await db.prepare(
      "SELECT id FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.id, req.user!.id);
    if (!existing) return res.status(404).json({ message: "Card not found" });

    const cleanLayout = sanitizeLayout(layout);
    const layoutStr = JSON.stringify(cleanLayout);

    // Warn if layout is still large (Turso free tier ~1MB row limit)
    if (layoutStr.length > 800000) {
      return res.status(413).json({ message: "Card data too large. Please use Cloudinary for image uploads." });
    }

    await db.prepare(
      "UPDATE cards SET layout = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    ).runAsync(layoutStr, new Date().toISOString(), req.params.id, req.user!.id);

    const row = await db.prepare("SELECT * FROM cards WHERE id = ?").getAsync(req.params.id) as Record<string, unknown>;
    res.json({ card: parseCard(row) });
  } catch (err) {
    console.error("Update card error:", err);
    res.status(500).json({ message: "Failed to update card" });
  }
});

// POST /api/cards/:id/publish
cardsRouter.post("/:id/publish", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const row = await db.prepare(
      "SELECT id, is_published FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.id, req.user!.id) as { id: string; is_published: number | bigint | string } | undefined;
    if (!row) return res.status(404).json({ message: "Card not found" });

    const isCurrentlyPublished = row.is_published === 1 || row.is_published === 1n || row.is_published === "1";
    const newState = isCurrentlyPublished ? 0 : 1;
    await db.prepare("UPDATE cards SET is_published = ?, updated_at = ? WHERE id = ?")
      .runAsync(newState, new Date().toISOString(), req.params.id);

    const updated = await db.prepare("SELECT * FROM cards WHERE id = ?").getAsync(req.params.id) as Record<string, unknown>;
    res.json({ card: parseCard(updated) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to publish card" });
  }
});

// DELETE /api/cards/:id
cardsRouter.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const info = await db.prepare("DELETE FROM cards WHERE id = ? AND user_id = ?")
      .runAsync(req.params.id, req.user!.id);
    if (info.changes === 0) return res.status(404).json({ message: "Card not found" });
    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete card" });
  }
});

// GET /api/cards/:id/analytics
cardsRouter.get("/:id/analytics", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const card = await db.prepare(
      "SELECT id FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.id, req.user!.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const stats = await db.prepare(`
      SELECT
        COUNT(*) as total_views,
        COUNT(DISTINCT visitor_ip) as unique_views,
        SUM(CASE WHEN event_type LIKE '%_click' THEN 1 ELSE 0 END) as button_clicks,
        SUM(CASE WHEN event_type = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks,
        SUM(CASE WHEN event_type = 'call_click' THEN 1 ELSE 0 END) as call_clicks,
        SUM(CASE WHEN event_type = 'qr_scan' THEN 1 ELSE 0 END) as qr_scans
      FROM analytics WHERE card_id = ? AND event_type = 'view'
    `).getAsync(req.params.id);

    const dailyViews = await db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as views
      FROM analytics
      WHERE card_id = ? AND event_type = 'view'
        AND created_at > datetime('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date
    `).allAsync(req.params.id);

    res.json({ analytics: stats, dailyViews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// POST /api/cards/:id/track
cardsRouter.post("/:id/track", async (req, res: Response) => {
  try {
    const { event, meta } = req.body;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const ua = req.headers["user-agent"] || "";
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.prepare(
      "INSERT INTO analytics (id, card_id, event_type, visitor_ip, user_agent, meta, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).runAsync(id, req.params.id, event, ip, ua, JSON.stringify(meta || {}), now);

    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});
