"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Category { id: string; name: string; slug: string; description?: string; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    const res = await adminAPI.getCategories();
    setCategories(res.data.categories);
    setLoading(false);
  }

  function openNew() { setEditing(null); setName(""); setSlug(""); setDesc(""); setShowForm(true); }
  function openEdit(c: Category) { setEditing(c); setName(c.name); setSlug(c.slug); setDesc(c.description || ""); setShowForm(true); }

  async function handleSave() {
    if (!name || !slug) { toast.error("Name and slug required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminAPI.updateCategory(editing.id, { name, slug, description: desc });
        toast.success("Category updated");
      } else {
        await adminAPI.createCategory({ name, slug, description: desc });
        toast.success("Category created");
      }
      setShowForm(false);
      fetch();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await adminAPI.deleteCategory(id);
    toast.success("Deleted");
    fetch();
  }

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
            </div>
            <button onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition">
              <Plus className="w-4 h-4" />New Category
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-900 border border-violet-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{editing ? "Edit Category" : "New Category"}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input value={name} onChange={e => { setName(e.target.value); if (!editing) setSlug(slugify(e.target.value)); }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Category name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                  <input value={slug} onChange={e => setSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="category-slug" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input value={desc} onChange={e => setDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Optional description" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60">
                  <Check className="w-4 h-4" />{saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Name", "Slug", "Description", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    {[...Array(4)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 rounded shimmer" /></td>)}
                  </tr>
                )) : categories.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No categories yet</td></tr>
                ) : categories.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                    <td className="px-6 py-4 text-white font-medium text-sm">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{cat.description || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-500 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
