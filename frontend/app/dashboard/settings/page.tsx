"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const onSubmit = async (data: { name: string; email: string }) => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", data);
      setUser(res.data.user);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-white/50 text-sm mt-1">Manage your account</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5"
      >
        <h2 className="text-primary dark:text-white font-semibold mb-5">Profile Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-white/50 block mb-2">Full Name</label>
            <input
              {...register("name")}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-white/50 block mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5"
      >
        <h2 className="text-primary dark:text-white font-semibold mb-2">Danger Zone</h2>
        <p className="text-gray-400 dark:text-white/40 text-sm mb-4">
          Permanently delete your account and all data.
        </p>
        <button className="text-red-500 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
