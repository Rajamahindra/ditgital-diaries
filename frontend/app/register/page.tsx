"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const PERKS = [
  "Free digital card with live URL",
  "AI-powered card generation",
  "QR code & download",
  "Real-time analytics",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { setToken, setUser } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.register({ name: data.name, email: data.email, password: data.password });
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Welcome to Digital Diaries!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-display font-bold text-2xl">
              Digital<span className="gradient-text">Diaries</span>
            </span>
          </Link>

          <h1 className="text-4xl font-display font-black text-white mb-4 leading-tight">
            Your professional identity,{" "}
            <span className="gradient-text">reimagined.</span>
          </h1>
          <p className="text-white/50 text-lg mb-10">
            Join 50,000+ professionals who use Digital Diaries to build their digital presence.
          </p>

          <ul className="space-y-4">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-secondary" />
                </div>
                <span className="text-white/70">{perk}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-display font-bold text-2xl">
                Digital<span className="gradient-text">Diaries</span>
              </span>
            </Link>
          </div>

          <div className="bg-dark-card rounded-2xl p-8 border border-white/10">
            <h2 className="text-white text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-white/50 text-sm mb-8">Free forever. No credit card required.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-white/70 text-sm font-medium block mb-2">Full Name</label>
                <input
                  {...register("name")}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border bg-primary text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium block mb-2">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border bg-primary text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium block mb-2">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-12 rounded-xl border bg-primary text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium block mb-2">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 rounded-xl border bg-primary text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gradient flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Free Account ✨"
                )}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-secondary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
