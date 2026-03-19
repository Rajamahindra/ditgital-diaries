import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";

dotenv.config();

import { authRouter } from "./routes/auth";
import { cardsRouter } from "./routes/cards";
import { templatesRouter } from "./routes/templates";
import { leadsRouter } from "./routes/leads";
import { aiRouter } from "./routes/ai";
import { discoverRouter } from "./routes/discover";
import { subscriptionsRouter } from "./routes/subscriptions";
import { adminRouter, publicSettingsRouter } from "./routes/admin";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

// Security & middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.ADMIN_URL || "http://localhost:3001",
    ].filter(Boolean);
    // Allow requests with no origin (mobile apps, curl, etc) or matching origins
    if (!origin || allowed.some(o => origin.startsWith(o)) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // allow all for now, tighten after confirming URLs
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use("/api/auth", authLimiter);
app.use("/api", limiter);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/discover", discoverRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/admin", publicSettingsRouter);
app.use("/api/admin", adminRouter);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Digital Diaries API running on port ${PORT}`);
});

export default app;
