"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import PostForm from "@/components/PostForm";
import { adminAPI } from "@/lib/api";

import { Post } from "@/components/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getPost(id).then(r => setPost(r.data.post)).finally(() => setLoading(false));
  }, [id]);

  return (
    <AuthGuard>
      <Layout>
        {loading ? <div className="h-64 rounded-2xl shimmer" /> : <PostForm post={post} />}
      </Layout>
    </AuthGuard>
  );
}
