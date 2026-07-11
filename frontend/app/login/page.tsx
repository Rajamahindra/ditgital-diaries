"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Sparkles, Loader2, Mail, Lock,
  BarChart3, Globe, QrCode, Shield
} from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const FEATURES = [
  { icon: Globe, text: "Live public URL for your card" },
  { icon: BarChart3, text: "Real-time analytics dashboard" },
  { icon: QrCode, text: "Auto-generated QR code" },
  { icon: Shield, text: "Secure & always available" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.login(data);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-[#0A1128] via-[#0F1A35] to-[#0A1128] border-r border-white/5 p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Welcome back to your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                digital identity.
              </span>
            </h1>
            <p className="text-white/45 text-lg mb-10 leading-relaxed">
              Sign in to manage your cards, view analytics, and connect with professionals.
            </p>

            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white/60 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((l, i) => (
              <div
                key={l}
                className="w-8 h-8 rounded-full border-2 border-[#0F1A35] flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: `hsl(${220 + i * 30}, 70%, 50%)`,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <div>
            <div className="text-white text-sm font-semibold">50,000+ professionals</div>
            <div className="text-white/35 text-xs">trust Digital Diaries</div>
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
            <h2 className="text-white text-3xl font-black mb-2">Sign in</h2>
            <p className="text-white/40">Welcome back. Enter your credentials to continue.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/60 text-sm font-medium">Password</label>
                  <Link href="/forgot-password" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-white/35 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
