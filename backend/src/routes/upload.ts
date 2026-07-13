import { Router, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticate, AuthRequest } from "../middleware/auth";

export const uploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

function isCloudinaryConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Compress image buffer using sharp if available
async function compressToSmallBase64(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharp = require("sharp") as any;
    const compressed = await sharp(buffer)
      .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 60, progressive: true })
      .toBuffer() as Buffer;
    return `data:image/jpeg;base64,${compressed.toString("base64")}`;
  } catch {
    // sharp not available — return raw base64
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }
}

// POST /api/upload/image
uploadRouter.post("/image", authenticate, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    // ── Cloudinary (preferred — persistent URLs, no size limits) ──────────
    if (isCloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "digital-diaries",
            transformation: [
              { width: 1200, crop: "limit", quality: "auto:good", fetch_format: "auto" },
            ],
          },
          (err, result) => {
            if (err || !result) return reject(err || new Error("Upload failed"));
            resolve(result as { secure_url: string });
          }
        );
        stream.end(req.file!.buffer);
      });

      return res.json({ url: result.secure_url, provider: "cloudinary" });
    }

    // ── Fallback: compress & return base64 ───────────────────────────────
    // WARNING: base64 images are stripped on save if >10KB — Cloudinary is required
    // for images to persist on published cards. This fallback is only for local dev.
    console.warn("⚠️  Cloudinary not configured — image stored as base64 (will not persist on published cards). Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
    const dataUrl = await compressToSmallBase64(req.file.buffer, req.file.mimetype);
    res.json({ url: dataUrl, provider: "base64", warning: "Cloudinary not configured — images will not persist on published cards" });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});
