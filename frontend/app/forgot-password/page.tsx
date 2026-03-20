"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP");
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(email, otp);
      setResetToken(res.data.resetToken);
      setStep("password");
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, password);
      toast.success("Password reset! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
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
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {(["email", "otp", "password"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? "bg-secondary text-white" :
                  (["email", "otp", "password"].indexOf(step) > i) ? "bg-green-500 text-white" :
                  "bg-white/10 text-white/30"
                }`}>{i + 1}</div>
                {i < 2 && <div className={`flex-1 h-0.5 rounded ${(["email", "otp", "password"].indexOf(step) > i) ? "bg-green-500" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.form key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">Forgot Password?</h2>
                  <p className="text-white/50 text-sm">Enter your email and we'll send you an OTP.</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">Email Address</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full bg-primary/50 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none focus:border-secondary"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-gradient py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send OTP"}
                </button>
                <Link href="/login" className="flex items-center gap-1.5 text-white/50 text-sm hover:text-white justify-center">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">Enter OTP</h2>
                  <p className="text-white/50 text-sm">We sent a 6-digit code to <span className="text-secondary">{email}</span></p>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">6-Digit OTP</label>
                  <input
                    type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" maxLength={6} required
                    className="w-full bg-primary/50 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none focus:border-secondary text-center text-2xl font-bold tracking-[0.5em]"
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full btn-gradient py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify OTP"}
                </button>
                <button type="button" onClick={() => { setStep("email"); setOtp(""); }} className="flex items-center gap-1.5 text-white/50 text-sm hover:text-white mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Change email
                </button>
              </motion.form>
            )}

            {step === "password" && (
              <motion.form key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">New Password</h2>
                  <p className="text-white/50 text-sm">Choose a strong password for your account.</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters" required minLength={8}
                      className="w-full bg-primary/50 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 outline-none focus:border-secondary"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">Confirm Password</label>
                  <input
                    type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password" required
                    className="w-full bg-primary/50 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none focus:border-secondary"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-gradient py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : "Reset Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
