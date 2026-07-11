"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Sparkles, Loader2, Mail, Lock, User, Check
} from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const PERKS = [
  "Free digital card with live URL",
  "AI-powered card generation",
  "QR code & download in any format",
  "Real-time analytics dashboard",
  "Lead capture & CRM",
  "No credit card required",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Welcome to Digital Diaries!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-[#0A1128] via-[#0F1A35] to-[#0A1128] border-r border-white/5 p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-2xl">
            Digital
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-black">
              Diaries
            </span>
          </span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 mt-auto mb-auto pt-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Your professional identity,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                reimagined.
              </span>
            </h1>
            <p className="text-white/45 text-lg mb-10 leading-relaxed">
              Join 50,000+ professionals who use Digital Diaries to build their digital presence.
            </p>

            <ul className="space-y-3.5">
              {PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-white/60 text-sm">{perk}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4">
          <div className="flex -space-x-2">
            {["R", "S", "T", "U"].map((l, i) => (
              <div
                key={l}
                className="w-8 h-8 rounded-full border-2 border-[#0F1A35] flex items-center justify-center text-xs font-bold text-white"
                style={{ background: `hsl(${200 + i * 40}, 70%, 50%)` }}
              >
                {l}
              </div>
            ))}
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Join 50,000+ professionals</div>
            <div className="text-white/35 text-xs">Free forever · No credit card</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-2xl">
                Digital
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-black">
                  Diaries
                </span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-3xl font-black mb-2">Create your account</h2>
            <p className="text-white/40">Free forever. No credit card required.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-white/60 text-sm font-medium block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    {...register("name")}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-white/60 text-sm font-medium block mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-white/60 text-sm font-medium block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-white/60 text-sm font-medium block mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Free Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/35 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
