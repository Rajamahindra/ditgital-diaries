import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db, queryOne } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dd-secret-key-change-in-production";
const JWT_EXPIRES = "30d";

function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
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

    const existing = queryOne("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = uuidv4();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO users (id, name, email, password_hash, email_verify_token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, name.trim(), email.toLowerCase().trim(), passwordHash, verifyToken, now, now);

    const user = queryOne<{ id: string; name: string; email: string; plan: string }>(
      "SELECT id, name, email, plan FROM users WHERE id = ?", [id]
    );

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

    const user = queryOne<{
      id: string; name: string; email: string; plan: string;
      password_hash: string; is_banned: number; is_verified: number;
    }>(
      "SELECT id, name, email, plan, password_hash, is_banned, is_verified FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

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
    const user = queryOne<{ id: string; name: string; email: string; plan: string; avatar: string; is_verified: number }>(
      "SELECT id, name, email, plan, avatar, is_verified FROM users WHERE id = ?",
      [req.user!.id]
    );
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
    db.prepare("UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?")
      .run(name, email?.toLowerCase(), new Date().toISOString(), req.user!.id);
    const user = queryOne("SELECT id, name, email, plan, avatar FROM users WHERE id = ?", [req.user!.id]);
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
    const user = queryOne("SELECT id FROM users WHERE email_verify_token = ?", [token]);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    db.prepare("UPDATE users SET is_verified = 1, email_verify_token = NULL WHERE email_verify_token = ?").run(token);
    res.json({ message: "Email verified" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
});

// POST /api/auth/forgot-password
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 3600000).toISOString();

    db.prepare(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE email = ?"
    ).run(resetToken, expires, email?.toLowerCase());

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// POST /api/auth/reset-password
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const user = queryOne<{ id: string }>(
      "SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > ?",
      [token, new Date().toISOString()]
    );
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hash = await bcrypt.hash(password, 12);
    db.prepare(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?"
    ).run(hash, user.id);
    res.json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Reset failed" });
  }
});
