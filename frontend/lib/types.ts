// ─── Card Section Types ───────────────────────────────────────────────────────

export type SectionType =
  | "profile"
  | "contact_buttons"
  | "social_links"
  | "services"
  | "portfolio"
  | "testimonials"
  | "business_hours"
  | "map"
  | "cta"
  | "lead_form"
  | "text"
  | "image"
  | "video"
  | "gallery"
  | "custom_html";

export interface CardSection {
  id: string;
  type: SectionType;
  position: number;
  visible: boolean;
  data: Record<string, unknown>;
  styles: SectionStyles;
}

export interface SectionStyles {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  shadow?: string;
  animation?: string;
}

// ─── Card Layout (stored as JSON in DB) ──────────────────────────────────────

export interface CardLayout {
  sections: CardSection[];
  theme: CardTheme;
  meta: CardMeta;
}

export interface CardTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  darkMode: boolean;
  // Visual style extensions
  backgroundStyle?: "solid" | "gradient" | "mesh" | "pattern" | "image";
  backgroundPattern?: "dots" | "grid" | "waves" | "hexagon" | "circuit" | "marble" | "wood" | "noise" | "diagonal" | "topography";
  backgroundGradient?: string; // CSS gradient string
  coverStyle?: "gradient" | "pattern" | "image" | "none" | "glass" | "neon";
  cardShape?: "rounded" | "sharp" | "pill";
  avatarShape?: "circle" | "square" | "hexagon";
  glassEffect?: boolean;
  neonGlow?: boolean;
  shadowStyle?: "none" | "soft" | "hard" | "glow" | "neon";
  accentStyle?: "minimal" | "bold" | "luxury" | "playful" | "retro" | "cyber";
}

export interface CardMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
}

// ─── Card Entity ──────────────────────────────────────────────────────────────

export interface Card {
  id: string;
  uniqueId: string; // DD-2026-000001
  username: string;
  userId: string;
  layout: CardLayout;
  isPublished: boolean;
  isActive: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  analytics?: CardAnalytics;
}

export interface CardAnalytics {
  totalViews: number;
  uniqueViews: number;
  buttonClicks: number;
  whatsappClicks: number;
  callClicks: number;
  emailClicks: number;
  qrScans: number;
  linkClicks: number;
}

// ─── User Entity ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "business";
  isVerified?: boolean;
  is_verified?: number;
  is_banned?: number;
  createdAt?: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  layout: CardLayout;
  isPremium: boolean;
  tags: string[];
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  cardId: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  isRead?: boolean;
  createdAt: string;
}

// ─── Profile Section Data ─────────────────────────────────────────────────────

export interface ProfileData {
  name: string;
  profession: string;
  company: string;
  bio: string;
  photo?: string;
  logo?: string;
  tagline?: string;
}

export interface ContactButtonData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}
