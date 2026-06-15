"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  Scaling, BookOpen, Target, Briefcase, Cpu, 
  ArrowRight, Sparkles, Check
} from "lucide-react";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

export default function ExamsPage() {
  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-brand-2/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-brand-4/10 rounded-full blur-[150px] animate-blob"></div>
      </div>
      
      <div className="noise-overlay fixed inset-0 z-[-1] pointer-events-none">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <main className="min-h-screen pb-32 overflow-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 bg-brand-4/10 border border-brand-4/20 text-brand-4 px-5 py-2 rounded-full font-mono text-sm font-bold tracking-wide mb-8">
            <Target className="w-4 h-4" /> Syllabus specific tuning
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif font-bold text-5xl md:text-8xl mb-6 tracking-tight text-balance">
            Crack the <span className="text-brand-4">Toughest</span> Exams.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-sans text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-6">
            Notrik is perfectly tuned for the rigorous demands of top Indian competitive exams. Prepare smarter, not harder.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="font-sans text-sm md:text-base text-brand-4/80 max-w-2xl mx-auto font-medium italic">
            Designed with the exact syllabus patterns, PYQ traps, and time pressure that Indian rankers face every day.
          </motion.p>
        </section>

        {/* --- JEE BLOCK --- */}
        <section className="px-6 max-w-7xl mx-auto mb-24 relative z-10 group">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-r from-brand-1/5 to-transparent border border-black/10 group-hover:border-black/30 transition-colors duration-500 shadow-xl overflow-hidden relative">
            <div className="flex-1">
              <div className="w-16 h-16 bg-brand-1/10 rounded-2xl flex items-center justify-center mb-6">
                <Scaling className="w-8 h-8 text-brand-1" />
              </div>
              <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6">JEE Mains & Advanced</h2>
              <p className="font-sans text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
                Stop struggling with messy whiteboard photos from your coaching classes. Notrik perfectly extracts complex organic chemistry mechanisms, physics formulas, and advanced calculus theorems into pristine, structured study sheets.
              </p>
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs font-bold font-mono bg-white border border-brand-1/20 px-4 py-2 rounded-full shadow-sm text-brand-1">Physics Formulas</span>
                <span className="text-xs font-bold font-mono bg-white border border-brand-1/20 px-4 py-2 rounded-full shadow-sm text-brand-1">Organic Chemistry</span>
                <span className="text-xs font-bold font-mono bg-white border border-brand-1/20 px-4 py-2 rounded-full shadow-sm text-brand-1">Calculus Proofs</span>
              </div>
            </div>
            {/* CSS Mockup */}
            <div className="flex-1 w-full relative h-[350px] rounded-[2rem] bg-[#faf9f6] p-6 font-sans text-foreground overflow-hidden shadow-2xl border-2 border-brand-1/20 group">
              <div className="absolute top-0 left-0 right-0 h-10 bg-brand-1/10 flex items-center px-4 border-b border-brand-1/20">
                <span className="font-serif font-bold text-brand-1 tracking-wide">Organic Chemistry Notes</span>
              </div>
              <div className="mt-8 space-y-4 text-foreground/80 p-2">
                <h4 className="font-serif font-bold text-xl text-brand-1 border-b-2 border-brand-1/20 pb-2 inline-block">Electrophilic Aromatic Substitution</h4>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-3 bg-white p-3 rounded-lg border border-black/5 shadow-sm group-hover:border-brand-1/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-brand-1/20 text-brand-1 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <p className="font-medium">Generation of Electrophile (E+)</p>
                  </div>
                  <div className="flex gap-3 bg-white p-3 rounded-lg border border-black/5 shadow-sm group-hover:border-brand-1/30 transition-colors delay-75">
                    <div className="w-6 h-6 rounded-full bg-brand-1/20 text-brand-1 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <p className="font-medium">Attack of E+ on Benzene Ring (Rate Determining Step)</p>
                  </div>
                  <div className="flex gap-3 bg-white p-3 rounded-lg border border-black/5 shadow-sm group-hover:border-brand-1/30 transition-colors delay-150">
                    <div className="w-6 h-6 rounded-full bg-brand-1/20 text-brand-1 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <p className="font-medium">Loss of Proton to yield substituted Benzene</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-green-200"><Check className="w-3 h-3"/> Structured perfectly</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- NEET BLOCK --- */}
        <section className="px-6 max-w-7xl mx-auto mb-24 relative z-10 group">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row-reverse items-center gap-12 bg-gradient-to-l from-brand-3/5 to-transparent border border-black/10 group-hover:border-black/30 transition-colors duration-500 shadow-xl overflow-hidden relative">
            <div className="flex-1">
              <div className="w-16 h-16 bg-brand-3/10 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-brand-3" />
              </div>
              <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6">NEET (UG & PG)</h2>
              <p className="font-sans text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
                Biology demands absolute rote memorization and conceptual clarity from NCERT. Upload your highlighted pages, and Notrik will auto-generate interactive, spaced-repetition flashcards for fast recall. Never forget a single taxonomy classification.
              </p>
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs font-bold font-mono bg-white border border-brand-3/20 px-4 py-2 rounded-full shadow-sm text-brand-3">Taxonomy Flashcards</span>
                <span className="text-xs font-bold font-mono bg-white border border-brand-3/20 px-4 py-2 rounded-full shadow-sm text-brand-3">Anatomy Diagrams</span>
              </div>
            </div>
            {/* CSS Mockup */}
            <div className="flex-1 w-full relative h-[350px] rounded-[2rem] bg-white border border-black/10 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
              
              <div className="relative w-64 h-80 perspective-1000 group">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-brand-3/20 transform preserve-3d group-hover:rotate-y-180 transition-transform duration-700">
                  <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-center items-center text-center bg-brand-3/5 rounded-2xl">
                    <span className="text-xs font-bold text-brand-3 tracking-widest uppercase mb-4">Question</span>
                    <h3 className="font-serif font-bold text-xl">What is the functional unit of the kidney?</h3>
                  </div>
                  <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-center items-center text-center bg-brand-3 text-white rounded-2xl" style={{ transform: 'rotateY(180deg)' }}>
                    <span className="text-xs font-bold text-white/80 tracking-widest uppercase mb-4">Answer</span>
                    <h3 className="font-serif font-bold text-3xl">Nephron</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- UPSC BLOCK --- */}
        <section className="px-6 max-w-7xl mx-auto mb-24 relative z-10 group">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-r from-brand-2/5 to-transparent border border-black/10 group-hover:border-black/30 transition-colors duration-500 shadow-xl overflow-hidden relative">
            <div className="flex-1">
              <div className="w-16 h-16 bg-brand-2/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-brand-2" />
              </div>
              <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6">UPSC Civil Services</h2>
              <p className="font-sans text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
                Taming the massive syllabus requires structure. Convert daily 'The Hindu' or 'Indian Express' editorials into structured bullet points with pros, cons, and a unified conclusion. Create an organized digital library of current affairs.
              </p>
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs font-bold font-mono bg-white border border-brand-2/20 px-4 py-2 rounded-full shadow-sm text-brand-2">Editorial Summaries</span>
                <span className="text-xs font-bold font-mono bg-white border border-brand-2/20 px-4 py-2 rounded-full shadow-sm text-brand-2">Mains Answer Structuring</span>
              </div>
            </div>
            {/* CSS Mockup */}
            <div className="flex-1 w-full relative h-[350px] rounded-[2rem] bg-[#f8f6f0] border border-black/10 shadow-inner p-8 overflow-hidden group">
              <div className="w-full h-full border-l-4 border-brand-2 pl-6 py-2 flex flex-col gap-4">
                <h4 className="font-serif font-bold text-xl uppercase tracking-widest text-brand-2 border-b border-black/5 pb-2">Editorial Analysis</h4>
                <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <Check className="w-4 h-4 text-green-600" /> <span className="font-medium text-sm">Key Arguments Identified</span>
                </div>
                <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                  <Check className="w-4 h-4 text-green-600" /> <span className="font-medium text-sm">Pros / Cons Matrix Generated</span>
                </div>
                <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-200">
                  <Check className="w-4 h-4 text-green-600" /> <span className="font-medium text-sm">Suggested Conclusion Drafted</span>
                </div>
                <div className="mt-auto bg-white p-4 rounded-xl shadow-sm border border-black/5">
                  <div className="h-2 w-full bg-black/10 rounded mb-2"></div>
                  <div className="h-2 w-3/4 bg-black/10 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- CA & GATE Grid --- */}
        <section className="px-6 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CA/CS */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel rounded-[3rem] p-10 bg-white/40 border border-black/10 hover:border-black/30 transition-colors duration-500 shadow-xl group">
              <div className="w-14 h-14 bg-brand-4/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-brand-4" />
              </div>
              <h3 className="font-serif font-bold text-3xl mb-4">CA / CS / CMA</h3>
              <p className="font-sans text-foreground/70 leading-relaxed mb-6">
                Upload pages of dense ICAI study material. Notrik perfectly extracts the critical Sections, penalties, and compliance dates, putting them into easily digestible tables.
              </p>
              <div className="flex gap-2">
                <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full">Taxation</span>
                <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full">Auditing Compliance</span>
              </div>
            </motion.div>

            {/* GATE */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel rounded-[3rem] p-10 bg-white/40 border border-black/10 hover:border-black/30 transition-colors duration-500 shadow-xl group">
              <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-serif font-bold text-3xl mb-4">GATE Engineering</h3>
              <p className="font-sans text-foreground/70 leading-relaxed mb-6">
                Condense four years of engineering into manageable short notes. Extract core formulas and important derivations from standard textbooks directly into your Trace Drawer.
              </p>
              <div className="flex gap-2">
                <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full">Aptitude Math</span>
                <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full">Core Engineering Derivations</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Success Path */}
        <section className="px-6 max-w-5xl mx-auto mt-24 mb-32 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4 text-foreground tracking-tight">The Ultimate Success Path.</h2>
            <p className="font-sans text-xl text-foreground/70">How top rankers are using Notrik to hack their syllabus.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-panel p-8 rounded-3xl bg-white/40 border border-black/5 relative group">
              <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">📚</div>
              <h4 className="font-serif font-bold text-xl mb-2">1. Digest Heavy Textbooks</h4>
              <p className="font-sans text-foreground/70 text-sm">Upload standard textbooks (e.g. HC Verma, Laxmikanth). Notrik instantly extracts the core concepts, removing the fluff and leaving you with high-yield summaries.</p>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-panel p-8 rounded-3xl bg-brand-4/10 border border-brand-4/20 relative group transform md:translate-y-8">
              <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">⚡</div>
              <h4 className="font-serif font-bold text-xl mb-2 text-brand-4">2. Build Active Recall</h4>
              <p className="font-sans text-foreground/70 text-sm">Convert those high-yield summaries into interactive flashcards automatically. Study them daily using our spaced-repetition algorithms to guarantee retention.</p>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-panel p-8 rounded-3xl bg-white/40 border border-black/5 relative group">
              <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">🎯</div>
              <h4 className="font-serif font-bold text-xl mb-2">3. Speed Test</h4>
              <p className="font-sans text-foreground/70 text-sm">Before the mock exam, run a generated speed-quiz based specifically on your weak areas identified from the flashcards. Achieve mastery.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 max-w-4xl mx-auto mt-32 relative z-10 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 rounded-[3rem] bg-gradient-to-br from-brand-4/10 to-brand-1/10 border border-brand-4/20 flex flex-col items-center text-center shadow-2xl shadow-brand-4/10 overflow-hidden relative"
          >
            <HandWrittenTitle 
              title="Stop writing. Start ranking." 
              subtitle="Join the elite ranks of aspirants who have automated the hardest part of preparation."
            />
            <Link href="/onboarding" className="relative z-10 px-10 py-5 bg-brand-4 text-white rounded-full font-sans font-bold text-lg shadow-xl hover:scale-105 hover:shadow-brand-4/20 transition-all flex items-center gap-3">
              Upgrade to Pro <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}
