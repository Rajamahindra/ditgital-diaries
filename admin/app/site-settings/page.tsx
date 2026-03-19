"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { Save, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SECTIONS = [
  {
    title: "General",
    fields: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "site_tagline", label: "Tagline / Badge Text", type: "text" },
      { key: "logo_url", label: "Logo URL", type: "text", placeholder: "https://..." },
      { key: "footer_text", label: "Footer Text", type: "text" },
    ],
  },
  {
    title: "Hero Section",
    fields: [
      { key: "hero_headline", label: "Main Headline", type: "textarea" },
      { key: "hero_subheadline", label: "Sub Headline", type: "textarea" },
      { key: "hero_cta_primary", label: "Primary Button Text", type: "text" },
      { key: "hero_cta_secondary", label: "Secondary Button Text", type: "text" },
      { key: "hero_stat_1_value", label: "Stat 1 Value", type: "text" },
      { key: "hero_stat_1_label", label: "Stat 1 Label", type: "text" },
      { key: "hero_stat_2_value", label: "Stat 2 Value", type: "text" },
      { key: "hero_stat_2_label", label: "Stat 2 Label", type: "text" },
      { key: "hero_stat_3_value", label: "Stat 3 Value", type: "text" },
      { key: "hero_stat_3_label", label: "Stat 3 Label", type: "text" },
    ],
  },
  {
    title: "Features Section",
    fields: [
      { key: "features_title", label: "Section Title", type: "text" },
      { key: "features_subtitle", label: "Section Subtitle", type: "text" },
    ],
  },
  {
    title: "Pricing Section",
    fields: [
      { key: "pricing_title", label: "Section Title", type: "text" },
      { key: "pricing_subtitle", label: "Section Subtitle", type: "text" },
      { key: "plan_free_price", label: "Free Plan Price", type: "text" },
      { key: "plan_pro_price", label: "Pro Plan Price", type: "text" },
      { key: "plan_business_price", label: "Business Plan Price", type: "text" },
    ],
  },
  {
    title: "Brand Colors",
    fields: [
      { key: "primary_color", label: "Primary Color", type: "color" },
      { key: "secondary_color", label: "Secondary Color", type: "color" },
      { key: "accent_color", label: "Accent Color", type: "color" },
    ],
  },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then(r => setSettings(r.data.settings)).finally(() => setLoading(false));
  }, []);

  function update(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success("Settings saved — refresh the frontend to see changes");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Site Settings</h1>
              <p className="text-gray-400 text-sm mt-1">Control homepage content and branding</p>
            </div>
            <button onClick={handleSave} disabled={saving || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}</div>
          ) : (
            <div className="space-y-6">
              {SECTIONS.map(section => (
                <div key={section.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-white font-semibold mb-5 pb-3 border-b border-gray-800">{section.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.fields.map(field => (
                      <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                        {field.type === "textarea" ? (
                          <textarea
                            value={settings[field.key] || ""}
                            onChange={e => update(field.key, e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                          />
                        ) : field.type === "color" ? (
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings[field.key] || "#000000"}
                              onChange={e => update(field.key, e.target.value)}
                              className="w-12 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={settings[field.key] || ""}
                              onChange={e => update(field.key, e.target.value)}
                              className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={settings[field.key] || ""}
                            onChange={e => update(field.key, e.target.value)}
                            placeholder={field.placeholder || ""}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
