"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, BrainCircuit, BookOpen, Clock, 
  ArrowRight, FileText, Check, ShieldCheck,
  Zap, Layers, Target
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

export default function FeaturesPage() {
  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-brand-4/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-brand-1/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="noise-overlay fixed inset-0 z-[-1] pointer-events-none">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <main className="min-h-screen pb-32">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 text-center relative z-10 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-transparent">
          {/* Subtle top-left glow to enhance the light blue-gray feel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-brand-4/10 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="max-w-5xl mx-auto relative z-20">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 bg-brand-4/10 border border-brand-4/20 text-brand-4 px-5 py-2 rounded-full font-mono text-sm font-bold tracking-wide mb-8">
              <Sparkles className="w-4 h-4" /> The Ultimate Toolkit
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-serif font-bold text-5xl md:text-7xl mb-8 tracking-tight text-brand-1 leading-[1.1]"
            >
              Stop Rewriting Notes.<br className="hidden md:block"/> Start Actually Learning.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-sans text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8 font-medium leading-relaxed"
            >
              Notrik turns your messy coaching whiteboards, handwritten notes, and thick textbooks into clean, structured study material in seconds — so you can spend more time solving problems instead of organizing them.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="font-sans text-xs md:text-sm font-bold text-brand-3 uppercase tracking-widest mb-12 bg-brand-3/10 py-2 px-6 rounded-full inline-block border border-brand-3/20"
            >
              Free transformations on signup • Built for JEE, NEET, UPSC & serious aspirants • Works with UPI
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="inline-block w-full sm:w-auto rounded-full bg-brand-3 text-white px-10 py-5 font-sans text-lg font-bold shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-brand-3/30 transition-all duration-300"
              >
                Start Free with 5 Transformations
              </Link>
              <Link
                href="#how-it-works"
                className="inline-block w-full sm:w-auto rounded-full bg-white text-brand-3 border-2 border-brand-3/20 px-10 py-5 font-sans text-lg font-bold hover:bg-brand-3/5 transition-all duration-300"
              >
                See how it works
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Section 1: Advanced Handwriting Extraction */}
        <section id="how-it-works" className="px-6 max-w-7xl mx-auto mb-20 relative z-10">
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="glass-panel rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 bg-white/40 backdrop-blur-2xl border border-black/30 shadow-2xl overflow-hidden relative"
          >
            {/* Visual Mockup Side */}
            <div className="flex-1 w-full relative h-[400px] rounded-[2rem] overflow-hidden border border-black/10 shadow-inner bg-black/5 group">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center border-r border-black/20 filter contrast-125 grayscale-[0.2]"></div>
                <div className="w-1/2 h-full bg-[#faf9f6] p-6 font-sans text-xs md:text-sm text-foreground overflow-hidden relative border-l-4 border-brand-4 shadow-inner">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-brand-4/5 flex items-center px-4 border-b border-brand-4/20">
                    <span className="font-serif font-bold text-brand-4 tracking-wide">Clean Summary Output</span>
                  </div>
                  <div className="mt-12 space-y-4 text-foreground/80">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-4 mb-1">Newton's Second Law</h4>
                      <p className="font-medium bg-yellow-100/50 p-2 border-l-2 border-yellow-400">The rate of change of momentum is directly proportional to force.</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-black/5 text-center my-4 font-serif font-bold text-lg">
                      F = ma = m(dv/dt)
                    </div>
                    <ul className="space-y-1 pl-2">
                      <li className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-4"></div> F = net force</li>
                      <li className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-4"></div> m = mass</li>
                    </ul>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-brand-4 text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand-4/50 z-10">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Text Side */}
            <div className="flex-1 w-full">
              <div className="w-16 h-16 bg-brand-4/10 rounded-2xl flex items-center justify-center mb-8">
                <BrainCircuit className="w-8 h-8 text-brand-4" />
              </div>
              <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6 text-foreground tracking-tight">Finally, an AI that actually understands how Indian students write.</h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Reads even messy, cursive, or shorthand writing', 
                  'Understands concept relations, tables, and chemical reactions', 
                  'Turns chaotic classroom notes into clear, ready-to-revise material'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans font-medium text-foreground/90 text-lg">
                    <div className="w-6 h-6 mt-1 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-green-600" /></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="p-5 bg-brand-3/5 rounded-2xl border border-brand-3/20">
                <p className="font-sans text-brand-1 font-bold">
                  Stop spending 30–40 minutes rewriting one chapter. Get it done properly in under a minute.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Three Powerful Study Tools */}
        <section className="px-6 max-w-7xl mx-auto mb-20 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4 text-foreground tracking-tight">Get Three Powerful Study Tools From One Upload</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel p-8 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-black/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-brand-4/10 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-brand-4" />
              </div>
              <h3 className="font-serif font-bold text-2xl mb-4">Clean, Structured Summaries</h3>
              <p className="font-sans text-foreground/70 leading-relaxed">Get properly organized chapter summaries with all important concepts, formulas, and key points in one place. No more flipping through 50 pages of scattered notes.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel p-8 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-black/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-brand-2/10 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-brand-2" />
              </div>
              <h3 className="font-serif font-bold text-2xl mb-4">Active Recall Flashcards</h3>
              <p className="font-sans text-foreground/70 leading-relaxed">Automatically creates high-quality flashcards designed for active recall — the most effective way to remember massive syllabi. Ready for spaced repetition.</p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="glass-panel p-8 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-black/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-brand-1/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-brand-1" />
              </div>
              <h3 className="font-serif font-bold text-2xl mb-4">Quick Practice Quizzes</h3>
              <p className="font-sans text-foreground/70 leading-relaxed">Instantly generates short quizzes with explanations so you can test yourself immediately and find weak areas before the exam.</p>
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-8 text-center max-w-3xl mx-auto">
            <p className="font-sans text-lg font-medium text-brand-1 bg-brand-1/5 p-4 rounded-full border border-brand-1/10">
              Most students spend hours creating these materials manually. Notrik does it in seconds so you can focus on understanding and practice.
            </p>
          </motion.div>
        </section>

        {/* Section 3: Professional Quality */}
        <section className="px-6 max-w-7xl mx-auto mb-20 relative z-10">
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="glass-panel rounded-[3rem] p-8 md:p-16 bg-gradient-to-br from-brand-4/5 to-transparent backdrop-blur-xl border border-black/10 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6 text-foreground tracking-tight">Study Material That Looks Like It Was Made by a Topper</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    'Clean, well-organized notes that are easy to revise',
                    'Scientific equations and formulas appear properly formatted and clear',
                    'Diagrams and tables come out neat and readable',
                    'Everything feels professional and exam-ready (not like raw AI output)'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-foreground/80 text-lg">
                      <div className="w-6 h-6 mt-1 rounded-full bg-brand-4/10 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-brand-4" /></div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
                  <p className="font-sans text-brand-3 font-medium">
                    "When your study material looks this good, revision becomes faster and more effective. You stop second-guessing whether you’ve covered everything."
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="glass-panel p-4 rounded-2xl bg-white border border-black/10 shadow-md transform -rotate-3 hover:rotate-0 transition-transform origin-bottom-right">
                  <div className="w-full h-32 bg-brand-4/5 rounded-lg mb-3 flex flex-col gap-2 p-3">
                    <div className="h-3 w-1/2 bg-brand-4/20 rounded"></div>
                    <div className="h-2 w-full bg-black/5 rounded"></div>
                    <div className="h-2 w-full bg-black/5 rounded"></div>
                    <div className="h-2 w-3/4 bg-black/5 rounded"></div>
                  </div>
                  <p className="text-xs font-bold text-center text-foreground/50 uppercase tracking-widest">Summary</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl bg-white border border-black/10 shadow-md transform rotate-3 hover:rotate-0 transition-transform origin-bottom-left translate-y-8">
                  <div className="w-full h-32 bg-brand-2/5 rounded-lg mb-3 flex items-center justify-center p-3">
                    <div className="text-center">
                      <div className="h-3 w-20 bg-brand-2/20 rounded mx-auto mb-2"></div>
                      <div className="h-2 w-16 bg-black/10 rounded mx-auto"></div>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-center text-foreground/50 uppercase tracking-widest">Flashcard</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 4: How It Works in Practice */}
        <section className="px-6 max-w-5xl mx-auto mb-20 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4 text-foreground tracking-tight">From Messy Notes to Exam-Ready Material in 3 Simple Steps</h2>
          </motion.div>

          <div className="relative border-l-2 border-brand-4/20 pl-8 ml-4 md:ml-12 space-y-16 mb-12">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-brand-4 flex items-center justify-center text-white font-bold font-mono text-sm shadow-lg shadow-brand-4/30">1</div>
              <h3 className="font-serif font-bold text-2xl mb-2">Upload Your Chaos</h3>
              <p className="font-sans text-foreground/70 text-lg max-w-2xl">Take a photo of your coaching whiteboard, scan handwritten notes, or upload textbook PDFs. Works with photos, PDFs, and documents.</p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-brand-1 flex items-center justify-center text-white font-bold font-mono text-sm shadow-lg shadow-brand-1/30">2</div>
              <h3 className="font-serif font-bold text-2xl mb-2">Let Notrik Do the Heavy Lifting</h3>
              <p className="font-sans text-foreground/70 text-lg max-w-2xl">Our specialized engine reads and understands your notes — even messy handwriting and complex concept relations — and turns them into clear, structured study material automatically.</p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-brand-3 flex items-center justify-center text-white font-bold font-mono text-sm shadow-lg shadow-brand-3/30">3</div>
              <h3 className="font-serif font-bold text-2xl mb-2">Study Smarter, Not Harder</h3>
              <p className="font-sans text-foreground/70 text-lg max-w-2xl">Get clean summaries, ready-to-use flashcards, and quick quizzes. Edit anything you want, then export to Anki, print it, or save it for later.</p>
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center bg-white/50 p-6 rounded-2xl border border-brand-4/10 shadow-sm max-w-3xl mx-auto">
            <p className="font-sans text-lg font-bold text-foreground">
              Most aspirants waste 2–3 hours every day just organizing and rewriting notes. Notrik gives that time back to you.
            </p>
          </motion.div>
        </section>

        {/* Section 5: Never Lose Your Work */}
        <section className="px-6 max-w-7xl mx-auto mb-20 relative z-10">
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="glass-panel rounded-[3rem] p-8 md:p-16 bg-white/60 backdrop-blur-2xl border border-black/10 shadow-lg flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <div className="w-14 h-14 bg-brand-4/10 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-7 h-7 text-brand-4" />
              </div>
              <h2 className="font-serif font-bold text-4xl mb-6 text-foreground tracking-tight">Everything You Create Stays With You — Organized and Easy to Find</h2>
              <ul className="space-y-4 mb-8">
                {[
                  'All your transformations are automatically saved in one secure place',
                  'Powerful search so you can instantly find any topic or note',
                  'Context-aware AI mentor that understands your current notes and can answer doubts',
                  'Easy to revise old material during the final months'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-foreground/80 text-lg">
                    <div className="w-2 h-2 mt-2 rounded-full bg-brand-4 flex-shrink-0"></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <p className="font-sans text-brand-1 font-medium bg-brand-1/5 p-4 rounded-xl border border-brand-1/10">
                No more losing important notes or spending time searching through folders. Everything is organized and accessible whenever you need it.
              </p>
            </div>
            <div className="flex-1 w-full bg-black/5 rounded-2xl p-6 border border-black/10">
               <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 mb-4">
                 <div className="w-5 h-5 border-2 border-black/20 rounded-full"></div>
                 <div className="h-4 w-32 bg-black/10 rounded"></div>
               </div>
               <div className="space-y-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="bg-white/50 rounded-lg p-3 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-brand-4/10 rounded flex items-center justify-center"><FileText className="w-4 h-4 text-brand-4" /></div>
                       <div className="h-3 w-24 bg-black/20 rounded"></div>
                     </div>
                     <div className="text-xs text-black/40 font-mono">Saved</div>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        </section>

        {/* Section 6: Exports */}
        <section className="px-6 max-w-7xl mx-auto mb-20 relative z-10">
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="glass-panel rounded-[3rem] p-8 md:p-16 bg-white/40 backdrop-blur-2xl border border-black/10 shadow-lg flex flex-col md:flex-row-reverse items-center gap-12"
          >
            <div className="flex-1">
              <div className="w-14 h-14 bg-brand-2/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-brand-2" />
              </div>
              <h2 className="font-serif font-bold text-4xl mb-6 text-foreground tracking-tight">Your Notes, Your Way — Export in Seconds</h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Export clean summaries and flashcards as PDFs (looks like a proper printed study guide)',
                  'Export flashcards directly into Anki format (huge for students who already use Anki)',
                  'Clean Markdown export that works perfectly with Obsidian and other tools',
                  'Print-ready format that saves paper and looks professional'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-foreground/80 text-lg">
                    <div className="w-2 h-2 mt-2 rounded-full bg-brand-2 flex-shrink-0"></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <p className="font-sans text-brand-3 font-medium bg-brand-3/5 p-4 rounded-xl border border-brand-3/10">
                Stop manually copying notes into Anki or formatting PDFs for printing. Notrik does it perfectly in one click.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              {['PDF Export', 'Anki Deck', 'Markdown', 'Print-Ready'].map((type, i) => (
                <div key={i} className="glass-panel bg-white p-6 rounded-2xl border border-black/5 shadow-sm text-center flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-black/40 -rotate-45" />
                  </div>
                  <span className="font-serif font-bold text-foreground/80">{type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 7: Built for India */}
        <section className="px-6 max-w-4xl mx-auto mb-24 relative z-10 text-center">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-serif font-bold text-4xl md:text-5xl mb-10 text-foreground tracking-tight">Made for Students Who Are Serious About Ranking</h2>
            <div className="text-left space-y-6">
              {[
                'Works with the exact style of notes Indian students actually create (coaching whiteboards, NCERT-style material, dense textbooks)',
                'Affordable pricing in INR with native UPI payments (Google Pay, PhonePe, Paytm)',
                'Designed around the real pressure and syllabus of JEE, NEET, UPSC and similar exams'
              ].map((feat, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-brand-4/10 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-brand-4" /></div>
                  <p className="font-sans text-foreground/90 text-lg">{feat}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 8: CTA */}
        <section className="px-6 max-w-5xl mx-auto mt-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#e0e7ff] via-white to-[#f3e8ff] border border-black/10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6 text-brand-1 tracking-tight max-w-3xl leading-[1.1]">
                Stop Spending Hours on Notes. Start Spending Them on Actual Studying.
              </h2>
              <p className="font-sans text-xl text-foreground/70 mb-10 max-w-2xl font-medium">
                Join thousands of aspirants who have already reclaimed their time and are studying smarter with Notrik.
              </p>
              <Link href="/signup" className="px-10 py-5 bg-brand-3 text-white rounded-full font-sans font-bold text-xl shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-brand-3/30 transition-all flex items-center gap-3">
                Start Free with 5 Transformations <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="font-sans text-sm font-medium text-foreground/50 mt-6 tracking-wide">
                No credit card required • Cancel anytime
              </p>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}} />
    </>
  );
}
