"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && currentUser) {
      if (!currentUser.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isLoading, currentUser, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email.trim() && password.trim()) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setIsSubmitting(true);
      try {
        await login(email, password);
        
        // Check onboarding status directly to avoid flashing the dashboard
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single();
            
          if (profile && !profile.onboarding_completed) {
            router.push("/onboarding");
            return;
          }
        }
        
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Invalid login credentials.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 pb-32">
      {/* Top Left Branding */}
      <div className="relative lg:absolute top-0 left-0 lg:top-10 lg:left-10 z-50 mb-12 lg:mb-0 w-full flex justify-start">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo-no-bg.png" alt="Notrik Logo" className="w-24 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      {/* Ambient background removed for clean look */}

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left Side: Visuals */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center pr-12 relative"
        >
          {/* Floating Asset Mockup */}
          <div className="w-full h-[400px] flex flex-col items-center justify-center relative">
            <motion.img
              src="/open-textbook.png"
              alt="Open Textbook"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full max-w-[20rem] xl:max-w-[24rem] object-contain mix-blend-multiply contrast-125 brightness-110 z-10 rotate-[-5deg] hover:rotate-0 transition-transform duration-700"
            />

            <div className="absolute bottom-0 bg-white px-6 py-4 rounded-2xl border border-black/15 shadow-[0_15px_45px_rgba(0,0,0,0.15)] z-20 flex flex-col items-center text-center transform translate-y-6">
              <div className="w-12 h-12 bg-brand-4/10 rounded-xl flex items-center justify-center mb-3">
                <LockKeyhole className="w-6 h-6 text-brand-4" />
              </div>
              <h3 className="font-serif font-bold text-xl mb-1 text-foreground">Welcome Back</h3>
              <p className="font-sans text-foreground/60 text-sm max-w-[200px]">Your entire Trace Drawer is locked and encrypted.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="w-full bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-black/10 relative mb-8">

              <div className="text-center mb-10">
                <h2 className="font-serif font-bold text-3xl mb-2">Welcome Back</h2>
                <p className="font-sans text-foreground/60">Log in to access your Trace Drawer.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div>
                  <label className="block font-sans text-sm font-bold text-foreground/80 mb-2">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rahul@example.com" className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans text-sm outline-none focus:border-brand-4 focus:ring-2 focus:ring-brand-4/20 transition-all" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block font-sans text-sm font-bold text-foreground/80">Password</label>
                    <Link href="#" className="font-sans text-xs text-brand-4 font-bold hover:underline">Forgot password?</Link>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans text-sm outline-none focus:border-brand-4 focus:ring-2 focus:ring-brand-4/20 transition-all" />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="group w-full relative overflow-hidden rounded-full bg-brand-1 text-white px-8 py-4 font-sans text-lg font-bold shadow-lg shadow-brand-1/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  <span className="relative z-10">{isSubmitting ? "Logging in..." : "Secure Log In"}</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-black/5 text-center">
                <p className="font-sans text-sm text-foreground/60">
                  Don't have an account yet? <Link href="/signup" className="text-brand-4 font-bold hover:underline">Sign up</Link>
                </p>
              </div>
            </div>

            {/* Social Proof Testimonial */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-full flex-shrink-0 bg-[url('https://i.pinimg.com/736x/28/61/f5/2861f580988a2f98ed71fb6c3b617fa8.jpg')] bg-cover bg-center"></div>
              <div>
                <p className="font-serif italic text-foreground/80 text-sm mb-2">"Notrik's Library literally saved my CA Finals prep. I never lose a single revision note anymore."</p>
                <p className="font-sans font-bold text-xs">Arjun M. <span className="text-foreground/50 font-normal">Rank 42, CA Final</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
