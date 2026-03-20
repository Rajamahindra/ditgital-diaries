import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { db } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dd-secret-key-change-in-production";
const JWT_EXPIRES = "30d";

function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function getMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOTPEmail(email: string, otp: string, name: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }
  const mailer = getMailer();
  await mailer.sendMail({
    from: `"Digital Diaries" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Password Reset OTP — Digital Diaries",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <h2 style="color:#0F172A;margin-bottom:8px;">Password Reset</h2>
        <p style="color:#64748b;">Hi ${name}, use the OTP below to reset your password. It expires in 10 minutes.</p>
        <div style="background:#0F172A;color:#fff;font-size:36px;font-weight:900;letter-spacing:12px;text-align:center;padding:24px;border-radius:12px;margin:24px 0;">
          ${otp}
        </div>
        <p style="color:#94a3b8;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

// POST /api/auth/register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").getAsync(email.toLowerCase());
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = uuidv4();
    const now = new Date().toISOString();

    await db.prepare(
      `INSERT INTO users (id, name, email, password_hash, email_verify_token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).runAsync(id, name.trim(), email.toLowerCase().trim(), passwordHash, verifyToken, now, now);

    const user = await db.prepare(
      "SELECT id, name, email, plan FROM users WHERE id = ?"
    ).getAsync(id) as { id: string; name: string; email: string; plan: string } | undefined;

    const token = signToken(id);
    res.status(201).json({ message: "Account created", token, user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await db.prepare(
      "SELECT id, name, email, plan, password_hash, is_banned, is_verified FROM users WHERE email = ?"
    ).getAsync(email.toLowerCase()) as {
      id: string; name: string; email: string; plan: string;
      password_hash: string; is_banned: number; is_verified: number;
    } | undefined;

    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (user.is_banned) return res.status(403).json({ message: "Account suspended" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user.id);
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: { ...safeUser, isVerified: !!safeUser.is_verified } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
authRouter.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.prepare(
      "SELECT id, name, email, plan, avatar, is_verified FROM users WHERE id = ?"
    ).getAsync(req.user!.id) as { id: string; name: string; email: string; plan: string; avatar: string; is_verified: number } | undefined;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { ...user, isVerified: !!user.is_verified } });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// PUT /api/auth/profile
authRouter.put("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    await db.prepare("UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?")
      .runAsync(name, email?.toLowerCase(), new Date().toISOString(), req.user!.id);
    const user = await db.prepare(
      "SELECT id, name, email, plan, avatar FROM users WHERE id = ?"
    ).getAsync(req.user!.id);
    res.json({ user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// POST /api/auth/verify-email
authRouter.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await db.prepare("SELECT id FROM users WHERE email_verify_token = ?").getAsync(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    await db.prepare("UPDATE users SET is_verified = 1, email_verify_token = NULL WHERE email_verify_token = ?").runAsync(token);
    res.json({ message: "Email verified" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
});

// POST /api/auth/forgot-password — sends OTP to email
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await db.prepare(
      "SELECT id, name, email FROM users WHERE email = ?"
    ).getAsync(email.toLowerCase()) as { id: string; name: string; email: string } | undefined;

    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: "If that email exists, an OTP has been sent." });

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    await db.prepare(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?"
    ).runAsync(otp, expires, user.id);

    await sendOTPEmail(user.email, otp, user.name);
    res.json({ message: "If that email exists, an OTP has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp — verify OTP, return a short-lived reset token
authRouter.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await db.prepare(
      "SELECT id FROM users WHERE email = ? AND password_reset_token = ? AND password_reset_expires > ?"
    ).getAsync(email.toLowerCase(), otp, new Date().toISOString()) as { id: string } | undefined;

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Issue a short-lived reset token
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await db.prepare(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?"
    ).runAsync(resetToken, expires, user.id);

    res.json({ resetToken });
  } catch {
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// POST /api/auth/reset-password
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and password required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const user = await db.prepare(
      "SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > ?"
    ).getAsync(token, new Date().toISOString()) as { id: string } | undefined;
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hash = await bcrypt.hash(password, 12);
    await db.prepare(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?"
    ).runAsync(hash, user.id);
    res.json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Reset failed" });
  }
});
