import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

export const aiRouter = Router();

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return JSON.stringify(getMockCardLayout(userPrompt));
  }
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });
    return completion.choices[0].message.content || "{}";
  } catch (err) {
    console.error("OpenAI error, falling back to mock:", err);
    return JSON.stringify(getMockCardLayout(userPrompt));
  }
}

function getMockCardLayout(prompt: string) {
  const lower = prompt.toLowerCase();
  const isDoctor = lower.includes("doctor") || lower.includes("medical");
  const isPhotographer = lower.includes("photographer") || lower.includes("photography");
  const isLawyer = lower.includes("lawyer") || lower.includes("legal");
  const isEngineer = lower.includes("engineer") || lower.includes("developer");

  const profession = isDoctor ? "Cardiologist" : isPhotographer ? "Photographer" : isLawyer ? "Advocate" : isEngineer ? "Software Engineer" : "Professional";
  const name = isDoctor ? "Dr. Arjun Sharma" : isPhotographer ? "Priya Kapoor" : isLawyer ? "Adv. Rahul Mehta" : "Your Name";
  const company = isDoctor ? "Apollo Hospitals" : isPhotographer ? "Priya Studios" : isLawyer ? "Mehta & Associates" : "Your Company";
  const bio = isDoctor
    ? "15+ years of experience in interventional cardiology."
    : isPhotographer
    ? "Award-winning photographer specializing in portraits and weddings."
    : isLawyer
    ? "Experienced advocate with expertise in corporate law."
    : "Dedicated professional delivering excellence in every project.";

  const secondaryColor = isDoctor ? "#2563EB" : isPhotographer ? "#EC4899" : isLawyer ? "#92400E" : "#2563EB";
  const accentColor = isDoctor ? "#7C3AED" : isPhotographer ? "#F97316" : isLawyer ? "#D97706" : "#7C3AED";

  return {
    layout: {
      sections: [
        { id: uuidv4(), type: "profile", position: 0, visible: true, data: { name, profession, company, bio }, styles: {} },
        { id: uuidv4(), type: "contact_buttons", position: 1, visible: true, data: { phone: "+91 98765 43210", email: "contact@example.com", whatsapp: "+91 98765 43210" }, styles: {} },
        { id: uuidv4(), type: "social_links", position: 2, visible: true, data: { links: [{ platform: "instagram", url: "" }, { platform: "linkedin", url: "" }] }, styles: {} },
        { id: uuidv4(), type: "lead_form", position: 3, visible: true, data: { title: isDoctor ? "Book an Appointment" : "Get in Touch" }, styles: {} },
      ],
      theme: {
        primaryColor: "#0F172A",
        secondaryColor: secondaryColor,
        accentColor: accentColor,
        backgroundColor: "#FFFFFF",
        textColor: "#0F172A",
        fontFamily: "Inter",
        borderRadius: "12px",
        darkMode: false,
      },
      meta: { title: name + " - " + profession, description: bio.slice(0, 120) },
    },
  };
}

// POST /api/ai/generate-card
aiRouter.post("/generate-card", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt required" });

    const systemPrompt = `You are an AI that generates professional digital card layouts. Return JSON with layout.sections, layout.theme, layout.meta.`;
    const response = await callAI(systemPrompt, prompt);
    const parsed = JSON.parse(response);

    await db.prepare(
      "INSERT INTO ai_requests (id, user_id, prompt, response, created_at) VALUES (?, ?, ?, ?, ?)"
    ).runAsync(uuidv4(), req.user!.id, prompt, JSON.stringify(parsed), new Date().toISOString());

    res.json(parsed);
  } catch (err) {
    console.error("AI generate error:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
});

// POST /api/ai/generate-content
aiRouter.post("/generate-content", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type, context } = req.body;
    const prompts: Record<string, string> = {
      bio: `Generate a professional bio for: ${JSON.stringify(context)}. Return JSON: { "bio": "..." }`,
      services: `Generate 3-5 professional services for: ${JSON.stringify(context)}. Return JSON: { "services": [...] }`,
      tagline: `Generate a professional tagline for: ${JSON.stringify(context)}. Return JSON: { "tagline": "..." }`,
    };
    const userPrompt = prompts[type] || `Generate content for type "${type}": ${JSON.stringify(context)}`;
    const response = await callAI("You are a professional content writer for digital business cards. Return valid JSON only.", userPrompt);
    res.json(JSON.parse(response));
  } catch (err) {
    console.error("AI content error:", err);
    res.status(500).json({ message: "Content generation failed" });
  }
});

// POST /api/ai/suggest-design
aiRouter.post("/suggest-design", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    res.json({ suggestions: ["Add a WhatsApp button", "Include a portfolio section", "Add business hours"] });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});