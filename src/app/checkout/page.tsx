"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, ArrowRight, ShieldCheck, Zap, Crown, BookOpen, Quote } from "lucide-react";

export default function CheckoutPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }
  };

  return (
    <main className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 md:top-10 md:left-10 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo-no-bg.png" alt="Notrik Logo" className="w-24 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      {/* Ambient glowing background (Sturdy Vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-4/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

      {/* Header section */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 bg-brand-4/10 border border-brand-4/20 text-brand-4 px-5 py-2 rounded-full font-mono text-sm font-bold tracking-wide mb-8">
          <ShieldCheck className="w-4 h-4" /> Secure 256-bit Checkout
        </motion.div>
        <h1 className="font-serif font-bold text-5xl md:text-7xl mb-6 tracking-tight">Invest in Your <span className="text-brand-4">Rank.</span> 🎯</h1>
        <p className="font-sans text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Join 10,000+ top-percentile aspirants across India who have completely transformed how they study. Stop wasting time organizing, start learning. 🚀
        </p>
      </section>

      {/* Pricing Section */}
      <section className="px-6 max-w-7xl mx-auto mb-32 relative z-10">
        <div className="flex flex-col items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-4 bg-black/5 p-2 rounded-full border border-black/10 backdrop-blur-md">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-sans text-sm font-bold transition-all ${!isAnnual ? 'bg-white shadow-md text-black' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-sans text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-brand-4 text-white shadow-lg shadow-brand-4/20' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Annually <span className={`${isAnnual ? 'bg-white/20' : 'bg-green-100 text-green-700'} px-2 py-0.5 rounded text-xs`}>Save 20%</span>
            </button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {/* Free Tier */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2.5rem] border border-black/10 shadow-lg flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="font-serif font-bold text-3xl mb-2">Free</h3>
            <p className="font-sans text-foreground/60 mb-6 font-medium">Kickstart your revision.</p>
            <div className="text-5xl font-bold font-sans mb-8">₹0<span className="text-xl font-medium text-foreground/50">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                '5 Transformations / week 📝', 
                'Limited AI Mentor Chat 💬', 
                'Basic Summaries & Notes', 
                'Standard Quality Vision API'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-3 font-sans font-medium text-foreground/80">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="w-full block text-center py-4 rounded-full bg-brand-3 text-white font-sans font-bold hover:bg-brand-3/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Get Started for Free
            </Link>
          </motion.div>

          {/* Starter Tier */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2.5rem] border border-black/10 shadow-lg flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-serif font-bold text-3xl mb-2">Starter</h3>
            <p className="font-sans text-foreground/60 mb-6 font-medium">Perfect for testing the waters.</p>
            <div className="text-5xl font-bold font-sans mb-8 flex items-end">
              ₹{isAnnual ? '159' : '199'}
              <span className="text-xl font-medium text-foreground/50 mb-1">/mo</span>
              {isAnnual && <span className="text-lg line-through text-foreground/30 ml-3 mb-1">₹199</span>}
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                '30 Transformations / month 📝', 
                '25-30 AI Chat messages / day 💬', 
                'High Accuracy Extraction', 
                'Auto-generated Flashcards',
                'Standard Processing Priority'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-3 font-sans font-medium text-foreground/80">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/payment" className="w-full block text-center py-4 rounded-full border-2 border-black/10 font-sans font-bold hover:bg-black/5 hover:border-black/20 transition-all">
              Select Starter
            </Link>
          </motion.div>

          {/* Pro Tier (Brand-4 Blue - HEAVILY PROMOTED WITH VIBRANT GRADIENT CONTAINER) */}
          <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] border-2 border-brand-4 shadow-[0_20px_50px_rgba(30,58,138,0.35)] relative flex flex-col bg-gradient-to-br from-brand-3 via-brand-2 to-brand-1 text-white transform md:-translate-y-6 hover:-translate-y-8 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-4/25 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-brand-1 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 z-10 border border-yellow-300">
              <Star className="w-3.5 h-3.5 fill-brand-1 text-brand-1 animate-pulse" /> Recommended • Most Popular <Star className="w-3.5 h-3.5 fill-brand-1 text-brand-1 animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="font-serif font-bold text-3xl mb-2 text-white">Aspirant Pro</h3>
            <p className="font-sans text-white/70 mb-6 font-medium">For serious rankers. 🔥</p>
            <div className="text-5xl font-bold font-sans mb-8 flex items-end text-white">
              ₹{isAnnual ? '319' : '399'}
              <span className="text-xl font-medium text-white/60 mb-1">/mo</span>
              {isAnnual && <span className="text-lg line-through text-white/40 ml-3 mb-1">₹399</span>}
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                '80 Transformations / month 📝', 
                '150 AI Chat messages / day 💬', 
                'Premium High-Fidelity Extraction', 
                'Priority Processing Queue ⚡', 
                'Full Export (PDF, MD, CSV)',
                'Custom Study Folder Sorting 📁'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-3 font-sans font-bold text-white/95">
                  <Check className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/payment" className="w-full block text-center py-5 rounded-full bg-white text-brand-1 font-sans text-lg font-bold hover:bg-white/95 hover:scale-[1.02] transition-all shadow-xl shadow-brand-3/20 flex justify-center items-center gap-2">
              Upgrade to Pro <ArrowRight className="w-5 h-5 inline" />
            </Link>
          </motion.div>

          {/* Unlimited Tier */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2.5rem] border border-brand-1/30 shadow-lg flex flex-col bg-gradient-to-b from-brand-1/5 to-transparent backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-1/10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="w-12 h-12 bg-brand-1/20 rounded-2xl flex items-center justify-center mb-6">
              <Crown className="w-6 h-6 text-brand-1" />
            </div>
            <h3 className="font-serif font-bold text-3xl mb-2">Unlimited Ranker</h3>
            <p className="font-sans text-foreground/60 mb-6 font-medium">The ultimate unfair advantage. 👑</p>
            <div className="text-5xl font-bold font-sans mb-8 flex items-end">
              ₹{isAnnual ? '639' : '799'}
              <span className="text-xl font-medium text-foreground/50 mb-1">/mo</span>
              {isAnnual && <span className="text-lg line-through text-foreground/30 ml-3 mb-1">₹799</span>}
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                'Unlimited Transformations *', 
                'Unmetered AI Mentor Chat *', 
                '1-on-1 AI Mentorship Chat', 
                'Custom Syllabus Loading 📚', 
                'Trace Drawer Log Access', 
                'Instant Processing priority'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-3 font-sans font-medium text-foreground/80">
                  <Check className="w-5 h-5 text-brand-1 shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/payment" className="w-full block text-center py-4 rounded-full border-2 border-brand-1 text-brand-1 font-sans font-bold hover:bg-brand-1 hover:text-white transition-all shadow-lg shadow-brand-1/10">
              Get Unlimited Access
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 max-w-6xl mx-auto mb-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl mb-4">Trusted by the best.</h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">Join the community of toppers who have integrated Notrik into their daily revision.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-black/5 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <Quote className="w-8 h-8 text-brand-4/30 mb-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-2 text-brand-2" />)}
            </div>
            <p className="font-sans text-lg italic text-foreground/80 mb-8 flex-1">
              "The ability to take a photo of my messy coaching whiteboard and immediately get a clean markdown file with practice MCQs is insane. It saved me at least 2 hours of copy-pasting notes every day during my JEE prep."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-4/20 flex items-center justify-center font-bold text-brand-4">A</div>
              <div>
                <h4 className="font-sans font-bold">Aryan S.</h4>
                <p className="font-sans text-sm text-foreground/50">JEE Advanced AIR 402</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-black/5 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <Quote className="w-8 h-8 text-brand-1/30 mb-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-2 text-brand-2" />)}
            </div>
            <p className="font-sans text-lg italic text-foreground/80 mb-8 flex-1">
              "NEET biology requires massive amounts of memorization. Notrik automatically turned my NCERT highlights into interactive flashcards. I used them on my phone while traveling to coaching. Absolute lifesaver."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-1/20 flex items-center justify-center font-bold text-brand-1">P</div>
              <div>
                <h4 className="font-sans font-bold">Priya M.</h4>
                <p className="font-sans text-sm text-foreground/50">Govt Medical College</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-black/5 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <Quote className="w-8 h-8 text-brand-3/30 mb-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-2 text-brand-2" />)}
            </div>
            <p className="font-sans text-lg italic text-foreground/80 mb-8 flex-1">
              "For UPSC, structuring notes from The Hindu editorials used to take hours. Notrik's AI structures it perfectly into headings, subheadings, and key takeaways in seconds. It is worth every single penny."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-3/20 flex items-center justify-center font-bold text-brand-3">R</div>
              <div>
                <h4 className="font-sans font-bold">Rohan K.</h4>
                <p className="font-sans text-sm text-foreground/50">UPSC Aspirant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
