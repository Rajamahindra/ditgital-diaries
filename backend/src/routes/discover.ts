import { Router, Response } from "express";
import { db } from "../db";

export const discoverRouter = Router();

// GET /api/discover
discoverRouter.get("/", async (req, res: Response) => {
  try {
    const { q, location, category, page = "1", limit = "20" } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build WHERE conditions — search inside layout JSON for profession/name/company/location
    const conditions: string[] = ["is_published = 1", "is_active = 1"];
    const params: unknown[] = [];

    if (q) {
      conditions.push("(username LIKE ? OR layout LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (location) {
      conditions.push("layout LIKE ?");
      params.push(`%${location}%`);
    }
    if (category && category !== "All") {
      conditions.push("layout LIKE ?");
      params.push(`%${category}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    params.push(parseInt(limit as string), offset);

    const rows = await db.prepare(
      `SELECT id, username, unique_id, layout, created_at FROM cards ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).allAsync(...params);

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
