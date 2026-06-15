"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";



export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, currentUser, isLoading } = useAuth();
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
    if (name.trim() && email.trim() && password.trim()) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setIsSubmitting(true);
      try {
        await signup(name, email, password);
        // If Supabase has email confirmation enabled, the user won't
        // have a session yet. Show a success message instead.
        setSignupSuccess(true);
        // For auto-confirm setups, the onAuthStateChange listener
        // will set the user. But we want to enforce verification message.
      } catch (err: any) {
        setError(err.message || "Failed to create account.");
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
        {/* Left Side: Copy & Visuals */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center pr-12"
        >
          <div className="inline-flex items-center gap-2 bg-brand-1/10 border border-brand-1/20 text-brand-1 px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wide mb-8 w-max">
            <Zap className="w-4 h-4" /> Stop rewriting notes by hand.
          </div>
          <h1 className="font-serif font-bold text-5xl xl:text-6xl mb-6 tracking-tight leading-[1.1]">
            Your ultimate <span className="text-brand-1">academic</span> weapon.
          </h1>
          <p className="font-sans text-xl text-foreground/70 mb-12 leading-relaxed">
            Join the elite tier of students who have automated the hardest part of exam preparation. Turn chaos into pristine flashcards instantly.
          </p>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg">Instant Structuring</h4>
                <p className="font-sans text-sm text-foreground/60">Advanced OCR parses even the messiest cursive.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm relative group">
              <div className="w-12 h-12 bg-brand-4/10 text-brand-4 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg">Secure Trace Drawer</h4>
                <p className="font-sans text-sm text-foreground/60">Never lose a single revision file again.</p>
              </div>
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
            <div className="w-full bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 relative mb-8">

              <div className="text-center mb-10">
                <h2 className="font-serif font-bold text-3xl mb-2">Create Account</h2>
                <p className="font-sans text-foreground/60">Transform your notes in seconds.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div>
                  <label className="block font-sans text-sm font-bold text-foreground/80 mb-2">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans text-sm outline-none focus:border-brand-4 focus:ring-2 focus:ring-brand-4/20 transition-all" />
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold text-foreground/80 mb-2">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rahul@example.com" className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans text-sm outline-none focus:border-brand-4 focus:ring-2 focus:ring-brand-4/20 transition-all" />
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold text-foreground/80 mb-2">Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans text-sm outline-none focus:border-brand-4 focus:ring-2 focus:ring-brand-4/20 transition-all" />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {signupSuccess && (
                  <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-100 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-base">Account created! Please check your email.</p>
                      <p>
                        There should be a message from <strong>Supabase Auth</strong>. 
                        Click on the <strong>"Confirm your email address"</strong> button in that email.
                      </p>
                      <p>
                        Once confirmed, return here and log in using the <Link href="/login" className="underline font-bold text-green-800 hover:text-green-900">Log in</Link> link below.
                      </p>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting || signupSuccess} className="group w-full relative overflow-hidden rounded-full bg-brand-4 text-white px-8 py-4 font-sans text-lg font-bold shadow-lg shadow-brand-4/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  <span className="relative z-10">{isSubmitting ? "Creating Account..." : "Join Notrik"}</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-black/5 text-center">
                <p className="font-sans text-sm text-foreground/60">
                  Already have an account? <Link href="/login" className="text-brand-4 font-bold hover:underline">Log in</Link>
                </p>
              </div>
            </div>

            {/* Social Proof Testimonial */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-full flex-shrink-0 bg-[url('https://i.pinimg.com/736x/17/ac/ba/17acba66bc08210a806c53bd293942bf.jpg')] bg-cover bg-center"></div>
              <div>
                <p className="font-serif italic text-foreground/80 text-sm mb-2">"I uploaded 50 pages of chaotic biology notes and got pristine flashcards 3 seconds later. It's basically magic."</p>
                <p className="font-sans font-bold text-xs">Priya K. <span className="text-foreground/50 font-normal">NEET Aspirant</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
