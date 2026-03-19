import { Router, Response } from "express";
import { db } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

export const leadsRouter = Router();

// GET /api/leads/:cardId
leadsRouter.get("/:cardId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const card = await db.prepare(
      "SELECT id FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.cardId, req.user!.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const leads = await db.prepare(
      "SELECT * FROM leads WHERE card_id = ? ORDER BY created_at DESC"
    ).allAsync(req.params.cardId);

    res.json({ leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// POST /api/leads/:cardId
leadsRouter.post("/:cardId", async (req, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const card = await db.prepare(
      "SELECT id FROM cards WHERE id = ? AND is_published = 1"
    ).getAsync(req.params.cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.prepare(
      "INSERT INTO leads (id, card_id, name, phone, email, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).runAsync(id, req.params.cardId, name, phone || null, email || null, message || null, now);

    const lead = await db.prepare("SELECT * FROM leads WHERE id = ?").getAsync(id);
    res.status(201).json({ lead, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit lead" });
  }
});

// PATCH /api/leads/:cardId/:leadId/read
leadsRouter.patch("/:cardId/:leadId/read", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const card = await db.prepare(
      "SELECT id FROM cards WHERE id = ? AND user_id = ?"
    ).getAsync(req.params.cardId, req.user!.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    await db.prepare("UPDATE leads SET is_read = 1 WHERE id = ? AND card_id = ?")
      .runAsync(req.params.leadId, req.params.cardId);
    res.json({ message: "Marked as read" });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});
