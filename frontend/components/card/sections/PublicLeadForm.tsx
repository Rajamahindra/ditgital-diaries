"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle, Send, User, Phone, Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { leadsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Props { data: Record<string, unknown>; cardId: string; }

export function PublicLeadForm({ data, cardId }: Props) {
  const title = (data.title as string) || "Get in Touch";
  const submitText = (data.submitText as string) || "Send Message";
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

  return (
    <div className="px-5 sm:px-8 py-5">
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Inquiries</p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-bold text-lg mb-1">Message Sent!</p>
            <p className="text-sm opacity-50">We&apos;ll get back to you soon.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-semibold text-base mb-4">{title}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <input {...register("name", { required: true })} placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <input {...register("phone")} placeholder="Phone Number" type="tel"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <input {...register("email")} placeholder="Email Address" type="email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 opacity-30" />
                <textarea {...register("message")} placeholder="Your message..." rows={3}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none transition-all" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> {submitText}</>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
