import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";

dotenv.config();

import { runMigrations } from "./db/migrate";
import { authRouter } from "./routes/auth";
import { cardsRouter, cleanupBase64Layouts } from "./routes/cards";
import { templatesRouter } from "./routes/templates";
import { leadsRouter } from "./routes/leads";
import { aiRouter } from "./routes/ai";
import { discoverRouter } from "./routes/discover";
import { subscriptionsRouter } from "./routes/subscriptions";
import { adminRouter, publicSettingsRouter } from "./routes/admin";
import { paymentsRouter } from "./routes/payments";
import { uploadRouter } from "./routes/upload";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, skip: (req) => req.path.startsWith("/templates") || req.path.startsWith("/cards/public") || req.path.startsWith("/discover") || req.path.startsWith("/admin/public") });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/api/auth", authLimiter);
app.use("/api", limiter);

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/discover", discoverRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/admin", publicSettingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/upload", uploadRouter);

app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Digital Diaries API running on port ${PORT}`);
  try {
    await runMigrations();
    await cleanupBase64Layouts();
  } catch (err) {
    console.error("Startup tasks error:", err);
  }
});

export default app;
