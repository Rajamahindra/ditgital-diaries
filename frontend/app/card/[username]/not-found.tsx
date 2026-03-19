import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CardNotFound() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-display font-black text-white mb-3">Card Not Found</h1>
        <p className="text-white/50 mb-8">This card doesn't exist or hasn't been published yet.</p>
        <Link href="/" className="btn-gradient inline-flex items-center gap-2">
          Create Your Own Card
        </Link>
      </div>
    </div>
  );
}
