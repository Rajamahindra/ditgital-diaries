import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { queryOne } from "../db";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; plan: string; isAdmin?: boolean };
}

const JWT_SECRET = process.env.JWT_SECRET || "dd-secret-key-change-in-production";

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = queryOne<{ id: string; email: string; plan: string; is_banned: number }>(
      "SELECT id, email, plan, is_banned FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.is_banned) return res.status(403).json({ message: "Account suspended" });

    req.user = { id: user.id, email: user.email, plan: user.plan };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = queryOne<{ id: string; email: string; plan: string; is_banned: number }>(
      "SELECT id, email, plan, is_banned FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.is_banned) return res.status(403).json({ message: "Account suspended" });

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    if (!adminEmails.includes(user.email)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = { id: user.id, email: user.email, plan: user.plan, isAdmin: true };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
