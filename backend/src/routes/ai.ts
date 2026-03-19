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
  const isDoctor = lower.includes("doctor") || lower.includes("medical") || lower.includes("cardiolog") || lower.includes("physician");
  const isPhotographer = lower.includes("photographer") || lower.includes("photography");
  const isLawyer = lower.includes("lawyer") || lower.includes("legal") || lower.includes("attorney");
  const isEngineer = lower.includes("engineer") || lower.includes("developer") || lower.includes("software");

  const profession = isDoctor ? "Cardiologist" : isPhotographer ? "Photographer" : isLawyer ? "Advocate" : isEngineer ? "Software Engineer" : "Professional";
  const name = isDoctor ? "Dr. Arjun Sharma" : isPhotographer ? "Priya Kapoor" : isLawyer ? "Adv. Rahul Mehta" : "Your Name";
  const company = isDoctor ? "Apollo Hospitals" : isPhotographer ? "Priya Studios" : isLawyer ? "Mehta & Associates" : "Your Company";
  const bio = isDoctor
    ? "15+ years of experience in interventional cardiology. Committed to providing world-class cardiac care to every patient."
    : isPhotographer
    ? "Award-winning photographer specializing in portraits, weddings, and commercial photography."
    : isLawyer
    ? "Experienced advocate with expertise in corporate law, civil litigation, and contract disputes."
    : "Dedicated professional with years of experience delivering excellence in every project.";

  const services = isDoctor
    ? [
        { id: uuidv4(), title: "Cardiac Consultation", description: "Comprehensive heart health evaluation", price: "₹1,500" },
        { id: uuidv4(), title: "ECG & Echo", description: "Advanced cardiac diagnostics", price: "₹2,000" },
        { id: uuidv4(), title: "Preventive Cardiology", description: "Heart disease prevention program", price: "₹1,000" },
      ]
    : isPhotographer
    ? [
        { id: uuidv4(), title: "Portrait Session", description: "Professional portrait photography", price: "₹5,000" },
        { id: uuidv4(), title: "Wedding Photography", description: "Full day wedding coverage", price: "₹25,000" },
        { id: uuidv4(), title: "Product Photography", description: "Commercial product shoots", price: "₹8,000" },
      ]
    : [
        { id: uuidv4(), title: "Service 1", description: "Professional service description", price: "" },
        { id: uuidv4(), title: "Service 2", description: "Another great service", price: "" },
      ];

  const secondaryColor = isDoctor ? "#2563EB" : isPhotographer ? "#EC4899" : isLawyer ? "#92400E" : "#2563EB";
  const accentColor = isDoctor ? "#7C3AED" : isPhotographer ? "#F97316" : isLawyer ? "#D97706" : "#7C3AED";

  return {
    layout: {
      sections: [
        { id: uuidv4(), type: "profile", position: 0, visible: true, data: { name, profession, company, bio }, styles: {} },
        { id: uuidv4(), type: "contact_buttons", position: 1, visible: true, data: { phone: "+91 98765 43210", email: "contact@example.com", whatsapp: "+91 98765 43210" }, styles: {} },
        { id: uuidv4(), type: "services", position: 2, visible: true, data: { items: services }, styles: {} },
        { id: uuidv4(), type: "social_links", position: 3, visible: true, data: { links: [{ platform: "instagram", url: "" }, { platform: "linkedin", url: "" }] }, styles: {} },
        { id: uuidv4(), type: "lead_form", position: 4, visible: true, data: { title: isDoctor ? "Book an Appointment" : "Get in Touch" }, styles: {} },
      ],
      theme: {
        primaryColor: "#0F172A",
        secondaryColor,
        accentColor,
        backgroundColor: "#FFFFFF",
        textColor: "#0F172A",
        fontFamily: "Inter",
        borderRadius: "12px",
        darkMode: false,
      },
      meta: {
        title: `${name} — ${profession}`,
        description: bio.slice(0, 120),
      },
    },
  };
}

// POST /api/ai/generate-card
aiRouter.post("/generate-card", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt required" });

    const systemPrompt = `You are an AI that generates professional digital card layouts for Digital Diaries platform.
Generate a complete card layout as JSON with this exact structure:
{
  "layout": {
    "sections": [array of sections with id (uuid), type, position (number), visible (true), data (object), styles ({})],
    "theme": { "primaryColor": "#hex", "secondaryColor": "#hex", "accentColor": "#hex", "backgroundColor": "#hex", "textColor": "#hex", "fontFamily": "Inter", "borderRadius": "12px", "darkMode": false },
    "meta": { "title": "string", "description": "string" }
  }
}
Section types available: profile, contact_buttons, social_links, services, portfolio, testimonials, lead_form, cta, map, business_hours.
Make it professional, complete, and relevant to the user's profession and location.`;

    const response = await callAI(systemPrompt, prompt);
    const parsed = JSON.parse(response);

    db.prepare(
      "INSERT INTO ai_requests (id, user_id, prompt, response, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(uuidv4(), req.user!.id, prompt, JSON.stringify(parsed), new Date().toISOString());

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
      section: `Improve this card section based on: ${JSON.stringify(context)}. Return the improved layout JSON.`,
    };

    const userPrompt = prompts[type] || `Generate content for type "${type}": ${JSON.stringify(context)}`;
    const response = await callAI(
      "You are a professional content writer for digital business cards. Return valid JSON only.",
      userPrompt
    );

    res.json(JSON.parse(response));
  } catch (err) {
    console.error("AI content error:", err);
    res.status(500).json({ message: "Content generation failed" });
  }
});

// POST /api/ai/suggest-design
aiRouter.post("/suggest-design", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const suggestions = [
      "Add a WhatsApp button for instant messaging",
      "Include a portfolio section to showcase your work",
      "Add business hours to let clients know your availability",
      "Include a lead form to capture potential clients",
      "Add testimonials to build trust with visitors",
    ];
    res.json({ suggestions: suggestions.slice(0, 3) });
  } catch {
    res.status(500).json({ message: "Failed to generate suggestions" });
  }
});
