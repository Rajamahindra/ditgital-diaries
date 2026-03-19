"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { Pencil, Check, X, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Template { id: string; name: string; category: string; thumbnail: string; is_premium: number; tags: string; }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; category: string; is_premium: boolean }>({ name: "", category: "", is_premium: false });

  useEffect(() => {
    adminAPI.getTemplates().then(r => setTemplates(r.data.templates)).finally(() => setLoading(false));
  }, []);

  function startEdit(t: Template) {
    setEditing(t.id);
    setEditData({ name: t.name, category: t.category, is_premium: !!t.is_premium });
  }

  async function saveEdit(id: string) {
    try {
      await adminAPI.updateTemplate(id, editData);
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...editData, is_premium: editData.is_premium ? 1 : 0 } : t));
      setEditing(null);
      toast.success("Template updated");
    } catch { toast.error("Failed"); }
  }

  const categories = [...new Set(templates.map(t => t.category))].sort();

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Templates</h1>
            <p className="text-gray-400 text-sm mt-1">{templates.length} templates across {categories.length} categories</p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <span key={cat} className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-full capitalize">{cat}</span>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {templates.map(t => (
                <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition group">
                  <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
                    {t.thumbnail ? (
                      <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No preview</div>
                    )}
                    {t.is_premium ? (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />Pro
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3">
                    {editing === t.id ? (
                      <div className="space-y-2">
                        <input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                          className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-violet-500" />
                        <input value={editData.category} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                          className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-violet-500" />
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                          <input type="checkbox" checked={editData.is_premium} onChange={e => setEditData(d => ({ ...d, is_premium: e.target.checked }))} />
                          Premium
                        </label>
                        <div className="flex gap-1">
                          <button onClick={() => saveEdit(t.id)} className="flex-1 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-lg transition flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </button>
                          <button onClick={() => setEditing(null)} className="flex-1 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition flex items-center justify-center">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{t.name}</p>
                          <p className="text-gray-500 text-xs capitalize">{t.category}</p>
                        </div>
                        <button onClick={() => startEdit(t)} className="p-1 text-gray-600 hover:text-violet-400 transition flex-shrink-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
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
