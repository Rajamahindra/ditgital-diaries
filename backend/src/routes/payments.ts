import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const paymentsRouter = Router();

// Razorpay is loaded lazily so missing keys don't crash startup
function getRazorpay() {
  const Razorpay = require("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const PLAN_AMOUNTS: Record<string, number> = {
  pro: 49900,       // ₹499 in paise
  business: 149900, // ₹1499 in paise
};

// POST /api/payments/create-order
paymentsRouter.post("/create-order", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body;
    const amount = PLAN_AMOUNTS[planId];
    if (!amount) return res.status(400).json({ message: "Invalid plan" });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payment gateway not configured" });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `dd_${uuidv4().slice(0, 8)}`,
      notes: { userId: req.user!.id, planId },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// POST /api/payments/verify
paymentsRouter.post("/verify", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Upgrade user plan
    await db.prepare("UPDATE users SET plan = ?, updated_at = ? WHERE id = ?")
      .runAsync(planId, new Date().toISOString(), req.user!.id);

    await db.prepare(
      "INSERT INTO subscriptions (id, user_id, plan, status, starts_at, payment_id) VALUES (?, ?, ?, 'active', ?, ?)"
    ).runAsync(uuidv4(), req.user!.id, planId, new Date().toISOString(), razorpay_payment_id);

    res.json({ message: "Payment successful", plan: planId });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});
