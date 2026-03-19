"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";
import { leadsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Props { data: Record<string, unknown>; cardId: string; }

export function PublicLeadForm({ data, cardId }: Props) {
  const title = (data.title as string) || "Get in Touch";
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      await leadsAPI.submit(cardId, formData);
      setSubmitted(true);
      toast.success("Message sent!");
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="px-5 py-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold">Message Sent!</p>
        <p className="text-sm opacity-50 mt-1">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <p className="font-semibold text-base mb-4">{title}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("name", { required: true })}
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <input
          {...register("phone")}
          placeholder="Phone Number"
          type="tel"
          className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <input
          {...register("email")}
          placeholder="Email Address"
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <textarea
          {...register("message")}
          placeholder="Your message..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
        </button>
      </form>
    </div>
  );
}
