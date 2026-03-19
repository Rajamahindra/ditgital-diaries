"use client";
import { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Media { id: string; url: string; original_name: string; size: number; mime_type: string; created_at: string; }

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMedia(); }, []);

  async function fetchMedia() {
    setLoading(true);
    const res = await adminAPI.getMedia();
    setMedia(res.data.media);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append("files", f));
      await adminAPI.uploadMedia(fd);
      toast.success(`${files.length} file(s) uploaded`);
      fetchMedia();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    await adminAPI.deleteMedia(id);
    setMedia(prev => prev.filter(m => m.id !== id));
    toast.success("Deleted");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Media Library</h1>
              <p className="text-gray-400 text-sm mt-1">{media.length} files</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Files
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </label>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900 border border-dashed border-gray-700 rounded-2xl">
              <ImageIcon className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No media uploaded yet</p>
              <p className="text-gray-600 text-sm mt-1">Upload images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {media.map(item => (
                <div key={item.id} className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition">
                  <div className="aspect-square">
                    <img src={item.url} alt={item.original_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-white text-xs text-center truncate w-full">{item.original_name}</p>
                    <p className="text-gray-400 text-xs">{formatSize(item.size)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(item.url)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
