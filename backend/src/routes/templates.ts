import { Router, Response } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

export const templatesRouter = Router();

const uid = () => uuidv4();
const now = () => new Date().toISOString();

function makeTheme(
  primary: string, secondary: string, accent: string, bg: string, text: string, font: string,
  dark = false, opts: Record<string, unknown> = {}
) {
  return {
    primaryColor: primary, secondaryColor: secondary, accentColor: accent,
    backgroundColor: bg, textColor: text, fontFamily: font,
    borderRadius: "14px", darkMode: dark, ...opts,
  };
}

function makeProfile(name: string, profession: string, company: string, bio: string) {
  return { id: uid(), type: "profile", position: 0, visible: true, data: { name, profession, company, bio }, styles: {} };
}
function makeContact(phone = "", email = "", whatsapp = "") {
  return { id: uid(), type: "contact_buttons", position: 1, visible: true, data: { phone, email, whatsapp }, styles: {} };
}
function makeSocial(platforms: string[]) {
  return { id: uid(), type: "social_links", position: 2, visible: true, data: { links: platforms.map(p => ({ platform: p, url: "" })) }, styles: {} };
}
function makeServices(items: { title: string; description: string; price?: string }[]) {
  return { id: uid(), type: "services", position: 3, visible: true, data: { items: items.map(i => ({ id: uid(), ...i })) }, styles: {} };
}
function makeCTA(text: string) {
  return { id: uid(), type: "cta", position: 4, visible: true, data: { text, url: "", style: "primary" }, styles: {} };
}
function makeLeadForm(title: string) {
  return { id: uid(), type: "lead_form", position: 5, visible: true, data: { title }, styles: {} };
}
function makeTestimonials() {
  return { id: uid(), type: "testimonials", position: 6, visible: true, data: { items: [{ id: uid(), name: "Client Name", role: "Client", content: "Excellent service!", rating: 5 }] }, styles: {} };
}
function makeHours() {
  return { id: uid(), type: "business_hours", position: 7, visible: true, data: { monday: "9 AM – 6 PM", tuesday: "9 AM – 6 PM", wednesday: "9 AM – 6 PM", thursday: "9 AM – 6 PM", friday: "9 AM – 6 PM", saturday: "10 AM – 2 PM", sunday: "Closed" }, styles: {} };
}
function makeMap() {
  return { id: uid(), type: "map", position: 8, visible: true, data: { address: "Your City, State", embedUrl: "" }, styles: {} };
}
function makePortfolio() {
  return { id: uid(), type: "portfolio", position: 9, visible: true, data: { items: [] }, styles: {} };
}

// ─── GLASSMORPHISM (10) ───────────────────────────────────────────────────────
const GLASS_TEMPLATES = [
  {
    name: "Glass Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "medical", "glass", "modern"],
    theme: makeTheme("#0A1628", "#38BDF8", "#818CF8", "rgba(255,255,255,0.08)", "#E0F2FE", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #0A1628 100%)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "minimal" }),
    sections: [makeProfile("Dr. Your Name", "Senior Cardiologist", "Apollo Hospitals", "15+ years of cardiac expertise. Patient-first approach."), makeContact("+91 98765 43210", "doctor@hospital.com", "+91 98765 43210"), makeServices([{ title: "Cardiac Consultation", description: "Heart health evaluation", price: "₹1,500" }, { title: "ECG & Echo", description: "Advanced diagnostics", price: "₹2,000" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Glass Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "tech", "glass", "founder"],
    theme: makeTheme("#0F0C29", "#A78BFA", "#06B6D4", "rgba(255,255,255,0.05)", "#F0F4FF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0F0C29, #302B63, #24243E)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Founder & CEO", "TechVenture Inc.", "Building AI-powered products. Ex-Google."), makeContact("+91 98765 43210", "founder@startup.com"), makeSocial(["linkedin", "twitter", "github"]), makeServices([{ title: "Advisory", description: "Strategic mentorship" }, { title: "Investment", description: "Seed funding" }]), makeCTA("Schedule a Call")],
  },
  {
    name: "Glass Photographer", category: "Photographer", is_premium: 0,
    tags: ["photographer", "glass", "creative", "portfolio"],
    theme: makeTheme("#1A0533", "#F472B6", "#A78BFA", "rgba(255,255,255,0.06)", "#FDF4FF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #1A0533, #3D1A6E, #1A0533)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Wedding Photographer", "Lens & Light Studio", "500+ weddings. Timeless moments."), makeContact("+91 98765 43210", "photo@studio.com"), makeSocial(["instagram", "youtube"]), makePortfolio(), makeCTA("Book a Session")],
  },
  {
    name: "Glass Finance", category: "Finance", is_premium: 1,
    tags: ["finance", "glass", "wealth", "investment"],
    theme: makeTheme("#001F3F", "#0EA5E9", "#38BDF8", "rgba(255,255,255,0.07)", "#E0F2FE", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #001F3F, #003366, #001F3F)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "square", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Certified Financial Planner", "WealthWise Advisory", "₹200Cr+ AUM. SEBI registered."), makeContact("+91 98765 43210", "advisor@wealth.com"), makeServices([{ title: "Wealth Management", description: "Portfolio planning" }, { title: "Tax Planning", description: "ITR & optimization" }]), makeLeadForm("Free Financial Review")],
  },
  {
    name: "Glass Architect", category: "Architect", is_premium: 1,
    tags: ["architect", "glass", "design", "modern"],
    theme: makeTheme("#0D1117", "#6366F1", "#8B5CF6", "rgba(255,255,255,0.05)", "#F0F0FF", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0D1117, #1A1F35, #0D1117)", glassEffect: true, coverStyle: "glass", cardShape: "sharp", avatarShape: "square", shadowStyle: "glow", accentStyle: "minimal" }),
    sections: [makeProfile("Ar. Your Name", "Principal Architect", "Blueprint Studio", "50+ landmark projects. Sustainable design."), makeContact("+91 98765 43210", "arch@blueprint.com"), makePortfolio(), makeServices([{ title: "Residential", description: "Villas & apartments" }, { title: "Commercial", description: "Offices & malls" }]), makeCTA("View Projects")],
  },
  {
    name: "Glass Wellness", category: "Wellness", is_premium: 0,
    tags: ["wellness", "glass", "yoga", "meditation"],
    theme: makeTheme("#0A2E1A", "#4ADE80", "#86EFAC", "rgba(255,255,255,0.06)", "#F0FFF4", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A2E1A, #134E2A, #0A2E1A)", glassEffect: true, coverStyle: "glass", cardShape: "pill", avatarShape: "circle", shadowStyle: "glow", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Yoga Instructor", "Serenity Wellness", "RYT-500 certified. 500+ students."), makeContact("+91 98765 43210", "yoga@serenity.com"), makeSocial(["instagram", "youtube"]), makeServices([{ title: "Hatha Yoga", description: "All levels", price: "₹1,200/mo" }, { title: "Meditation", description: "Mindfulness", price: "₹800/mo" }]), makeCTA("Join Free Class")],
  },
  {
    name: "Glass Fashion", category: "Fashion", is_premium: 1,
    tags: ["fashion", "glass", "luxury", "designer"],
    theme: makeTheme("#1A0A2E", "#E879F9", "#F0ABFC", "rgba(255,255,255,0.06)", "#FFF0FF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #1A0A2E, #3D1060, #1A0A2E)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Fashion Designer", "Couture by You", "Featured in Vogue India & Elle."), makeContact("+91 98765 43210", "fashion@couture.com"), makeSocial(["instagram", "pinterest"]), makePortfolio(), makeCTA("Book Consultation")],
  },
  {
    name: "Glass Engineer", category: "Engineer", is_premium: 0,
    tags: ["engineer", "glass", "developer", "tech"],
    theme: makeTheme("#0D1117", "#58A6FF", "#3FB950", "rgba(255,255,255,0.05)", "#E6EDF3", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0D1117, #161B22, #0D1117)", glassEffect: true, coverStyle: "glass", cardShape: "sharp", avatarShape: "square", shadowStyle: "glow", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Full Stack Engineer", "Open to Opportunities", "React, Node.js, AWS. 5+ years."), makeContact("+91 98765 43210", "dev@email.com"), makeSocial(["github", "linkedin", "twitter"]), makePortfolio(), makeCTA("View GitHub")],
  },
  {
    name: "Glass Events", category: "Events", is_premium: 0,
    tags: ["events", "glass", "wedding", "planner"],
    theme: makeTheme("#1A0A3E", "#C084FC", "#F0ABFC", "rgba(255,255,255,0.07)", "#FDF4FF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #1A0A3E, #2D1060, #1A0A3E)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Luxury Event Planner", "Celebrations by You", "200+ weddings. Pan-India."), makeContact("+91 98765 43210", "events@celebrations.com"), makeSocial(["instagram", "facebook"]), makeServices([{ title: "Wedding Planning", description: "Full-service" }, { title: "Corporate Events", description: "Conferences" }]), makeLeadForm("Plan Your Event")],
  },
  {
    name: "Glass Consultant", category: "Consultant", is_premium: 1,
    tags: ["consultant", "glass", "strategy", "business"],
    theme: makeTheme("#0A1628", "#0EA5E9", "#38BDF8", "rgba(255,255,255,0.06)", "#F0F9FF", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A1628, #1E3A5F, #0A1628)", glassEffect: true, coverStyle: "glass", cardShape: "rounded", avatarShape: "square", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Management Consultant", "Strategy Partners LLP", "Ex-McKinsey. 50+ companies transformed."), makeContact("+91 98765 43210", "consult@strategy.com"), makeSocial(["linkedin", "twitter"]), makeServices([{ title: "Business Strategy", description: "Growth & expansion" }, { title: "Operations", description: "Process optimization" }]), makeTestimonials(), makeCTA("Book Strategy Call")],
  },
];

// ─── NEON / CYBERPUNK (10) ────────────────────────────────────────────────────
const NEON_TEMPLATES = [
  {
    name: "Neon Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "neon", "cyberpunk", "modern"],
    theme: makeTheme("#050A0E", "#00FFF5", "#FF00FF", "#050A0E", "#00FFF5", "Inter", true,
      { backgroundStyle: "solid", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Dr. Your Name", "Neurologist", "NeuroTech Clinic", "Cutting-edge neurology. AI-assisted diagnostics."), makeContact("+91 98765 43210", "neuro@clinic.com"), makeServices([{ title: "Brain Scan", description: "AI-powered MRI analysis", price: "₹5,000" }, { title: "Consultation", description: "Expert neurological review", price: "₹2,000" }]), makeLeadForm("Book Now"), makeHours()],
  },
  {
    name: "Neon Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "neon", "cyberpunk", "tech"],
    theme: makeTheme("#0A0A0F", "#00FF88", "#FF0080", "#0A0A0F", "#00FF88", "Poppins", true,
      { backgroundStyle: "pattern", backgroundPattern: "circuit", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Founder & CEO", "CyberVenture", "Disrupting industries with AI & blockchain."), makeContact("+91 98765 43210", "ceo@cyberventure.com"), makeSocial(["linkedin", "twitter", "github"]), makeServices([{ title: "AI Solutions", description: "Custom AI development" }, { title: "Blockchain", description: "Web3 & DeFi" }]), makeCTA("Join the Revolution")],
  },
  {
    name: "Neon Photographer", category: "Photographer", is_premium: 0,
    tags: ["photographer", "neon", "cyberpunk", "creative"],
    theme: makeTheme("#0D0D1A", "#FF00FF", "#00FFFF", "#0D0D1A", "#FF00FF", "Poppins", true,
      { backgroundStyle: "solid", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Cyberpunk Photographer", "NeonLens Studio", "Capturing the future. Neon & night photography specialist."), makeContact("+91 98765 43210", "neon@lens.com"), makeSocial(["instagram", "behance"]), makePortfolio(), makeCTA("Book a Shoot")],
  },
  {
    name: "Neon Fitness", category: "Fitness", is_premium: 0,
    tags: ["fitness", "neon", "gym", "trainer"],
    theme: makeTheme("#050505", "#FF0040", "#FF8C00", "#050505", "#FF0040", "Poppins", true,
      { backgroundStyle: "pattern", backgroundPattern: "grid", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Elite Trainer", "CyberGym", "Train like a machine. NASM certified. 1000+ transformations."), makeContact("+91 98765 43210", "train@cybergym.com"), makeSocial(["instagram", "youtube"]), makeServices([{ title: "1-on-1 Training", description: "Personalized programs", price: "₹5,000/mo" }, { title: "Online Coaching", description: "Remote training", price: "₹2,500/mo" }]), makeCTA("Start Training")],
  },
  {
    name: "Neon Engineer", category: "Engineer", is_premium: 0,
    tags: ["engineer", "neon", "developer", "hacker"],
    theme: makeTheme("#000000", "#00FF41", "#00BFFF", "#000000", "#00FF41", "Inter", true,
      { backgroundStyle: "pattern", backgroundPattern: "circuit", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Security Engineer", "CyberSec Labs", "Ethical hacker. Bug bounty hunter. 100+ CVEs."), makeContact("+91 98765 43210", "hack@cybersec.com"), makeSocial(["github", "twitter", "linkedin"]), makePortfolio(), makeCTA("Hire Me")],
  },
  {
    name: "Neon Artist", category: "Artist", is_premium: 0,
    tags: ["artist", "neon", "music", "performer"],
    theme: makeTheme("#0A0010", "#FF00FF", "#7B00FF", "#0A0010", "#FF00FF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0010, #1A0030, #0A0010)", neonGlow: true, coverStyle: "neon", cardShape: "rounded", avatarShape: "circle", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Electronic Music Producer", "NeonBeats", "1M+ streams. Blending synthwave & future bass."), makeContact("+91 98765 43210", "music@neonbeats.com"), makeSocial(["instagram", "youtube", "spotify"]), makePortfolio(), makeCTA("Book for Events")],
  },
  {
    name: "Neon Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "neon", "ui", "creative"],
    theme: makeTheme("#050510", "#00FFFF", "#FF00FF", "#050510", "#00FFFF", "Poppins", true,
      { backgroundStyle: "solid", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "UI/UX Designer", "NeonPixel Studio", "Designing the future. 200+ apps shipped."), makeContact("+91 98765 43210", "design@neonpixel.com"), makeSocial(["behance", "dribbble", "linkedin"]), makePortfolio(), makeServices([{ title: "UI Design", description: "App & web interfaces" }, { title: "Brand Identity", description: "Logo & visual systems" }]), makeCTA("View Portfolio")],
  },
  {
    name: "Neon Lawyer", category: "Lawyer", is_premium: 1,
    tags: ["lawyer", "neon", "tech law", "cyber"],
    theme: makeTheme("#050A14", "#00BFFF", "#FF4500", "#050A14", "#00BFFF", "Inter", true,
      { backgroundStyle: "solid", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Adv. Your Name", "Cyber Law Specialist", "TechLaw Firm", "Specializing in cyber crime, IP & tech contracts."), makeContact("+91 98765 43210", "law@techlaw.com"), makeSocial(["linkedin", "twitter"]), makeServices([{ title: "Cyber Law", description: "Digital crime & privacy" }, { title: "IP & Patents", description: "Tech IP protection" }]), makeLeadForm("Get Legal Advice")],
  },
  {
    name: "Neon Marketing", category: "Marketing", is_premium: 0,
    tags: ["marketing", "neon", "digital", "growth"],
    theme: makeTheme("#0A0A0A", "#FF6B00", "#FF0080", "#0A0A0A", "#FF6B00", "Poppins", true,
      { backgroundStyle: "pattern", backgroundPattern: "dots", neonGlow: true, coverStyle: "neon", cardShape: "sharp", avatarShape: "square", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Growth Hacker", "NeonGrowth Agency", "0 to 1M users. Viral campaigns. Data-driven."), makeContact("+91 98765 43210", "grow@neongrowth.com"), makeSocial(["linkedin", "twitter", "instagram"]), makeServices([{ title: "Viral Marketing", description: "Explosive growth campaigns" }, { title: "Performance Ads", description: "ROI-focused advertising" }]), makeCTA("Hack Your Growth")],
  },
  {
    name: "Neon Travel", category: "Travel", is_premium: 0,
    tags: ["travel", "neon", "adventure", "cyberpunk"],
    theme: makeTheme("#050A14", "#00FFFF", "#FF00FF", "#050A14", "#00FFFF", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #050A14, #0A1428, #050A14)", neonGlow: true, coverStyle: "neon", cardShape: "rounded", avatarShape: "circle", shadowStyle: "neon", accentStyle: "cyber" }),
    sections: [makeProfile("Your Name", "Adventure Travel Guide", "NeonNomad", "50+ countries. Off-the-beaten-path specialist."), makeContact("+91 98765 43210", "travel@neonnomad.com"), makeSocial(["instagram", "youtube", "twitter"]), makeServices([{ title: "Adventure Tours", description: "Extreme travel experiences" }, { title: "Custom Itineraries", description: "Personalized journeys" }]), makeLeadForm("Plan My Adventure")],
  },
];

// ─── MINIMAL / CLEAN (10) ─────────────────────────────────────────────────────
const MINIMAL_TEMPLATES = [
  {
    name: "Minimal Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "minimal", "clean", "professional"],
    theme: makeTheme("#FFFFFF", "#2563EB", "#0EA5E9", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Dr. Your Name", "General Physician", "City Medical Center", "Compassionate care. Evidence-based medicine."), makeContact("+91 98765 43210", "doctor@clinic.com"), makeServices([{ title: "General Consultation", description: "Comprehensive health check", price: "₹500" }, { title: "Home Visit", description: "Doctor at your doorstep", price: "₹1,500" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Minimal Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "minimal", "clean", "founder"],
    theme: makeTheme("#FFFFFF", "#111827", "#6366F1", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Founder", "Startup Inc.", "Building products people love."), makeContact("+91 98765 43210", "hello@startup.com"), makeSocial(["linkedin", "twitter"]), makeServices([{ title: "Product", description: "SaaS & mobile apps" }, { title: "Consulting", description: "Tech strategy" }]), makeCTA("Let's Talk")],
  },
  {
    name: "Minimal Photographer", category: "Photographer", is_premium: 0,
    tags: ["photographer", "minimal", "clean", "portfolio"],
    theme: makeTheme("#FAFAFA", "#111827", "#6B7280", "#FAFAFA", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "circle", shadowStyle: "none", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Photographer", "Independent", "Light. Moment. Story."), makeContact("+91 98765 43210", "photo@email.com"), makeSocial(["instagram", "behance"]), makePortfolio(), makeCTA("Book a Session")],
  },
  {
    name: "Minimal Lawyer", category: "Lawyer", is_premium: 0,
    tags: ["lawyer", "minimal", "clean", "professional"],
    theme: makeTheme("#FFFFFF", "#1C1917", "#78716C", "#FFFFFF", "#1C1917", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Adv. Your Name", "Senior Advocate", "Law Chambers", "Precision. Integrity. Results."), makeContact("+91 98765 43210", "law@chambers.com"), makeServices([{ title: "Corporate Law", description: "M&A & contracts" }, { title: "Civil Litigation", description: "Court representation" }]), makeLeadForm("Schedule Consultation"), makeHours()],
  },
  {
    name: "Minimal Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "minimal", "clean", "ui"],
    theme: makeTheme("#FFFFFF", "#111827", "#F59E0B", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "circle", shadowStyle: "none", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Product Designer", "Freelance", "Less is more. Design that works."), makeContact("+91 98765 43210", "design@email.com"), makeSocial(["dribbble", "behance", "linkedin"]), makePortfolio(), makeCTA("View Work")],
  },
  {
    name: "Minimal Finance", category: "Finance", is_premium: 0,
    tags: ["finance", "minimal", "clean", "advisor"],
    theme: makeTheme("#FFFFFF", "#0F172A", "#1D4ED8", "#FFFFFF", "#0F172A", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Financial Advisor", "WealthPlan", "Simple. Transparent. Effective."), makeContact("+91 98765 43210", "advisor@wealthplan.com"), makeServices([{ title: "Investment Planning", description: "Goal-based investing" }, { title: "Tax Advisory", description: "Smart tax planning" }]), makeLeadForm("Free Consultation")],
  },
  {
    name: "Minimal Consultant", category: "Consultant", is_premium: 0,
    tags: ["consultant", "minimal", "clean", "business"],
    theme: makeTheme("#FFFFFF", "#111827", "#10B981", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Business Consultant", "Independent", "Strategy. Execution. Results."), makeContact("+91 98765 43210", "consult@email.com"), makeSocial(["linkedin"]), makeServices([{ title: "Strategy", description: "Business growth planning" }, { title: "Operations", description: "Efficiency optimization" }]), makeCTA("Book a Call")],
  },
  {
    name: "Minimal Engineer", category: "Engineer", is_premium: 0,
    tags: ["engineer", "minimal", "clean", "developer"],
    theme: makeTheme("#FFFFFF", "#111827", "#6366F1", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "none", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Software Engineer", "Open to Work", "Clean code. Scalable systems."), makeContact("+91 98765 43210", "dev@email.com"), makeSocial(["github", "linkedin"]), makePortfolio(), makeCTA("View GitHub")],
  },
  {
    name: "Minimal Wellness", category: "Wellness", is_premium: 0,
    tags: ["wellness", "minimal", "clean", "yoga"],
    theme: makeTheme("#FAFFF7", "#166534", "#4ADE80", "#FAFFF7", "#166534", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Wellness Coach", "Mindful Living", "Breathe. Move. Thrive."), makeContact("+91 98765 43210", "wellness@email.com"), makeServices([{ title: "Yoga Classes", description: "All levels welcome" }, { title: "Nutrition", description: "Holistic diet plans" }]), makeCTA("Start Your Journey")],
  },
  {
    name: "Minimal Real Estate", category: "Real Estate", is_premium: 0,
    tags: ["real estate", "minimal", "clean", "property"],
    theme: makeTheme("#FFFFFF", "#0F172A", "#10B981", "#FFFFFF", "#0F172A", "Inter", false,
      { backgroundStyle: "solid", coverStyle: "none", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Property Consultant", "Prime Realty", "Find your perfect home."), makeContact("+91 98765 43210", "agent@realty.com"), makeServices([{ title: "Residential", description: "Apartments & villas" }, { title: "Commercial", description: "Office & retail" }]), makeLeadForm("Enquire Now"), makeMap()],
  },
];

// ─── LUXURY / GOLD (10) ───────────────────────────────────────────────────────
const LUXURY_TEMPLATES = [
  {
    name: "Gold Lawyer", category: "Lawyer", is_premium: 1,
    tags: ["lawyer", "luxury", "gold", "premium"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Adv. Your Name", "Senior Advocate", "Supreme Court of India", "20+ years of legal excellence. Corporate law specialist."), makeContact("+91 98765 43210", "advocate@lawfirm.com"), makeServices([{ title: "Corporate Law", description: "M&A & compliance" }, { title: "Civil Litigation", description: "High court & supreme court" }, { title: "IPR & Patents", description: "IP protection" }]), makeLeadForm("Schedule Consultation"), makeHours()],
  },
  {
    name: "Gold Finance", category: "Finance", is_premium: 1,
    tags: ["finance", "luxury", "gold", "wealth"],
    theme: makeTheme("#0C0900", "#D4AF37", "#FFD700", "#0C0900", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0C0900, #1C1500, #0C0900)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "square", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Private Wealth Manager", "Prestige Capital", "Managing generational wealth. ₹500Cr+ AUM."), makeContact("+91 98765 43210", "wealth@prestige.com"), makeServices([{ title: "Private Banking", description: "Exclusive wealth services" }, { title: "Estate Planning", description: "Legacy & succession" }, { title: "Alternative Investments", description: "Art, real estate & PE" }]), makeLeadForm("Private Consultation")],
  },
  {
    name: "Gold Real Estate", category: "Real Estate", is_premium: 1,
    tags: ["real estate", "luxury", "gold", "premium"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Luxury Property Specialist", "Elite Realty Group", "₹1000Cr+ in luxury transactions. Ultra-premium properties."), makeContact("+91 98765 43210", "luxury@elite.com"), makeServices([{ title: "Luxury Villas", description: "₹5Cr+ properties" }, { title: "Penthouse Sales", description: "Premium high-rises" }, { title: "NRI Services", description: "International property" }]), makeLeadForm("Private Viewing"), makeMap()],
  },
  {
    name: "Gold Doctor", category: "Doctor", is_premium: 1,
    tags: ["doctor", "luxury", "gold", "premium"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Dr. Your Name", "Consultant Physician", "Prestige Medical Center", "Concierge medicine. Personalized care for discerning patients."), makeContact("+91 98765 43210", "doctor@prestige.com"), makeServices([{ title: "Executive Health Check", description: "Comprehensive screening", price: "₹25,000" }, { title: "Concierge Care", description: "24/7 personal physician", price: "₹1,00,000/yr" }]), makeLeadForm("Private Appointment"), makeHours()],
  },
  {
    name: "Gold Fashion", category: "Fashion", is_premium: 1,
    tags: ["fashion", "luxury", "gold", "couture"],
    theme: makeTheme("#0A0800", "#D4AF37", "#FFD700", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Haute Couture Designer", "Maison de Luxe", "Dressing royalty & celebrities. Bespoke luxury fashion."), makeContact("+91 98765 43210", "couture@maison.com"), makeSocial(["instagram", "pinterest"]), makePortfolio(), makeCTA("Request Appointment")],
  },
  {
    name: "Gold Architect", category: "Architect", is_premium: 1,
    tags: ["architect", "luxury", "gold", "premium"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "square", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Ar. Your Name", "Principal Architect", "Prestige Architecture", "Award-winning luxury residences. 100+ landmark projects."), makeContact("+91 98765 43210", "arch@prestige.com"), makePortfolio(), makeServices([{ title: "Luxury Residences", description: "Ultra-premium homes" }, { title: "Hospitality Design", description: "5-star hotels & resorts" }]), makeCTA("View Portfolio")],
  },
  {
    name: "Gold Consultant", category: "Consultant", is_premium: 1,
    tags: ["consultant", "luxury", "gold", "premium"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "square", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "C-Suite Advisor", "Prestige Advisory", "Trusted by Fortune 500 CEOs. Board-level strategy."), makeContact("+91 98765 43210", "advisor@prestige.com"), makeSocial(["linkedin"]), makeServices([{ title: "Board Advisory", description: "C-suite strategic counsel" }, { title: "M&A Advisory", description: "Deal structuring & execution" }]), makeCTA("Request Engagement")],
  },
  {
    name: "Gold Chef", category: "Chef", is_premium: 1,
    tags: ["chef", "luxury", "gold", "fine dining"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Chef Your Name", "Executive Chef", "The Grand Prestige", "Michelin-starred. Redefining Indian fine dining."), makeContact("+91 98765 43210", "chef@grandprestige.com"), makeServices([{ title: "Private Dining", description: "Exclusive chef's table" }, { title: "Luxury Catering", description: "Premium events" }]), makeHours(), makeLeadForm("Reserve Your Table")],
  },
  {
    name: "Gold Events", category: "Events", is_premium: 1,
    tags: ["events", "luxury", "gold", "wedding"],
    theme: makeTheme("#0A0800", "#D4AF37", "#FFD700", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Luxury Wedding Planner", "Prestige Celebrations", "Destination weddings. Royal experiences. No budget limits."), makeContact("+91 98765 43210", "luxury@prestige.com"), makeServices([{ title: "Royal Weddings", description: "Palace & heritage venues" }, { title: "Destination Events", description: "International celebrations" }]), makePortfolio(), makeLeadForm("Plan Your Dream Wedding")],
  },
  {
    name: "Gold Wellness", category: "Wellness", is_premium: 1,
    tags: ["wellness", "luxury", "gold", "spa"],
    theme: makeTheme("#0A0800", "#D4AF37", "#B8860B", "#0A0800", "#F5E6C8", "Playfair Display", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0800, #1A1400, #0A0800)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "glow", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Luxury Wellness Director", "Prestige Spa & Wellness", "Holistic luxury wellness. Ayurveda & modern therapies."), makeContact("+91 98765 43210", "wellness@prestige.com"), makeServices([{ title: "Signature Treatments", description: "Bespoke wellness rituals" }, { title: "Retreat Programs", description: "Immersive wellness journeys" }]), makeLeadForm("Book Private Session"), makeHours()],
  },
];

// ─── GRADIENT MESH (10) ───────────────────────────────────────────────────────
const GRADIENT_TEMPLATES = [
  {
    name: "Gradient Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "gradient", "colorful", "modern"],
    theme: makeTheme("#FFFFFF", "#6366F1", "#EC4899", "#FFFFFF", "#1E1B4B", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #EFF6FF 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Dr. Your Name", "Pediatrician", "Rainbow Children's Clinic", "Caring for little ones with love and expertise."), makeContact("+91 98765 43210", "doctor@rainbow.com"), makeServices([{ title: "Well-Baby Visits", description: "Growth & development check", price: "₹800" }, { title: "Vaccinations", description: "Complete immunization", price: "₹500" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Gradient Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "gradient", "colorful", "vibrant"],
    theme: makeTheme("#FFFFFF", "#8B5CF6", "#06B6D4", "#FFFFFF", "#1E1B4B", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #F5F3FF 0%, #ECFEFF 50%, #F0F9FF 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Co-Founder & CTO", "ColorStack", "Building colorful solutions to boring problems."), makeContact("+91 98765 43210", "cto@colorstack.com"), makeSocial(["linkedin", "twitter", "github"]), makeServices([{ title: "SaaS Products", description: "B2B software solutions" }, { title: "API Services", description: "Developer tools" }]), makeCTA("Try for Free")],
  },
  {
    name: "Gradient Fitness", category: "Fitness", is_premium: 0,
    tags: ["fitness", "gradient", "colorful", "energy"],
    theme: makeTheme("#FFFFFF", "#F97316", "#EF4444", "#FFFFFF", "#1C0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 50%, #FFFBEB 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Certified Trainer", "FitLife Academy", "Transform your body. Transform your life."), makeContact("+91 98765 43210", "coach@fitlife.com"), makeSocial(["instagram", "youtube"]), makeServices([{ title: "Personal Training", description: "1-on-1 sessions", price: "₹5,000/mo" }, { title: "Group Classes", description: "HIIT & strength", price: "₹2,000/mo" }]), makeCTA("Start Free Trial")],
  },
  {
    name: "Gradient Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "gradient", "colorful", "creative"],
    theme: makeTheme("#FFFFFF", "#A855F7", "#EC4899", "#FFFFFF", "#1A0A2E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 50%, #FFF0F6 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Brand Designer", "Spectrum Studio", "Colorful brands for bold businesses."), makeContact("+91 98765 43210", "design@spectrum.com"), makeSocial(["dribbble", "behance", "instagram"]), makePortfolio(), makeServices([{ title: "Brand Identity", description: "Logo & visual systems" }, { title: "UI/UX Design", description: "Digital experiences" }]), makeCTA("View Portfolio")],
  },
  {
    name: "Gradient Marketing", category: "Marketing", is_premium: 0,
    tags: ["marketing", "gradient", "colorful", "digital"],
    theme: makeTheme("#FFFFFF", "#F59E0B", "#EF4444", "#FFFFFF", "#1C0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF2F2 50%, #FFF7ED 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Digital Marketing Expert", "GrowthLab", "Scaling brands with data & creativity."), makeContact("+91 98765 43210", "grow@growthlab.com"), makeSocial(["linkedin", "instagram", "twitter"]), makeServices([{ title: "SEO & Content", description: "Organic growth" }, { title: "Paid Ads", description: "Google & Meta" }]), makeTestimonials(), makeCTA("Get Free Audit")],
  },
  {
    name: "Gradient Travel", category: "Travel", is_premium: 0,
    tags: ["travel", "gradient", "colorful", "adventure"],
    theme: makeTheme("#FFFFFF", "#0EA5E9", "#10B981", "#FFFFFF", "#0C2340", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #F0F9FF 0%, #F0FFF4 50%, #EFF6FF 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Travel Consultant", "Wanderlust Travels", "Dream destinations. Seamless journeys."), makeContact("+91 98765 43210", "travel@wanderlust.com"), makeSocial(["instagram", "facebook", "youtube"]), makeServices([{ title: "International Tours", description: "Europe, USA, Asia" }, { title: "Honeymoon Packages", description: "Romantic getaways" }]), makeLeadForm("Plan My Trip")],
  },
  {
    name: "Gradient Artist", category: "Artist", is_premium: 0,
    tags: ["artist", "gradient", "colorful", "music"],
    theme: makeTheme("#FFFFFF", "#A855F7", "#EC4899", "#FFFFFF", "#1A0A2E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 50%, #FFF0F6 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Singer & Songwriter", "Independent Artist", "Music that moves you. 1M+ streams."), makeContact("+91 98765 43210", "music@artist.com"), makeSocial(["instagram", "youtube", "spotify"]), makePortfolio(), makeCTA("Book for Events")],
  },
  {
    name: "Gradient Wellness", category: "Wellness", is_premium: 0,
    tags: ["wellness", "gradient", "colorful", "yoga"],
    theme: makeTheme("#FFFFFF", "#4ADE80", "#06B6D4", "#FFFFFF", "#0A2E1A", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #F0FFF4 0%, #ECFEFF 50%, #F0FFF4 100%)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Holistic Health Coach", "Bloom Wellness", "Nourish your body, mind & soul."), makeContact("+91 98765 43210", "bloom@wellness.com"), makeServices([{ title: "Yoga & Meditation", description: "Mind-body balance" }, { title: "Nutrition Coaching", description: "Holistic diet plans" }]), makeCTA("Start Your Journey")],
  },
  {
    name: "Gradient Events", category: "Events", is_premium: 0,
    tags: ["events", "gradient", "colorful", "celebration"],
    theme: makeTheme("#FFFFFF", "#C084FC", "#F472B6", "#FFFFFF", "#2D0A4E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FDF4FF 0%, #FFF0F6 50%, #FDF4FF 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Event Planner", "Celebrations Co.", "Making every moment magical."), makeContact("+91 98765 43210", "events@celebrations.com"), makeSocial(["instagram", "facebook"]), makeServices([{ title: "Weddings", description: "Dream wedding planning" }, { title: "Birthdays", description: "Themed parties" }]), makeLeadForm("Plan Your Event")],
  },
  {
    name: "Gradient Chef", category: "Chef", is_premium: 0,
    tags: ["chef", "gradient", "colorful", "food"],
    theme: makeTheme("#FFFFFF", "#F59E0B", "#EF4444", "#FFFFFF", "#1A0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF2F2 50%, #FFF7ED 100%)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Chef Your Name", "Executive Chef", "The Colorful Kitchen", "Farm-to-table. Bold flavors. Artful presentation."), makeContact("+91 98765 43210", "chef@colorful.com"), makeSocial(["instagram", "youtube"]), makeServices([{ title: "Private Dining", description: "Chef's table experience" }, { title: "Cooking Classes", description: "Learn to cook" }]), makeHours(), makeLeadForm("Reserve a Table")],
  },
];

// ─── GEOMETRIC / PATTERN (10) ─────────────────────────────────────────────────
const GEOMETRIC_TEMPLATES = [
  {
    name: "Geo Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "geometric", "pattern", "modern"],
    theme: makeTheme("#FFFFFF", "#0EA5E9", "#0284C7", "#FFFFFF", "#0C2340", "Inter", false,
      { backgroundStyle: "pattern", backgroundPattern: "hexagon", coverStyle: "pattern", cardShape: "sharp", avatarShape: "hexagon", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Dr. Your Name", "Orthopedic Surgeon", "Bone & Joint Center", "Precision surgery. Rapid recovery. Expert care."), makeContact("+91 98765 43210", "ortho@bonecenter.com"), makeServices([{ title: "Joint Replacement", description: "Hip & knee surgery", price: "₹2,00,000" }, { title: "Sports Injury", description: "Arthroscopic surgery", price: "₹80,000" }]), makeLeadForm("Book Consultation"), makeHours()],
  },
  {
    name: "Geo Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "geometric", "pattern", "bold"],
    theme: makeTheme("#FFFFFF", "#7C3AED", "#4F46E5", "#FFFFFF", "#1E1B4B", "Poppins", false,
      { backgroundStyle: "pattern", backgroundPattern: "grid", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Founder", "GeoTech", "Building structured solutions."), makeContact("+91 98765 43210", "founder@geotech.com"), makeSocial(["linkedin", "twitter"]), makeServices([{ title: "SaaS Platform", description: "B2B solutions" }, { title: "API Products", description: "Developer tools" }]), makeCTA("Get Started")],
  },
  {
    name: "Geo Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "geometric", "pattern", "bold"],
    theme: makeTheme("#FFFFFF", "#F59E0B", "#D97706", "#FFFFFF", "#1C0A00", "Poppins", false,
      { backgroundStyle: "pattern", backgroundPattern: "diagonal", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Graphic Designer", "GeoDesign Studio", "Bold. Structured. Impactful."), makeContact("+91 98765 43210", "design@geo.com"), makeSocial(["behance", "dribbble"]), makePortfolio(), makeCTA("View Work")],
  },
  {
    name: "Geo Fitness", category: "Fitness", is_premium: 0,
    tags: ["fitness", "geometric", "pattern", "bold"],
    theme: makeTheme("#FFFFFF", "#EF4444", "#DC2626", "#FFFFFF", "#1C0000", "Poppins", false,
      { backgroundStyle: "pattern", backgroundPattern: "topography", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Strength Coach", "GeoFit", "Structure your training. Maximize results."), makeContact("+91 98765 43210", "coach@geofit.com"), makeServices([{ title: "Strength Training", description: "Powerlifting & Olympic lifting" }, { title: "Conditioning", description: "Athletic performance" }]), makeCTA("Train With Me")],
  },
  {
    name: "Geo Architect", category: "Architect", is_premium: 0,
    tags: ["architect", "geometric", "pattern", "structural"],
    theme: makeTheme("#FFFFFF", "#374151", "#6B7280", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "pattern", backgroundPattern: "grid", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "minimal" }),
    sections: [makeProfile("Ar. Your Name", "Structural Architect", "GeoForm Studio", "Form follows function. Precision in every line."), makeContact("+91 98765 43210", "arch@geoform.com"), makePortfolio(), makeServices([{ title: "Structural Design", description: "Engineering & architecture" }, { title: "Urban Planning", description: "City & township design" }]), makeCTA("View Projects")],
  },
  {
    name: "Geo Marketing", category: "Marketing", is_premium: 0,
    tags: ["marketing", "geometric", "pattern", "bold"],
    theme: makeTheme("#FFFFFF", "#10B981", "#059669", "#FFFFFF", "#0A2E1A", "Poppins", false,
      { backgroundStyle: "pattern", backgroundPattern: "dots", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Growth Marketer", "GeoGrowth", "Data-driven. Pattern-based. Results-focused."), makeContact("+91 98765 43210", "grow@geogrowth.com"), makeServices([{ title: "Growth Strategy", description: "Systematic scaling" }, { title: "Analytics", description: "Data & insights" }]), makeCTA("Grow With Us")],
  },
  {
    name: "Geo Engineer", category: "Engineer", is_premium: 0,
    tags: ["engineer", "geometric", "pattern", "developer"],
    theme: makeTheme("#FFFFFF", "#6366F1", "#4F46E5", "#FFFFFF", "#1E1B4B", "Inter", false,
      { backgroundStyle: "pattern", backgroundPattern: "circuit", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Systems Engineer", "GeoSystems", "Architecting scalable systems."), makeContact("+91 98765 43210", "eng@geosystems.com"), makeSocial(["github", "linkedin"]), makePortfolio(), makeCTA("View Projects")],
  },
  {
    name: "Geo Real Estate", category: "Real Estate", is_premium: 0,
    tags: ["real estate", "geometric", "pattern", "property"],
    theme: makeTheme("#FFFFFF", "#0EA5E9", "#0284C7", "#FFFFFF", "#0C2340", "Inter", false,
      { backgroundStyle: "pattern", backgroundPattern: "grid", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Property Developer", "GeoRealty", "Structured investments. Geometric returns."), makeContact("+91 98765 43210", "dev@georealty.com"), makeServices([{ title: "Residential Projects", description: "Planned townships" }, { title: "Commercial Spaces", description: "Business parks" }]), makeLeadForm("Enquire Now"), makeMap()],
  },
  {
    name: "Geo Chef", category: "Chef", is_premium: 0,
    tags: ["chef", "geometric", "pattern", "food"],
    theme: makeTheme("#FFFFFF", "#F59E0B", "#D97706", "#FFFFFF", "#1A0A00", "Poppins", false,
      { backgroundStyle: "pattern", backgroundPattern: "hexagon", coverStyle: "pattern", cardShape: "sharp", avatarShape: "hexagon", shadowStyle: "hard", accentStyle: "bold" }),
    sections: [makeProfile("Chef Your Name", "Molecular Gastronomy Chef", "GeoKitchen", "Where science meets cuisine. Geometric plating."), makeContact("+91 98765 43210", "chef@geokitchen.com"), makeServices([{ title: "Tasting Menu", description: "12-course molecular experience" }, { title: "Cooking Masterclass", description: "Advanced techniques" }]), makeHours(), makeLeadForm("Reserve Your Seat")],
  },
  {
    name: "Geo Consultant", category: "Consultant", is_premium: 0,
    tags: ["consultant", "geometric", "pattern", "strategy"],
    theme: makeTheme("#FFFFFF", "#374151", "#111827", "#FFFFFF", "#111827", "Inter", false,
      { backgroundStyle: "pattern", backgroundPattern: "topography", coverStyle: "pattern", cardShape: "sharp", avatarShape: "square", shadowStyle: "hard", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Strategy Consultant", "GeoStrategy", "Mapping your path to success."), makeContact("+91 98765 43210", "strategy@geo.com"), makeServices([{ title: "Market Mapping", description: "Competitive landscape" }, { title: "Growth Blueprint", description: "Structured scaling plan" }]), makeTestimonials(), makeCTA("Get Your Blueprint")],
  },
];

// ─── RETRO / VINTAGE (10) ─────────────────────────────────────────────────────
const RETRO_TEMPLATES = [
  {
    name: "Retro Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "retro", "vintage", "classic"],
    theme: makeTheme("#FDF6E3", "#8B4513", "#D2691E", "#FDF6E3", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Dr. Your Name", "Family Physician", "Heritage Medical Clinic", "Old-school care with modern expertise. Trusted since 1990."), makeContact("+91 98765 43210", "doctor@heritage.com"), makeServices([{ title: "Family Medicine", description: "Comprehensive family care" }, { title: "Preventive Health", description: "Annual health checkups" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Retro Lawyer", category: "Lawyer", is_premium: 0,
    tags: ["lawyer", "retro", "vintage", "classic"],
    theme: makeTheme("#F5F0E8", "#5C3317", "#8B6914", "#F5F0E8", "#2C1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Adv. Your Name", "Senior Advocate", "Heritage Law Chambers", "Established 1985. Three generations of legal excellence."), makeContact("+91 98765 43210", "law@heritage.com"), makeServices([{ title: "Civil Law", description: "Property & family disputes" }, { title: "Criminal Defense", description: "Expert criminal advocacy" }]), makeLeadForm("Consult Now"), makeHours()],
  },
  {
    name: "Retro Chef", category: "Chef", is_premium: 0,
    tags: ["chef", "retro", "vintage", "traditional"],
    theme: makeTheme("#FFF8E7", "#8B4513", "#D2691E", "#FFF8E7", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Chef Your Name", "Traditional Chef", "Grandma's Kitchen", "Authentic recipes. Time-honored techniques. Soul food."), makeContact("+91 98765 43210", "chef@grandma.com"), makeSocial(["instagram", "facebook"]), makeServices([{ title: "Traditional Thali", description: "Authentic regional cuisine" }, { title: "Catering", description: "Traditional wedding feasts" }]), makeHours(), makeLeadForm("Reserve a Table")],
  },
  {
    name: "Retro Photographer", category: "Photographer", is_premium: 0,
    tags: ["photographer", "retro", "vintage", "film"],
    theme: makeTheme("#F5ECD7", "#8B6914", "#A0522D", "#F5ECD7", "#2C1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Film Photographer", "Vintage Lens Studio", "Analog photography. Film grain. Timeless memories."), makeContact("+91 98765 43210", "film@vintage.com"), makeSocial(["instagram", "behance"]), makePortfolio(), makeCTA("Book a Session")],
  },
  {
    name: "Retro Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "retro", "vintage", "graphic"],
    theme: makeTheme("#FFF8E7", "#8B4513", "#D2691E", "#FFF8E7", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Vintage Graphic Designer", "Retro Studio", "Classic design. Timeless aesthetics. Handcrafted."), makeContact("+91 98765 43210", "design@retro.com"), makeSocial(["behance", "instagram"]), makePortfolio(), makeCTA("View Portfolio")],
  },
  {
    name: "Retro Artist", category: "Artist", is_premium: 0,
    tags: ["artist", "retro", "vintage", "music"],
    theme: makeTheme("#FDF6E3", "#8B4513", "#D2691E", "#FDF6E3", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Jazz Musician", "The Vintage Stage", "Classic jazz. Timeless melodies. Live performances."), makeContact("+91 98765 43210", "jazz@vintage.com"), makeSocial(["instagram", "facebook", "youtube"]), makePortfolio(), makeCTA("Book for Events")],
  },
  {
    name: "Retro Real Estate", category: "Real Estate", is_premium: 0,
    tags: ["real estate", "retro", "vintage", "heritage"],
    theme: makeTheme("#F5F0E8", "#5C3317", "#8B6914", "#F5F0E8", "#2C1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Heritage Property Specialist", "Classic Realty", "Specializing in heritage homes & vintage properties."), makeContact("+91 98765 43210", "heritage@classic.com"), makeServices([{ title: "Heritage Homes", description: "Colonial & vintage properties" }, { title: "Restoration Projects", description: "Property renovation" }]), makeLeadForm("Enquire Now"), makeMap()],
  },
  {
    name: "Retro Fitness", category: "Fitness", is_premium: 0,
    tags: ["fitness", "retro", "vintage", "classic"],
    theme: makeTheme("#FFF8E7", "#8B4513", "#D2691E", "#FFF8E7", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Old-School Trainer", "Iron Gym Classic", "Old-school training. Proven methods. Real results."), makeContact("+91 98765 43210", "train@irongym.com"), makeServices([{ title: "Classic Bodybuilding", description: "Traditional training methods" }, { title: "Boxing", description: "Classic combat training" }]), makeCTA("Train the Old Way")],
  },
  {
    name: "Retro Consultant", category: "Consultant", is_premium: 0,
    tags: ["consultant", "retro", "vintage", "classic"],
    theme: makeTheme("#F5F0E8", "#5C3317", "#8B6914", "#F5F0E8", "#2C1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Business Advisor", "Classic Consulting", "Timeless business wisdom. Proven strategies."), makeContact("+91 98765 43210", "consult@classic.com"), makeServices([{ title: "Business Planning", description: "Traditional business strategy" }, { title: "Mentorship", description: "Wisdom & guidance" }]), makeTestimonials(), makeCTA("Get Advice")],
  },
  {
    name: "Retro Events", category: "Events", is_premium: 0,
    tags: ["events", "retro", "vintage", "classic"],
    theme: makeTheme("#FDF6E3", "#8B4513", "#D2691E", "#FDF6E3", "#3B1A08", "Georgia", false,
      { backgroundStyle: "pattern", backgroundPattern: "noise", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "hard", accentStyle: "retro" }),
    sections: [makeProfile("Your Name", "Vintage Event Planner", "Classic Celebrations", "Old-world charm. Timeless elegance. Unforgettable events."), makeContact("+91 98765 43210", "events@classic.com"), makeServices([{ title: "Vintage Weddings", description: "Classic & elegant ceremonies" }, { title: "Themed Parties", description: "Retro & vintage themes" }]), makePortfolio(), makeLeadForm("Plan Your Event")],
  },
];

// ─── DARK PROFESSIONAL (10) ───────────────────────────────────────────────────
const DARK_TEMPLATES = [
  {
    name: "Dark Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "dark", "professional", "modern"],
    theme: makeTheme("#0F172A", "#2563EB", "#06B6D4", "#0F172A", "#F8FAFC", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0F172A, #1E293B, #0F172A)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Dr. Your Name", "Senior Cardiologist", "Apollo Hospitals", "15+ years of cardiac expertise. Patient-first approach."), makeContact("+91 98765 43210", "doctor@apollo.com"), makeServices([{ title: "Cardiac Consultation", description: "Heart health evaluation", price: "₹1,500" }, { title: "ECG & Echo", description: "Advanced diagnostics", price: "₹2,000" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Dark Startup", category: "Startup", is_premium: 0,
    tags: ["startup", "dark", "professional", "tech"],
    theme: makeTheme("#0F172A", "#7C3AED", "#A855F7", "#0F172A", "#F8FAFC", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0F172A, #1E1B4B, #0F172A)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Founder & CEO", "DarkTech", "Building the future. Ex-Google, IIT."), makeContact("+91 98765 43210", "ceo@darktech.com"), makeSocial(["linkedin", "twitter", "github"]), makeServices([{ title: "AI Products", description: "Machine learning solutions" }, { title: "SaaS Platform", description: "B2B software" }]), makeCTA("Schedule a Call")],
  },
  {
    name: "Dark Finance", category: "Finance", is_premium: 0,
    tags: ["finance", "dark", "professional", "wealth"],
    theme: makeTheme("#0C1A2E", "#1D4ED8", "#0EA5E9", "#0C1A2E", "#F8FAFC", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0C1A2E, #1E3A5F, #0C1A2E)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Investment Advisor", "DarkCapital", "Sophisticated wealth management. ₹200Cr+ AUM."), makeContact("+91 98765 43210", "invest@darkcapital.com"), makeServices([{ title: "Portfolio Management", description: "Active investment strategies" }, { title: "Retirement Planning", description: "Long-term wealth building" }]), makeLeadForm("Free Consultation")],
  },
  {
    name: "Dark Architect", category: "Architect", is_premium: 0,
    tags: ["architect", "dark", "professional", "design"],
    theme: makeTheme("#111827", "#6366F1", "#8B5CF6", "#111827", "#F9FAFB", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #111827, #1F2937, #111827)", coverStyle: "gradient", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Ar. Your Name", "Principal Architect", "DarkForm Studio", "Award-winning. 50+ landmark projects."), makeContact("+91 98765 43210", "arch@darkform.com"), makePortfolio(), makeServices([{ title: "Residential", description: "Luxury homes" }, { title: "Commercial", description: "Corporate spaces" }]), makeCTA("View Projects")],
  },
  {
    name: "Dark Engineer", category: "Engineer", is_premium: 0,
    tags: ["engineer", "dark", "professional", "developer"],
    theme: makeTheme("#0D1117", "#58A6FF", "#3FB950", "#0D1117", "#E6EDF3", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0D1117, #161B22, #0D1117)", coverStyle: "gradient", cardShape: "sharp", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Full Stack Engineer", "Open to Work", "React, Node.js, AWS. 5+ years."), makeContact("+91 98765 43210", "dev@email.com"), makeSocial(["github", "linkedin", "twitter"]), makePortfolio(), makeCTA("View GitHub")],
  },
  {
    name: "Dark Consultant", category: "Consultant", is_premium: 0,
    tags: ["consultant", "dark", "professional", "strategy"],
    theme: makeTheme("#1E293B", "#0EA5E9", "#38BDF8", "#1E293B", "#F8FAFC", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #1E293B, #0F172A, #1E293B)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "square", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Management Consultant", "DarkStrategy", "Ex-McKinsey. 50+ companies transformed."), makeContact("+91 98765 43210", "consult@dark.com"), makeServices([{ title: "Business Strategy", description: "Growth planning" }, { title: "Digital Transformation", description: "Tech-driven change" }]), makeTestimonials(), makeCTA("Book Strategy Call")],
  },
  {
    name: "Dark Marketing", category: "Marketing", is_premium: 0,
    tags: ["marketing", "dark", "professional", "digital"],
    theme: makeTheme("#0F172A", "#F59E0B", "#EF4444", "#0F172A", "#F8FAFC", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0F172A, #1C1400, #0F172A)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "bold" }),
    sections: [makeProfile("Your Name", "Digital Marketing Strategist", "DarkGrowth Agency", "Scaling brands. ₹10Cr+ ad spend managed."), makeContact("+91 98765 43210", "grow@darkgrowth.com"), makeServices([{ title: "SEO & Content", description: "Organic growth" }, { title: "Paid Advertising", description: "Google & Meta Ads" }]), makeTestimonials(), makeCTA("Get Free Audit")],
  },
  {
    name: "Dark Fashion", category: "Fashion", is_premium: 1,
    tags: ["fashion", "dark", "luxury", "designer"],
    theme: makeTheme("#0A0A0A", "#E879F9", "#F0ABFC", "#0A0A0A", "#F8FAFC", "Poppins", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0A0A, #1A0A2E, #0A0A0A)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "luxury" }),
    sections: [makeProfile("Your Name", "Fashion Designer", "Dark Couture", "Dark luxury fashion. Avant-garde aesthetics."), makeContact("+91 98765 43210", "fashion@dark.com"), makeSocial(["instagram", "pinterest"]), makePortfolio(), makeCTA("Book Consultation")],
  },
  {
    name: "Dark Photographer", category: "Photographer", is_premium: 0,
    tags: ["photographer", "dark", "moody", "portrait"],
    theme: makeTheme("#0A0A0A", "#E5E7EB", "#9CA3AF", "#0A0A0A", "#F9FAFB", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A0A0A, #1A1A1A, #0A0A0A)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Fine Art Photographer", "Dark Room Studio", "Moody portraits. Dark aesthetics. Emotional storytelling."), makeContact("+91 98765 43210", "photo@darkroom.com"), makeSocial(["instagram", "behance"]), makePortfolio(), makeCTA("Book a Shoot")],
  },
  {
    name: "Dark Wellness", category: "Wellness", is_premium: 0,
    tags: ["wellness", "dark", "meditation", "mindfulness"],
    theme: makeTheme("#0A1628", "#818CF8", "#A5B4FC", "#0A1628", "#E0E7FF", "Inter", true,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #0A1628, #1E1B4B, #0A1628)", coverStyle: "gradient", cardShape: "rounded", avatarShape: "circle", shadowStyle: "soft", accentStyle: "minimal" }),
    sections: [makeProfile("Your Name", "Mindfulness Coach", "Inner Cosmos", "Deep meditation. Transformative practices."), makeContact("+91 98765 43210", "mind@cosmos.com"), makeServices([{ title: "Meditation", description: "Deep mindfulness practice" }, { title: "Sound Healing", description: "Tibetan bowl therapy" }]), makeCTA("Begin Your Journey")],
  },
];

// ─── COLORFUL / PLAYFUL (10) ──────────────────────────────────────────────────
const PLAYFUL_TEMPLATES = [
  {
    name: "Playful Doctor", category: "Doctor", is_premium: 0,
    tags: ["doctor", "playful", "colorful", "friendly"],
    theme: makeTheme("#FFFFFF", "#10B981", "#F59E0B", "#FFFFFF", "#064E3B", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #ECFDF5, #FFFBEB)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Dr. Your Name", "Pediatrician", "Happy Kids Clinic", "Making healthcare fun for children. Gentle & caring."), makeContact("+91 98765 43210", "doctor@happykids.com"), makeServices([{ title: "Well-Child Visits", description: "Fun health checkups" }, { title: "Vaccinations", description: "Painless immunization" }]), makeLeadForm("Book Appointment"), makeHours()],
  },
  {
    name: "Playful Designer", category: "Designer", is_premium: 0,
    tags: ["designer", "playful", "colorful", "fun"],
    theme: makeTheme("#FFFFFF", "#F472B6", "#A78BFA", "#FFFFFF", "#1A0A2E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFF0F6, #FAF5FF)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Illustrator & Designer", "Colorful Studio", "Bringing ideas to life with color & creativity."), makeContact("+91 98765 43210", "design@colorful.com"), makeSocial(["instagram", "behance", "dribbble"]), makePortfolio(), makeCTA("Let's Create!")],
  },
  {
    name: "Playful Fitness", category: "Fitness", is_premium: 0,
    tags: ["fitness", "playful", "colorful", "fun"],
    theme: makeTheme("#FFFFFF", "#F97316", "#FBBF24", "#FFFFFF", "#1C0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFF7ED, #FFFBEB)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Fun Fitness Coach", "Happy Gym", "Exercise should be fun! Energetic & motivating."), makeContact("+91 98765 43210", "coach@happygym.com"), makeSocial(["instagram", "youtube"]), makeServices([{ title: "Dance Fitness", description: "Zumba & dance workouts" }, { title: "Kids Fitness", description: "Fun exercise for children" }]), makeCTA("Join the Fun!")],
  },
  {
    name: "Playful Chef", category: "Chef", is_premium: 0,
    tags: ["chef", "playful", "colorful", "fun"],
    theme: makeTheme("#FFFFFF", "#EF4444", "#F59E0B", "#FFFFFF", "#1A0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FEF2F2, #FFFBEB)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Chef Your Name", "Fun Food Creator", "Yummy Kitchen", "Food that makes you smile. Colorful & delicious."), makeContact("+91 98765 43210", "chef@yummy.com"), makeSocial(["instagram", "youtube", "tiktok"]), makeServices([{ title: "Kids Cooking Classes", description: "Fun cooking for children" }, { title: "Colorful Cakes", description: "Custom celebration cakes" }]), makeHours(), makeLeadForm("Book a Class")],
  },
  {
    name: "Playful Travel", category: "Travel", is_premium: 0,
    tags: ["travel", "playful", "colorful", "adventure"],
    theme: makeTheme("#FFFFFF", "#06B6D4", "#10B981", "#FFFFFF", "#0C2340", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #ECFEFF, #F0FFF4)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Adventure Travel Guide", "Happy Travels", "Making travel fun & accessible for everyone."), makeContact("+91 98765 43210", "travel@happy.com"), makeSocial(["instagram", "youtube", "facebook"]), makeServices([{ title: "Family Tours", description: "Kid-friendly adventures" }, { title: "Budget Travel", description: "Affordable dream trips" }]), makeLeadForm("Plan My Trip")],
  },
  {
    name: "Playful Artist", category: "Artist", is_premium: 0,
    tags: ["artist", "playful", "colorful", "music"],
    theme: makeTheme("#FFFFFF", "#A855F7", "#F472B6", "#FFFFFF", "#1A0A2E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FAF5FF, #FFF0F6)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Pop Artist", "Colorful Beats", "Upbeat music. Colorful vibes. Pure joy."), makeContact("+91 98765 43210", "music@colorful.com"), makeSocial(["instagram", "youtube", "spotify", "tiktok"]), makePortfolio(), makeCTA("Stream My Music")],
  },
  {
    name: "Playful Events", category: "Events", is_premium: 0,
    tags: ["events", "playful", "colorful", "fun"],
    theme: makeTheme("#FFFFFF", "#F472B6", "#FBBF24", "#FFFFFF", "#1A0A2E", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFF0F6, #FFFBEB)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Fun Event Planner", "Party Central", "Making every celebration unforgettable & fun!"), makeContact("+91 98765 43210", "party@central.com"), makeSocial(["instagram", "facebook"]), makeServices([{ title: "Kids Parties", description: "Magical birthday parties" }, { title: "Fun Weddings", description: "Colorful celebrations" }]), makeLeadForm("Plan My Party")],
  },
  {
    name: "Playful Wellness", category: "Wellness", is_premium: 0,
    tags: ["wellness", "playful", "colorful", "yoga"],
    theme: makeTheme("#FFFFFF", "#4ADE80", "#F472B6", "#FFFFFF", "#0A2E1A", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #F0FFF4, #FFF0F6)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Joyful Yoga Teacher", "Happy Yoga Studio", "Yoga should be joyful! Fun & accessible for all."), makeContact("+91 98765 43210", "yoga@happy.com"), makeServices([{ title: "Kids Yoga", description: "Fun yoga for children" }, { title: "Laughter Yoga", description: "Joy & wellness combined" }]), makeCTA("Join the Joy!")],
  },
  {
    name: "Playful Marketing", category: "Marketing", is_premium: 0,
    tags: ["marketing", "playful", "colorful", "creative"],
    theme: makeTheme("#FFFFFF", "#F59E0B", "#A855F7", "#FFFFFF", "#1C0A00", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #FFFBEB, #FAF5FF)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Creative Marketer", "Colorful Agency", "Marketing that makes people smile & buy."), makeContact("+91 98765 43210", "create@colorful.com"), makeSocial(["instagram", "tiktok", "youtube"]), makeServices([{ title: "Social Media", description: "Fun & engaging content" }, { title: "Viral Campaigns", description: "Shareable marketing" }]), makeCTA("Let's Get Creative!")],
  },
  {
    name: "Playful Real Estate", category: "Real Estate", is_premium: 0,
    tags: ["real estate", "playful", "colorful", "friendly"],
    theme: makeTheme("#FFFFFF", "#10B981", "#F59E0B", "#FFFFFF", "#064E3B", "Poppins", false,
      { backgroundStyle: "gradient", backgroundGradient: "linear-gradient(135deg, #ECFDF5, #FFFBEB)", coverStyle: "gradient", cardShape: "pill", avatarShape: "circle", shadowStyle: "soft", accentStyle: "playful" }),
    sections: [makeProfile("Your Name", "Friendly Property Agent", "Happy Homes", "Finding your happy place. Stress-free property search."), makeContact("+91 98765 43210", "agent@happyhomes.com"), makeServices([{ title: "First Home Buyers", description: "Guided home buying" }, { title: "Rental Properties", description: "Find your perfect rental" }]), makeLeadForm("Find My Home"), makeMap()],
  },
];

// ─── COMBINE ALL TEMPLATES ────────────────────────────────────────────────────
const TEMPLATES = [
  ...GLASS_TEMPLATES,
  ...NEON_TEMPLATES,
  ...MINIMAL_TEMPLATES,
  ...LUXURY_TEMPLATES,
  ...GRADIENT_TEMPLATES,
  ...GEOMETRIC_TEMPLATES,
  ...RETRO_TEMPLATES,
  ...DARK_TEMPLATES,
  ...PLAYFUL_TEMPLATES,
];

function seedTemplates() {
  const ts = now();

  try {
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_name ON templates(name)");
  } catch { /* already exists */ }

  const existing = db.prepare("SELECT name FROM templates").all() as { name: string }[];
  const existingNames = new Set(existing.map((r) => r.name));

  const insert = db.prepare(
    "INSERT INTO templates (id, name, category, thumbnail, layout, is_premium, tags, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const update = db.prepare(
    "UPDATE templates SET category=?, layout=?, is_premium=?, tags=? WHERE name=?"
  );

  let inserted = 0, updated = 0;
  for (const t of TEMPLATES) {
    const layout = JSON.stringify({ sections: t.sections, theme: t.theme, meta: { title: `${t.name} Card`, description: "" } });
    const tags = JSON.stringify(t.tags);
    if (existingNames.has(t.name)) {
      update.run(t.category, layout, t.is_premium, tags, t.name);
      updated++;
    } else {
      insert.run(uid(), t.name, t.category, "", layout, t.is_premium, tags, ts);
      inserted++;
    }
  }
  console.log(`✅ Templates: ${inserted} inserted, ${updated} updated (${TEMPLATES.length} total)`);
}

try { seedTemplates(); } catch (e) { console.error("Template seed error:", e); }

// GET /api/templates
templatesRouter.get("/", async (req, res: Response) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const { category } = req.query;
    const rows = category
      ? db.prepare("SELECT * FROM templates WHERE category = ? ORDER BY name ASC").all(category)
      : db.prepare("SELECT * FROM templates ORDER BY name ASC").all();

    const templates = (rows as Record<string, unknown>[]).map((t) => ({
      ...t,
      layout: typeof t.layout === "string" ? JSON.parse(t.layout as string) : t.layout,
      tags: typeof t.tags === "string" ? JSON.parse(t.tags as string) : t.tags,
      isPremium: !!t.is_premium,
    }));

    res.json({ templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});

// GET /api/templates/:id
templatesRouter.get("/:id", async (req, res: Response) => {
  try {
    const row = db.prepare("SELECT * FROM templates WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
    if (!row) return res.status(404).json({ message: "Template not found" });
    res.json({
      template: {
        ...row,
        layout: typeof row.layout === "string" ? JSON.parse(row.layout as string) : row.layout,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags as string) : row.tags,
        isPremium: !!row.is_premium,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch template" });
  }
});
