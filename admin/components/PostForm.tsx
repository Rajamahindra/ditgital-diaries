"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { Save, Eye, Upload, X, Plus, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Category { id: string; name: string; }
interface Post {
  id?: string; title?: string; subtitle?: string; slug?: string; content?: string;
  excerpt?: string; featured_image?: string; images?: string[]; category_id?: string;
  tags?: string[]; status?: string; seo_title?: string; seo_description?: string; publish_date?: string;
}

export default function PostForm({ post }: { post?: Post | null }) {
  const router = useRouter();
  const isEdit = !!post?.id;

  const [title, setTitle] = useState(post?.title || "");
  const [subtitle, setSubtitle] = useState(post?.subtitle || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "");
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(post?.status || "draft");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || "");
  const [seoDesc, setSeoDesc] = useState(post?.seo_description || "");
  const [publishDate, setPublishDate] = useState(post?.publish_date || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "media">("content");

  useEffect(() => {
    adminAPI.getCategories().then(r => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit && title) setSlug(slugify(title));
  }, [title, isEdit]);

  async function handleSave(publishNow = false) {
    if (!title || !slug) { toast.error("Title and slug are required"); return; }
    setSaving(true);
    try {
      const data = {
        title, subtitle, slug, content, excerpt, featured_image: featuredImage,
        images, category_id: categoryId || null, tags,
        status: publishNow ? "published" : status,
        seo_title: seoTitle, seo_description: seoDesc, publish_date: publishDate,
      };
      if (isEdit) {
        await adminAPI.updatePost(post!.id!, data);
        toast.success("Post updated");
      } else {
        await adminAPI.createPost(data);
        toast.success("Post created");
        router.push("/posts");
      }
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: "featured" | "gallery") {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append("files", f));
      const res = await adminAPI.uploadMedia(fd);
      const urls = res.data.media.map((m: { url: string }) => m.url);
      if (type === "featured") setFeaturedImage(urls[0]);
      else setImages(prev => [...prev, ...urls]);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput(""); }
  }

  const tabs = ["content", "seo", "media"] as const;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Post" : "New Post"}</h1>
          <p className="text-gray-400 text-sm mt-1">{isEdit ? `Editing: ${post?.title}` : "Create a new article"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60">
            <Eye className="w-4 h-4" />Publish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === t ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-5">
          {activeTab === "content" && (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Post title..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                  <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Optional subtitle..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl">
                    <span className="text-gray-500 text-sm">/posts/</span>
                    <input value={slug} onChange={e => setSlug(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none"
                      placeholder="post-slug" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                  <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    placeholder="Short description..." />
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Content</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={20}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-y font-mono"
                  placeholder="Write your article content here... (Markdown supported)" />
                <p className="text-xs text-gray-500 mt-2">Markdown is supported for formatting</p>
              </div>
            </>
          )}

          {activeTab === "seo" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold">SEO Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title</label>
                <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="SEO optimized title..." />
                <p className="text-xs text-gray-500 mt-1">{seoTitle.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  placeholder="Meta description for search engines..." />
                <p className="text-xs text-gray-500 mt-1">{seoDesc.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Publish Date</label>
                <input type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Featured Image</label>
                {featuredImage ? (
                  <div className="relative">
                    <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover rounded-xl" />
                    <button onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-violet-500 transition">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload featured image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, "featured")} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Gallery Images</label>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-violet-500 transition">
                    {uploading ? <Loader2 className="w-6 h-6 text-gray-400 animate-spin" /> : <Plus className="w-6 h-6 text-gray-500" />}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, "gallery")} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-semibold text-sm">Publish Settings</h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500">
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold text-sm">Tags</h3>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Add tag..." />
              <button onClick={addTag} className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-600/20 text-violet-400 text-xs rounded-full">
                  {tag}
                  <button onClick={() => setTags(prev => prev.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
