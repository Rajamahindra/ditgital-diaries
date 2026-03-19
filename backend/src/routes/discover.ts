import { Router, Response } from "express";
import { db } from "../db";

export const discoverRouter = Router();

// GET /api/discover
discoverRouter.get("/", async (req, res: Response) => {
  try {
    const { q, page = "1", limit = "20" } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let rows;
    if (q) {
      rows = db.prepare(
        `SELECT id, username, unique_id, layout, created_at FROM cards
         WHERE is_published = 1 AND is_active = 1
           AND (username LIKE ? OR layout LIKE ?)
         ORDER BY created_at DESC LIMIT ? OFFSET ?`
      ).all(`%${q}%`, `%${q}%`, parseInt(limit as string), offset);
    } else {
      rows = db.prepare(
        `SELECT id, username, unique_id, layout, created_at FROM cards
         WHERE is_published = 1 AND is_active = 1
         ORDER BY created_at DESC LIMIT ? OFFSET ?`
      ).all(parseInt(limit as string), offset);
    }

    const cards = (rows as Record<string, unknown>[]).map((c) => ({
      ...c,
      layout: typeof c.layout === "string" ? JSON.parse(c.layout as string) : c.layout,
    }));

    res.json({ cards, page: parseInt(page as string) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});
