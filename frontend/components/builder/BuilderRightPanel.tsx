"use client";

import { useState, useRef } from "react";
import { useBuilderStore } from "@/lib/store";
import { SECTION_LABELS } from "@/lib/utils";
import { Palette, Type, Layout, Plus, Trash2, Camera, ImageIcon, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const FONT_OPTIONS = ["Inter", "Poppins", "Roboto", "Playfair Display", "Montserrat", "Lato", "Nunito"];
const RADIUS_OPTIONS = ["0px", "6px", "10px", "14px", "20px", "9999px"];

const inputCls = "w-full text-xs bg-gray-50 dark:bg-primary/50 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-secondary/40 placeholder-gray-300 dark:placeholder-white/20";
const labelCls = "text-xs text-gray-400 dark:text-white/40 block mb-1";

function ColorRow({ label, themeKey }: { label: string; themeKey: string }) {
  const { layout, updateTheme } = useBuilderStore();
  const value = layout.theme[themeKey as keyof typeof layout.theme] as string;
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500 dark:text-white/50">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-white/30 font-mono text-right w-16 truncate">{value}</span>
        <input type="color" value={value}
          onChange={(e) => updateTheme({ [themeKey]: e.target.value })}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer p-0.5 bg-transparent" />
      </div>
    </div>
  );
}

async function uploadImageFallback(file: File): Promise<string> {
  // Compress to base64 as last resort (small size)
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas failed"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function ImageUploadField({ label, value, onChange, icon, aspectClass }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  icon: React.ReactNode;
  aspectClass: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Try to upload to backend first, fallback to compressed base64
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const { default: Cookies } = await import("js-cookie");
      const token = Cookies.get("dd_token");

      const form = new FormData();
      form.append("image", file);

      const res = await fetch(`${apiUrl}/api/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        // Fallback: compress and store as base64 (small)
        const b64 = await uploadImageFallback(file);
        onChange(b64);
      }
    } catch {
      // Final fallback
      try {
        const b64 = await uploadImageFallback(file);
        onChange(b64);
      } catch {
        // ignore
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative w-full ${aspectClass} rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 overflow-hidden cursor-pointer group hover:border-secondary/50 transition-all`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-300 dark:text-white/20">
            <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Uploading...</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-300 dark:text-white/20">
            {icon}
            <span className="text-xs">Click to upload</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function SectionEditor({ section }: { section: ReturnType<typeof useBuilderStore.getState>["layout"]["sections"][0] }) {
  const { updateSection } = useBuilderStore();
  const update = (key: string, value: unknown) => updateSection(section.id, { [key]: value });

  switch (section.type) {
    case "profile":
      return (
        <div className="space-y-3">
          {/* Banner upload */}
          <ImageUploadField
            label="Banner / Cover Photo"
            value={(section.data.banner as string) || ""}
            onChange={(url) => update("banner", url)}
            icon={<ImageIcon className="w-6 h-6" />}
            aspectClass="h-20"
          />
          {/* Profile photo upload */}
          <ImageUploadField
            label="Profile Photo"
            value={(section.data.photo as string) || ""}
            onChange={(url) => update("photo", url)}
            icon={<Camera className="w-6 h-6" />}
            aspectClass="h-24"
          />
          {[
            { key: "name", label: "Full Name", placeholder: "Dr. Your Name" },
            { key: "profession", label: "Profession", placeholder: "e.g. Cardiologist" },
            { key: "company", label: "Company / Hospital", placeholder: "e.g. Apollo Hospitals" },
            { key: "tagline", label: "Tagline", placeholder: "e.g. 15+ years of expertise" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input value={(section.data[key] as string) || ""} onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder} className={inputCls} />
            </div>
          ))}
          <div>
            <label className={labelCls}>Bio</label>
            <textarea value={(section.data.bio as string) || ""} onChange={(e) => update("bio", e.target.value)}
              placeholder="Write your professional bio..." className={`${inputCls} resize-none min-h-[80px]`} />
          </div>
        </div>
      );

    case "contact_buttons":
      return (
        <div className="space-y-3">
          {[
            { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
            { key: "email", label: "Email", placeholder: "you@example.com" },
            { key: "whatsapp", label: "WhatsApp", placeholder: "+91 98765 43210" },
            { key: "address", label: "Address", placeholder: "City, State" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input value={(section.data[key] as string) || ""} onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder} className={inputCls} />
            </div>
          ))}
        </div>
      );

    case "social_links": {
      const links = (section.data.links as { platform: string; url: string }[]) || [];
      const PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "twitter", "telegram", "github", "website", "tiktok", "spotify"];
      return (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="space-y-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <select value={link.platform}
                  onChange={(e) => { const updated = [...links]; updated[i] = { ...link, platform: e.target.value }; update("links", updated); }}
                  className={`${inputCls} flex-1 mr-2`}>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <button onClick={() => update("links", links.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input value={link.url} onChange={(e) => { const updated = [...links]; updated[i] = { ...link, url: e.target.value }; update("links", updated); }}
                placeholder="https://..." className={inputCls} />
            </div>
          ))}
          <button onClick={() => update("links", [...links, { platform: "instagram", url: "" }])}
            className="w-full text-xs text-secondary border border-secondary/30 hover:bg-secondary/10 rounded-lg py-2 flex items-center justify-center gap-1.5 transition-all">
            <Plus className="w-3 h-3" /> Add Social Link
          </button>
        </div>
      );
    }

    case "services": {
      const items = (section.data.items as { id: string; title: string; description: string; price?: string }[]) || [];
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-white/30 font-medium">Service {i + 1}</span>
                <button onClick={() => update("items", items.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-500 p-0.5">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input value={item.title} onChange={(e) => { const u = [...items]; u[i] = { ...item, title: e.target.value }; update("items", u); }}
                placeholder="Service name" className={inputCls} />
              <input value={item.description} onChange={(e) => { const u = [...items]; u[i] = { ...item, description: e.target.value }; update("items", u); }}
                placeholder="Description" className={inputCls} />
              <input value={item.price || ""} onChange={(e) => { const u = [...items]; u[i] = { ...item, price: e.target.value }; update("items", u); }}
                placeholder="Price (optional)" className={inputCls} />
            </div>
          ))}
          <button onClick={() => update("items", [...items, { id: uuidv4(), title: "New Service", description: "", price: "" }])}
            className="w-full text-xs text-secondary border border-secondary/30 hover:bg-secondary/10 rounded-lg py-2 flex items-center justify-center gap-1.5 transition-all">
            <Plus className="w-3 h-3" /> Add Service
          </button>
        </div>
      );
    }

    case "cta":
      return (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Button Text</label>
            <input value={(section.data.text as string) || ""} onChange={(e) => update("text", e.target.value)}
              placeholder="Book Appointment" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>URL</label>
            <input value={(section.data.url as string) || ""} onChange={(e) => update("url", e.target.value)}
              placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Style</label>
            <select value={(section.data.style as string) || "primary"} onChange={(e) => update("style", e.target.value)} className={inputCls}>
              <option value="primary">Filled (Primary)</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      );

    case "lead_form":
      return (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Form Title</label>
            <input value={(section.data.title as string) || ""} onChange={(e) => update("title", e.target.value)}
              placeholder="Get in Touch" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Submit Button Text</label>
            <input value={(section.data.submitText as string) || "Send Message"} onChange={(e) => update("submitText", e.target.value)}
              placeholder="Send Message" className={inputCls} />
          </div>
        </div>
      );

    case "text":
      return (
        <div>
          <label className={labelCls}>Content</label>
          <textarea value={(section.data.content as string) || ""} onChange={(e) => update("content", e.target.value)}
            className={`${inputCls} resize-none min-h-[100px]`} placeholder="Your text..." />
        </div>
      );

    case "map":
      return (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Address</label>
            <input value={(section.data.address as string) || ""} onChange={(e) => update("address", e.target.value)}
              placeholder="123 Main St, City" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Google Maps Embed URL</label>
            <input value={(section.data.embedUrl as string) || ""} onChange={(e) => update("embedUrl", e.target.value)}
              placeholder="https://maps.google.com/maps?..." className={inputCls} />
          </div>
        </div>
      );

    case "testimonials": {
      const items = (section.data.items as { id: string; name: string; role: string; content: string; rating: number }[]) || [];
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-white/30 font-medium">Review {i + 1}</span>
                <button onClick={() => update("items", items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-500 p-0.5">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input value={item.name} onChange={(e) => { const u = [...items]; u[i] = { ...item, name: e.target.value }; update("items", u); }}
                placeholder="Client name" className={inputCls} />
              <input value={item.role} onChange={(e) => { const u = [...items]; u[i] = { ...item, role: e.target.value }; update("items", u); }}
                placeholder="Role / Company" className={inputCls} />
              <textarea value={item.content} onChange={(e) => { const u = [...items]; u[i] = { ...item, content: e.target.value }; update("items", u); }}
                placeholder="Review text..." className={`${inputCls} resize-none min-h-[60px]`} />
              <div>
                <label className={labelCls}>Rating</label>
                <select value={item.rating} onChange={(e) => { const u = [...items]; u[i] = { ...item, rating: Number(e.target.value) }; update("items", u); }} className={inputCls}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
            </div>
          ))}
          <button onClick={() => update("items", [...items, { id: uuidv4(), name: "Client Name", role: "Client", content: "Great service!", rating: 5 }])}
            className="w-full text-xs text-secondary border border-secondary/30 hover:bg-secondary/10 rounded-lg py-2 flex items-center justify-center gap-1.5 transition-all">
            <Plus className="w-3 h-3" /> Add Testimonial
          </button>
        </div>
      );
    }

    case "business_hours": {
      const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      return (
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day}>
              <label className={`${labelCls} capitalize`}>{day}</label>
              <input value={(section.data[day] as string) || ""} onChange={(e) => update(day, e.target.value)}
                placeholder="9 AM – 6 PM or Closed" className={inputCls} />
            </div>
          ))}
        </div>
      );
    }

    default:
      return <p className="text-xs text-gray-400 dark:text-white/30">Select a section to edit its properties.</p>;
  }
}

export function BuilderRightPanel() {
  const { layout, selectedSectionId, updateTheme } = useBuilderStore();
  const [tab, setTab] = useState<"theme" | "section">("theme");
  const selectedSection = selectedSectionId ? layout.sections.find((s) => s.id === selectedSectionId) : null;

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-l border-gray-100 dark:border-white/5 flex flex-col overflow-hidden flex-shrink-0">
      <div className="flex border-b border-gray-100 dark:border-white/5">
        <button onClick={() => setTab("theme")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${tab === "theme" ? "text-secondary border-b-2 border-secondary" : "text-gray-400 dark:text-white/40"}`}>
          <Palette className="w-3 h-3" /> Theme
        </button>
        <button onClick={() => setTab("section")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${tab === "section" ? "text-secondary border-b-2 border-secondary" : "text-gray-400 dark:text-white/40"}`}>
          <Layout className="w-3 h-3" /> {selectedSection ? SECTION_LABELS[selectedSection.type]?.split(" ")[0] || "Section" : "Section"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {tab === "theme" ? (
          <>
            <div>
              <p className="text-xs text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider mb-3">Colors</p>
              <div className="space-y-3">
                <ColorRow label="Primary" themeKey="primaryColor" />
                <ColorRow label="Secondary" themeKey="secondaryColor" />
                <ColorRow label="Accent" themeKey="accentColor" />
                <ColorRow label="Background" themeKey="backgroundColor" />
                <ColorRow label="Text" themeKey="textColor" />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider mb-3 flex items-center gap-1">
                <Type className="w-3 h-3" /> Font
              </p>
              <select value={layout.theme.fontFamily} onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                className="w-full text-xs bg-gray-50 dark:bg-primary/50 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg px-3 py-2 outline-none">
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider mb-3">Border Radius</p>
              <div className="grid grid-cols-3 gap-1.5">
                {RADIUS_OPTIONS.map((r) => (
                  <button key={r} onClick={() => updateTheme({ borderRadius: r })}
                    className={`text-xs py-1.5 rounded-lg border transition-all ${layout.theme.borderRadius === r ? "border-secondary text-secondary bg-secondary/10" : "border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-secondary/50"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500 dark:text-white/50">Dark Card</span>
              <button onClick={() => updateTheme({ darkMode: !layout.theme.darkMode })}
                className={`w-10 h-5 rounded-full transition-all relative ${layout.theme.darkMode ? "bg-secondary" : "bg-gray-200 dark:bg-white/10"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${layout.theme.darkMode ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </>
        ) : (
          <>
            {selectedSection ? (
              <div>
                <p className="text-xs text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider mb-3">
                  {SECTION_LABELS[selectedSection.type] || selectedSection.type}
                </p>
                <SectionEditor section={selectedSection} />
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Layout className="w-5 h-5 text-gray-300 dark:text-white/20" />
                </div>
                <p className="text-gray-400 dark:text-white/30 text-xs">Click a section on the canvas to edit it</p>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
