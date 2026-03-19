"use client";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <AuthGuard>
      <Layout>
        <PostForm />
      </Layout>
    </AuthGuard>
  );
}
