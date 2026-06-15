"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, Star, ArrowRight, ShieldCheck, Zap, Crown, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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

  const handlePlanClick = (planName: string) => {
    setLoadingPlan(planName);
    // Simulate network delay before redirecting to onboarding
    setTimeout(() => {
      window.location.href = "/onboarding";
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-brand-4/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>
      
      <div className="noise-overlay fixed inset-0 z-[-1] pointer-events-none">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <main className="min-h-screen pb-24 relative overflow-hidden">
        <Navbar />

        {/* Header section */}
        <section className="pt-24 sm:pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 bg-brand-4/10 border border-brand-4/20 text-brand-4 px-5 py-2 rounded-full font-mono text-sm font-bold tracking-wide mb-8">
            <ShieldCheck className="w-4 h-4" /> Affordable UPI Pricing
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
                Annually <span className={`${isAnnual ? 'bg-white/20' : 'bg-green-100 text-green-700'} px-2 py-0.5 rounded text-xs`}>Save 20% (2 months free)</span>
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
            <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-black/10 shadow-lg flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2">Free</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">Kickstart your revision.</p>
              <div className="text-5xl font-bold font-sans mb-4">₹0<span className="text-xl font-medium text-foreground/50">/mo</span></div>
              <div className="mb-6"><span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">Saves ~5 hours/mo ⏳</span></div>
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
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => handlePlanClick('Free')}
                  disabled={loadingPlan !== null}
                  className="w-full block text-center py-4 rounded-full bg-brand-3 text-white font-sans font-bold hover:bg-brand-3/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                >
                  {loadingPlan === 'Free' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Started Free'}
                </button>
              </div>
            </motion.div>

            {/* Starter Tier */}
            <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-black/10 shadow-lg flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2">Starter</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">Perfect for testing the waters.</p>
              <div className="text-5xl font-bold font-sans mb-4 flex items-end">
                ₹{isAnnual ? '159' : '199'}
                <span className="text-xl font-medium text-foreground/50 mb-1">/mo</span>
                {isAnnual && <span className="text-lg line-through text-foreground/30 ml-3 mb-1">₹199</span>}
              </div>
              <div className="mb-6"><span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">Saves ~15 hours/mo ⏳</span></div>
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
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => handlePlanClick('Starter')}
                  disabled={loadingPlan !== null}
                  className="w-full block text-center py-4 rounded-full border-2 border-black/10 font-sans font-bold hover:bg-black/5 hover:border-black/20 transition-all flex justify-center items-center gap-2"
                >
                  {loadingPlan === 'Starter' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Select Starter'}
                </button>
              </div>
            </motion.div>

            {/* Pro Tier (Brand-4 Blue - HEAVILY PROMOTED WITH VIBRANT GRADIENT CONTAINER) */}
            <motion.div variants={itemVariants} className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-brand-4 shadow-[0_20px_50px_rgba(30,58,138,0.35)] relative flex flex-col bg-gradient-to-br from-brand-3 via-brand-2 to-brand-1 text-white transform md:-translate-y-6 hover:-translate-y-8 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-4/25 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-brand-1 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 z-10 border border-yellow-300">
                <Star className="w-3.5 h-3.5 fill-brand-1 text-brand-1 animate-pulse" /> Recommended • Most Popular <Star className="w-3.5 h-3.5 fill-brand-1 text-brand-1 animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2 text-white">Aspirant Pro</h3>
              <p className="font-sans text-white/70 mb-6 font-medium">For serious rankers. 🔥</p>
              <div className="text-5xl font-bold font-sans mb-4 flex items-end text-white">
                ₹{isAnnual ? '319' : '399'}
                <span className="text-xl font-medium text-white/60 mb-1">/mo</span>
                {isAnnual && <span className="text-lg line-through text-white/40 ml-3 mb-1">₹399</span>}
              </div>
              <div className="mb-6"><span className="text-xs font-bold text-yellow-300 bg-white/15 px-3 py-1.5 rounded-full border border-white/15">Saves ~35 hours/mo ⏳</span></div>
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
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => handlePlanClick('Aspirant Pro')}
                  disabled={loadingPlan !== null}
                  className="w-full block text-center py-5 rounded-full bg-white text-brand-1 font-sans text-lg font-bold hover:bg-white/95 hover:scale-[1.02] transition-all shadow-xl shadow-brand-3/20 flex justify-center items-center gap-2"
                >
                  {loadingPlan === 'Aspirant Pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Upgrade to Pro <ArrowRight className="w-5 h-5 inline" /></>}
                </button>
                <p className="text-center text-[10px] text-white/50 font-medium">Cancel anytime. No questions asked.</p>
              </div>
            </motion.div>

            {/* Unlimited Tier */}
            <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-1/30 shadow-lg flex flex-col bg-gradient-to-b from-brand-1/5 to-transparent backdrop-blur-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-1/10 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="w-12 h-12 bg-brand-1/20 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-brand-1" />
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2">Unlimited Ranker</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">The ultimate unfair advantage. 👑</p>
              <div className="text-5xl font-bold font-sans mb-4 flex items-end">
                ₹{isAnnual ? '639' : '799'}
                <span className="text-xl font-medium text-foreground/50 mb-1">/mo</span>
                {isAnnual && <span className="text-lg line-through text-foreground/30 ml-3 mb-1">₹799</span>}
              </div>
              <div className="mb-6"><span className="text-xs font-bold text-brand-1 bg-brand-1/10 px-3 py-1.5 rounded-full border border-brand-1/20">Saves ~60 hours/mo 🏆</span></div>
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
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => handlePlanClick('Unlimited')}
                  disabled={loadingPlan !== null}
                  className="w-full block text-center py-4 rounded-full border-2 border-brand-1 text-brand-1 font-sans font-bold hover:bg-brand-1 hover:text-white transition-all shadow-lg shadow-brand-1/10 flex justify-center items-center gap-2"
                >
                  {loadingPlan === 'Unlimited' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Unlimited Access'}
                </button>
                <p className="text-center text-[10px] text-foreground/50 font-medium">Cancel anytime. No questions asked.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Founder's Circle Banner */}
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto mt-12 bg-gradient-to-r from-brand-3/20 via-brand-4/20 to-brand-1/20 border border-brand-4/30 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[50px] pointer-events-none"></div>
            <div>
              <div className="inline-flex items-center gap-2 bg-black/40 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow-inner">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Limited to first 500 users
              </div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl mb-2 text-foreground">Founder's Circle Lifetime 💎</h3>
              <p className="font-sans text-foreground/70 max-w-lg">
                Pay once. Never pay again. Get <strong>Lifetime Aspirant Pro</strong> access and join the private community shaping the future of Notrik.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="text-4xl font-bold font-sans">₹7,999<span className="text-sm font-medium text-foreground/50 ml-2 line-through">₹14,999</span></div>
              <button onClick={() => handlePlanClick('Founder')} className="px-8 py-3 bg-foreground text-background font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap">
                Claim Lifetime Deal 💎
              </button>
            </div>
          </motion.div>
        </section>

        {/* Feature Comparison Table */}
        <section className="px-6 max-w-5xl mx-auto relative z-10 mb-24">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">Compare Features</h2>
            <p className="font-sans text-lg text-foreground/60">See exactly what you're getting in every tier.</p>
          </div>

          <div className="flex justify-center mb-4 lg:hidden">
            <span className="text-xs font-bold text-foreground/50 bg-black/5 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
              👈 Swipe horizontally to view full comparison 👉
            </span>
          </div>

          <div className="glass-panel rounded-[2rem] overflow-hidden border border-black/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead>
                  <tr className="bg-black/5 border-b border-black/10">
                    <th className="p-6 font-bold text-foreground">Features</th>
                    <th className="p-6 font-bold text-foreground text-center">Free</th>
                    <th className="p-6 font-bold text-foreground text-center">Starter</th>
                    <th className="p-6 font-bold text-brand-4 text-center bg-brand-4/5">Aspirant Pro</th>
                    <th className="p-6 font-bold text-brand-1 text-center">Unlimited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {[
                    { name: 'Transformations', free: '5 / week', starter: '30 / month', pro: '80 / month', unlimited: 'Unlimited *' },
                    { name: 'AI Mentor Chat Limit', free: 'Limited', starter: '25-30 / day', pro: '150 / day', unlimited: 'Unmetered *' },
                    { name: 'Extraction Quality', free: 'Standard', starter: 'High Quality', pro: 'Premium (3.5 Flash)', unlimited: 'Premium + Priority' },
                    { name: 'Auto Flashcards & Quizzes', free: 'Basic Only', starter: true, pro: true, unlimited: true },
                    { name: 'Export options', free: 'PDF Only', starter: 'PDF & Markdown', pro: 'PDF, MD, CSV', unlimited: 'PDF, MD, CSV (Full)' },
                    { name: 'Processing Priority', free: 'Standard', starter: 'Standard', pro: 'High Priority', unlimited: 'Instant Queue' },
                    { name: '1-on-1 AI Mentorship Chat', free: false, starter: false, pro: false, unlimited: true },
                    { name: 'Custom Syllabus Loading', free: false, starter: false, pro: false, unlimited: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/40 transition-colors">
                      <td className="p-6 font-medium text-foreground/80">{row.name}</td>
                      <td className="p-6 text-center text-foreground/60 font-medium">
                        {typeof row.free === 'boolean' ? (row.free ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-foreground/20" />) : row.free}
                      </td>
                      <td className="p-6 text-center text-foreground/60 font-medium">
                        {typeof row.starter === 'boolean' ? (row.starter ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-foreground/20" />) : row.starter}
                      </td>
                      <td className="p-6 text-center font-bold text-brand-4 bg-brand-4/5">
                        {typeof row.pro === 'boolean' ? (row.pro ? <Check className="w-5 h-5 mx-auto text-brand-4" /> : <X className="w-5 h-5 mx-auto text-brand-4/30" />) : row.pro}
                      </td>
                      <td className="p-6 text-center font-bold text-brand-1">
                        {typeof row.unlimited === 'boolean' ? (row.unlimited ? <Check className="w-5 h-5 mx-auto text-brand-1" /> : <X className="w-5 h-5 mx-auto text-foreground/20" />) : row.unlimited}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-12 relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="font-sans text-lg text-foreground/60">Everything you need to know about Notrik's pricing.</p>
          </div>
          
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">Is the Unlimited plan truly unlimited?</h4>
              <p className="font-sans text-foreground/70">Yes, the Unlimited plan is designed for even the most active students. To prevent server abuse, commercial scraping, or script-based spam, we implement a generous Fair Use soft limit of 150 transformations per month, and chat messages are unmetered within normal personal study usage. This is far beyond what any student needs for intensive exam preparation!</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">How accurate is it with complex JEE/NEET formulas and conceptual relations?</h4>
              <p className="font-sans text-foreground/70">Extremely accurate. Our smart extraction engine is specifically trained on Indian academic materials. It flawlessly parses complex calculus, organic chemistry mechanisms, and conceptual relations that generic tools fail on.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">Does it work well with mixed Hindi/English notes or terrible handwriting?</h4>
              <p className="font-sans text-foreground/70">Yes! Notrik is built to handle 'Hinglish' and messy cursive handwriting from fast-paced coaching classes. If a human can barely read it, Notrik can perfectly structure it.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">How are my private notes and data handled?</h4>
              <p className="font-sans text-foreground/70">With strict privacy. All your uploads and generated study sheets are encrypted in your personal Trace Drawer. We never use your private data to train public AI models.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">Is this better or cheaper than NotebookLM or ChatGPT?</h4>
              <p className="font-sans text-foreground/70">NotebookLM and ChatGPT are generic. Notrik is specialized. We automatically generate active-recall flashcards, speed quizzes, and formatted study sheets tailored to exact exam syllabi. Plus, our INR pricing makes it far more affordable for Indian students.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-black/5 bg-white/40">
              <h4 className="font-serif font-bold text-xl mb-2">Can I export to Anki, print it, or use Obsidian?</h4>
              <p className="font-sans text-foreground/70">Absolutely. You can export everything to high-quality PDFs for printing, or export directly to structured notes that integrate perfectly with Anki and Obsidian workflows.</p>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* Loading Toast Overlay */}
      <AnimatePresence>
        {loadingPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel bg-white/90 backdrop-blur-xl px-6 py-4 rounded-full shadow-2xl border border-brand-4/20 flex items-center gap-4"
          >
            <Loader2 className="w-6 h-6 text-brand-4 animate-spin" />
            <div className="font-sans">
              <span className="font-bold">Preparing checkout...</span>
              <p className="text-xs text-foreground/60">Securing your {loadingPlan} tier</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
