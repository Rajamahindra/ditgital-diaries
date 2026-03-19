import { Router, Response } from "express";
import { db, queryOne } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

export const subscriptionsRouter = Router();

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    features: ["1 digital card", "Basic templates", "Public URL", "QR code"],
    cardLimit: 1,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    currency: "INR",
    features: ["10 digital cards", "AI card generator", "Advanced analytics", "Premium templates", "Lead capture", "Download PNG/PDF/VCF"],
    cardLimit: 10,
  },
  {
    id: "business",
    name: "Business",
    price: 1499,
    currency: "INR",
    features: ["Unlimited cards", "Team profiles", "Lead CRM", "White-label", "API access", "Admin panel"],
    cardLimit: -1,
  },
];

// GET /api/subscriptions/plans
subscriptionsRouter.get("/plans", (_req, res: Response) => {
  res.json({ plans: PLANS });
});

// GET /api/subscriptions/status
subscriptionsRouter.get("/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = queryOne<{ plan: string }>("SELECT plan FROM users WHERE id = ?", [req.user!.id]);
    const subscription = db.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
    ).get(req.user!.id);
    res.json({ plan: user?.plan || "free", subscription });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// POST /api/subscriptions/subscribe
subscriptionsRouter.post("/subscribe", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body;
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ message: "Invalid plan" });

    db.prepare("UPDATE users SET plan = ?, updated_at = ? WHERE id = ?")
      .run(planId, new Date().toISOString(), req.user!.id);

    db.prepare(
      "INSERT INTO subscriptions (id, user_id, plan, status, starts_at) VALUES (?, ?, ?, 'active', ?)"
    ).run(uuidv4(), req.user!.id, planId, new Date().toISOString());

    res.json({ message: `Upgraded to ${plan.name}`, plan: planId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Subscription failed" });
  }
});
