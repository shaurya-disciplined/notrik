"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  ArrowRight, Upload, BrainCircuit, BookOpenCheck, 
  FileText, Sparkles, Layers, ListChecks, ArrowUpRight, Plus, Minus,
  Camera, FileUp, Video, Link as LinkIcon, Grid, MessageSquare, Check,
  Star, Zap, Crown
} from "lucide-react";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import RadialOrbitalTimeline from "@/components/RadialOrbitalTimeline";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Helper for FAQ Accordion
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-black/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <h3 className="font-serif font-bold text-xl md:text-2xl text-foreground group-hover:text-brand-3 transition-colors">{question}</h3>
        <span className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center shrink-0 group-hover:bg-brand-3/10 group-hover:text-brand-3 transition-colors">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="font-sans text-foreground/70 text-lg leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

function BeforeAfterPreview() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className="w-full max-w-6xl mx-auto mt-24 md:mt-32 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center">
      
      {/* LEFT: Before */}
      <div className="flex-1 bg-black rounded-[2rem] sm:rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl flex flex-col group min-h-[300px] md:min-h-[500px]">
        <div className="absolute top-6 left-6 z-20 bg-red-600/90 text-white px-5 py-2.5 rounded-xl text-xs font-black font-sans shadow-[0_0_25px_rgba(220,38,38,0.7)] border border-red-500 flex items-center gap-2 tracking-wide uppercase backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span>Before: Unstructured Chaos ⚠️</span>
        </div>
        <img src="/Notrik-test-and-b4-after-image.jpeg" alt="Messy Whiteboard Notes" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
      </div>

      {/* RIGHT: After */}
      <div className="flex-[1.2] bg-brand-4/5 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 border border-brand-3/20 shadow-2xl flex flex-col relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20 bg-emerald-600/90 text-white px-5 py-2.5 rounded-xl text-xs font-black font-sans shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-emerald-500 flex items-center gap-2 tracking-wide uppercase backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>After: Actionable Clarity ✨</span>
        </div>
        
        <div className="flex-1 mt-20 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Markdown Snippet */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-brand-2/30 transition-colors">
             <div className="font-mono text-xs text-left z-10 relative">
               <h4 className="font-bold mb-3 text-brand-2 border-b border-black/10 pb-2 text-sm flex items-center gap-2">
                 <FileText className="w-4 h-4" /> Math Summary
               </h4>
               <div className="bg-brand-4/10 text-brand-2 p-1 rounded-lg mb-3 font-bold text-center border border-brand-4/30 text-sm flex items-center justify-center overflow-x-auto">
                 <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                   {"$$\\binom{m}{k} = \\frac{m!}{k!(m-k)!}$$"}
                 </ReactMarkdown>
               </div>
               <ul className="list-disc pl-4 space-y-1.5 text-foreground/70 text-[11px]">
                 <li><strong>m</strong>: Exponent of complex expansion</li>
                 <li><strong>Usage</strong>: Number of ways to choose k items from m, without order.</li>
                 <li><strong>Context</strong>: Chapter on Complex Numbers (Binomial Theorem).</li>
               </ul>
             </div>
          </div>

          {/* Flashcard */}
          <div className="relative h-48 sm:h-auto perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div 
              className="w-full h-full preserve-3d transition-transform duration-700 shadow-lg rounded-2xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              <div className="absolute inset-0 bg-white rounded-2xl border border-black/10 p-6 flex flex-col justify-center items-center text-center backface-hidden group hover:border-brand-1/30 transition-colors">
                <Layers className="w-6 h-6 text-brand-1 mb-3" />
                <h4 className="font-serif font-bold text-lg text-brand-1 mb-3 leading-tight">What is Active Recall?</h4>
                <p className="font-sans text-brand-3 text-[10px] font-bold bg-brand-3/10 px-3 py-1.5 rounded-full uppercase tracking-wider">Tap to flip 🔄</p>
              </div>
              <div className="absolute inset-0 bg-brand-3 text-white rounded-2xl shadow-xl border border-brand-3 p-6 flex flex-col justify-center items-center text-center backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                <p className="font-sans font-medium text-sm leading-relaxed">
                  Actively stimulating your memory to retrieve information, vastly improving long-term retention. 🧠
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Quiz Question */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 shadow-lg sm:col-span-2 hover:border-brand-4/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-brand-4" /> Practice Quiz
              </h4>
              <span className="text-[10px] font-bold text-brand-4 bg-brand-4/10 px-2 py-1 rounded-md uppercase">MCQ</span>
            </div>
            <p className="font-sans text-sm text-foreground/90 mb-4 font-medium">Which organelle is responsible for ATP production?</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/5 hover:bg-black/10 cursor-pointer transition-colors rounded-xl p-3 text-center font-sans text-xs font-bold">Nucleus</div>
              <div className="bg-brand-3 text-white shadow-md rounded-xl p-3 text-center font-sans text-xs font-bold border border-brand-3 flex items-center justify-center gap-1">
                Mitochondria <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Inside After */}
        <div className="mt-8 pt-8 border-t border-brand-3/10 flex justify-center">
          <Link href="/signup" className="w-full sm:w-auto bg-brand-1 text-white font-sans font-bold py-4 px-8 rounded-full shadow-xl shadow-brand-1/20 hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group">
            <span>Get 5 Free Transformations 🚀</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 200]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -100]);
  const y4 = useTransform(scrollY, [0, 2000], [0, 250]);

  // Entrance animations for the assets (runs only once on load)
  const assetIntro = {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    visible: (custom: number) => ({
      opacity: 0.9,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.5, delay: custom * 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }
    })
  };

  return (
    <div className="relative bg-background text-foreground overflow-hidden">
      {/* Floating Background Assets */}
      <motion.img
        src="/spiral-math-notes.png"
        alt="Spiral Math Notes"
        variants={assetIntro}
        initial="hidden"
        animate="visible"
        custom={0}
        style={{ y: y1 }}
        className="absolute top-20 -right-40 md:-right-4 w-64 md:w-[27rem] mix-blend-multiply contrast-125 brightness-110 z-0 pointer-events-none select-none rotate-12 opacity-30 md:opacity-100"
      />
      <motion.img
        src="/neat-yellow-pencils.png"
        alt="Neat Yellow Pencils"
        variants={assetIntro}
        initial="hidden"
        animate="visible"
        custom={1}
        style={{ y: y2 }}
        className="absolute top-[125vh] md:top-[135vh] -left-48 md:-left-24 w-56 md:w-[26rem] mix-blend-multiply contrast-125 brightness-110 z-0 pointer-events-none select-none -rotate-12 hidden md:block"
      />
      <motion.img
        src="/open-textbook.png"
        alt="Open Academic Textbook"
        variants={assetIntro}
        initial="hidden"
        animate="visible"
        custom={2}
        style={{ y: y3 }}
        className="absolute top-[80vh] md:top-[85vh] -right-20 md:-right-2 w-56 md:w-[26rem] mix-blend-multiply contrast-125 brightness-110 z-0 pointer-events-none select-none rotate-[15deg] hidden md:block opacity-100"
      />
      <motion.img
        src="/website-bio-notes-img.jpeg"
        alt="Biology Notes"
        variants={assetIntro}
        initial="hidden"
        animate="visible"
        custom={3}
        style={{ y: y4 }}
        className="absolute top-[20vh] md:top-[25vh] -left-48 md:-left-24 w-80 md:w-[38rem] mix-blend-multiply contrast-[1.3] brightness-125 z-0 pointer-events-none select-none -rotate-6 hidden md:block"
      />

      <main className="min-h-screen relative z-10">
        <Navbar />
        
        {/* 1. HERO SECTION */}
        <section id="hero-demo" className="relative pt-24 pb-24 md:pt-32 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center">

          <motion.h1 variants={fadeInUp} initial="initial" animate="whileInView" transition={{ delay: 0.1 }} className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-brand-1 max-w-5xl leading-[1.1] mb-8 relative z-10">
            Turn Your Messy Handwritten<br className="hidden md:block" /> JEE & NEET Notes into Perfect<br className="hidden md:block" /> <span className="text-brand-3">Flashcards, Quizzes</span> & <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent font-black">Structured Interactive Notes</span> in Seconds.
          </motion.h1>
          
          <motion.div variants={fadeInUp} initial="initial" animate="whileInView" transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center relative z-10">
            <Link
              href="/signup"
              className="group w-full sm:w-auto relative overflow-hidden rounded-full bg-brand-3 text-white px-10 py-5 font-sans text-lg font-bold shadow-xl shadow-brand-3/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span className="relative z-10">Try the Live Demo</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.p variants={fadeInUp} initial="initial" animate="whileInView" transition={{ delay: 0.4 }} className="font-sans text-sm md:text-base text-foreground/60 mt-6 relative z-10 font-bold max-w-2xl">
            Built for serious aspirants targeting IITs, AIIMS & top ranks. <br className="md:hidden" /> Start transforming notes in 30 seconds.
          </motion.p>

          {/* New Before/After Mockup */}
          <div className="w-full relative z-10">
            <BeforeAfterPreview />
          </div>
        </section>

        {/* 2. RADIAL TIMELINE / THE ENGINE */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden sm:overflow-visible">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16 relative">
            <h2 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight mb-6 text-brand-1 relative">
              See Exactly How Notrik Transforms Chaos into Clarity
            </h2>
            <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
              Click or hover the interactive orbit below to see our proprietary AI transform messy scribbles into structured study formats.
            </p>
          </motion.div>

          <RadialOrbitalTimeline />

          {/* Try the Live Demo Above button */}
          <div className="flex justify-center mt-12 relative z-10">
            <button 
              onClick={() => document.getElementById("hero-demo")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-brand-3/15 hover:bg-brand-3/25 text-brand-3 font-sans font-bold px-8 py-3.5 rounded-full border border-brand-3/30 transition-all flex items-center gap-2"
            >
              <span>Try the Live Demo Above</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3. 3-STEP PROCESS SECTION */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 bg-white relative z-20 border-t border-black/5 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }}>
              <h2 className="font-serif font-bold text-2xl sm:text-4xl md:text-6xl tracking-tight mb-6 text-brand-1">Studying shouldn't take hours to prepare.</h2>
              <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto mb-16">
                Built specifically for students who want to study faster, cover more syllabus, and retain everything.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="bg-brand-4/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:shadow-2xl hover:-translate-y-2 transition-all text-left">
                <div className="w-14 h-14 rounded-2xl bg-brand-3 text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-3/20">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-brand-1 mb-4">1. Upload your notes</h3>
                <p className="font-sans text-foreground/70 leading-relaxed">
                  PDFs, textbook pages, messy whiteboards, or images. Drop any format into Notrik and let the Vision AI extract the content instantly.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="bg-brand-4/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:shadow-2xl hover:-translate-y-2 transition-all text-left">
                <div className="w-14 h-14 rounded-2xl bg-brand-3 text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-3/20">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-brand-1 mb-4">2. AI generates materials</h3>
                <p className="font-sans text-foreground/70 leading-relaxed">
                  Our custom pipeline generates perfectly formatted markdown, interactive flashcards, practice tests, and key-term glossaries in seconds.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="bg-brand-4/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:shadow-2xl hover:-translate-y-2 transition-all text-left">
                <div className="w-14 h-14 rounded-2xl bg-brand-3 text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-3/20">
                  <BookOpenCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-brand-1 mb-4">3. Study with active recall</h3>
                <p className="font-sans text-foreground/70 leading-relaxed">
                  Ditch passive reading. Use our built-in spaced repetition flashcards and test yourself with AI-generated mock exams to lock in retention.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. 6 STUDY FORMATS */}
        <section className="py-24 px-6 md:px-12 bg-brand-1 text-white relative overflow-hidden rounded-[3rem] mx-4 md:mx-12 my-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-10 bg-cover bg-center pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-brand-3/20 text-brand-4 px-4 py-2 rounded-full font-sans text-sm font-bold uppercase tracking-wider mb-6 border border-brand-3/50">
                Core Feature
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-4xl md:text-6xl mb-4">6 Study Formats, One Upload</h2>
              <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 font-semibold">
                Upload your source material once. Get everything you need to master it.
              </p>
              <p className="font-sans text-xs md:text-sm font-bold text-brand-4 mb-12 uppercase tracking-widest bg-brand-3/15 py-2 px-6 rounded-full inline-block border border-brand-3/20">
                All generated from a single upload — no switching apps or re-typing.
              </p>
            </motion.div>

            {/* Core Outputs Row */}
            <div className="mb-12">
              <h3 className="font-serif font-black text-xl md:text-2xl text-left mb-6 text-brand-4 tracking-wide border-b border-white/10 pb-2">Core Revision Tools</h3>
              <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 text-left">
                {[
                  { 
                    title: "Summarized Notes", 
                    desc: "Key concepts distilled into clear, scannable markdown.", 
                    icon: FileText,
                    benefits: ["Clean LaTeX math formulas", "Clear dynamic headings"]
                  },
                  { 
                    title: "AI Flashcards", 
                    desc: "Active recall cards generated for long-term retention.", 
                    icon: Layers,
                    benefits: ["Spaced-repetition ready", "Tap to flip components"]
                  },
                  { 
                    title: "Practice Tests", 
                    desc: "Full mock exams combining MCQ, short answers & reviews.", 
                    icon: BookOpenCheck,
                    benefits: ["Exam-focused questions", "Detailed answer explanations"]
                  }
                ].map((feature, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="bg-white/5 border border-white/20 shadow-lg shadow-black/20 p-4 sm:p-8 rounded-3xl hover:bg-white/10 hover:shadow-xl hover:border-white/30 transition-all backdrop-blur-sm flex flex-col justify-between min-h-[220px] md:min-h-[260px] group">
                    <div>
                      <feature.icon className="w-8 h-8 text-brand-4 mb-4" />
                      <h4 className="font-serif font-black text-lg md:text-2xl mb-2 text-white">{feature.title}</h4>
                      <p className="font-sans text-white/70 text-xs md:text-sm leading-relaxed mb-4">{feature.desc}</p>
                    </div>
                    <div className="space-y-1 mt-auto pt-2 border-t border-white/5">
                      {feature.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px] md:text-xs font-bold text-brand-4">
                          <Check className="w-3 h-3 text-brand-4 animate-pulse" strokeWidth={3} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Advanced & Support Row */}
            <div>
              <h3 className="font-serif font-black text-xl md:text-2xl text-left mb-6 text-brand-4 tracking-wide border-b border-white/10 pb-2">Advanced Deep Study</h3>
              <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 text-left">
                {[
                  { 
                    title: "Key Terms", 
                    desc: "Vocabulary and definitions extracted at a glance.", 
                    icon: Sparkles,
                    benefits: ["Auto glossary extraction", "Fast search queries"]
                  },
                  { 
                    title: "Structured Tables", 
                    desc: "Differences and comparisons automatically mapped.", 
                    icon: Grid,
                    benefits: ["Side-by-side properties", "Easy classification"]
                  },
                  { 
                    title: "AI Tutor Chat", 
                    desc: "Ask questions and clarify doubts directly on your notes.", 
                    icon: MessageSquare,
                    benefits: ["24/7 direct query solver", "Context-aware responses"]
                  }
                ].map((feature, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="bg-white/5 border border-white/20 shadow-lg shadow-black/20 p-4 sm:p-8 rounded-3xl hover:bg-white/10 hover:shadow-xl hover:border-white/30 transition-all backdrop-blur-sm flex flex-col justify-between min-h-[220px] md:min-h-[260px] group">
                    <div>
                      <feature.icon className="w-8 h-8 text-brand-4 mb-4" />
                      <h4 className="font-serif font-black text-lg md:text-2xl mb-2 text-white">{feature.title}</h4>
                      <p className="font-sans text-white/70 text-xs md:text-sm leading-relaxed mb-4">{feature.desc}</p>
                    </div>
                    <div className="space-y-1 mt-auto pt-2 border-t border-white/5">
                      {feature.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px] md:text-xs font-bold text-brand-4">
                          <Check className="w-3 h-3 text-brand-4 animate-pulse" strokeWidth={3} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>
        </section>

        {/* 5. TURN ANY SOURCE INTO STUDY MATERIALS */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
          
          {/* Red Paperclip Asset */}
          <motion.img
            src="/paper-clip.jpeg"
            alt="Red Paperclip"
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            whileInView={{ opacity: 0.9, scale: 1, rotate: -55 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-4 md:top-8 -left-16 md:-left-36 w-52 md:w-80 mix-blend-multiply contrast-[1.2] brightness-110 z-0 pointer-events-none select-none hidden sm:block"
          />
          
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16 relative z-10">
            <h2 className="font-serif font-bold text-4xl md:text-5xl tracking-tight mb-6 text-brand-1">Turn Any Source into Study Materials</h2>
            <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">Our Vision AI is trained to handle the most difficult, chaotic inputs that Indian students deal with daily.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="bg-white p-10 rounded-[3rem] border-2 border-brand-3/10 shadow-xl shadow-brand-3/10 hover:shadow-2xl hover:border-brand-3/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-4/20 text-brand-3 flex items-center justify-center"><FileUp className="w-6 h-6" /></div>
                <h3 className="font-serif font-bold text-2xl text-brand-1">PDFs to Flashcards</h3>
              </div>
              <p className="font-sans text-foreground/70 mb-6 leading-relaxed">
                Upload heavy textbook chapters, lecture slides, or dense research papers. Get flashcards, quizzes, and notes in seconds—with your original PDF viewable side-by-side.
              </p>
              <ul className="space-y-3 font-sans text-sm font-bold text-brand-2">
                <li>✓ Extract key concepts automatically</li>
                <li>✓ Generate 100+ flashcards in seconds</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="bg-white p-10 rounded-[3rem] border-2 border-brand-3/10 shadow-xl shadow-brand-3/10 hover:shadow-2xl hover:border-brand-3/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-4/20 text-brand-3 flex items-center justify-center"><Camera className="w-6 h-6" /></div>
                <h3 className="font-serif font-bold text-2xl text-brand-1">Images to Notes</h3>
              </div>
              <p className="font-sans text-foreground/70 mb-6 leading-relaxed">
                Snap a photo of your handwritten notes, coaching whiteboard, or rough scribbles. Our elite OCR extracts the text, then AI generates perfect Markdown and quizzes.
              </p>
              <ul className="space-y-3 font-sans text-sm font-bold text-brand-2">
                <li>✓ Reads terrible handwriting</li>
                <li>✓ Captures complex whiteboard formulas</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 6. TARGET AUDIENCE */}
        <section className="py-24 relative overflow-hidden bg-brand-4/20 border-t border-brand-3/10">
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.h2 variants={fadeInUp} className="font-serif font-bold text-4xl md:text-5xl mb-4 text-brand-1">Built for Aspirants Who Need to Rank.</motion.h2>
            <motion.p variants={fadeInUp} className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto mb-16">The most powerful study tool tailored for highly competitive exams.</motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-white border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:-translate-y-2 hover:shadow-2xl transition-all">
                <h3 className="font-serif font-bold text-2xl mb-2 text-brand-2">JEE / NEET</h3>
                <p className="font-sans text-foreground/60 text-sm">Convert coaching center whiteboards into fast-paced revision flashcards.</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-white border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:-translate-y-2 hover:shadow-2xl transition-all">
                <h3 className="font-serif font-bold text-2xl mb-2 text-brand-2">UPSC / Civil Services</h3>
                <p className="font-sans text-foreground/60 text-sm">Digest dense policy PDFs and newspaper articles into scannable summaries instantly.</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-white border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 hover:-translate-y-2 hover:shadow-2xl transition-all">
                <h3 className="font-serif font-bold text-2xl mb-2 text-brand-2">CA / CS</h3>
                <p className="font-sans text-foreground/60 text-sm">Turn massive corporate law and taxation modules into active-recall quizzes.</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-brand-3 text-white border-2 border-brand-3/50 shadow-2xl shadow-brand-3/40 hover:-translate-y-2 hover:shadow-3xl transition-all flex flex-col justify-center">
                <h3 className="font-serif font-bold text-2xl mb-2">College Students</h3>
                <p className="font-sans text-white/80 text-sm">Aesthetic notes generated for you. Stop formatting, start studying.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 7. PRICING */}
        <section id="pricing" className="py-24 px-6 md:px-12 relative bg-white">
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="max-w-6xl mx-auto relative z-10 text-center">
            <motion.h2 variants={fadeInUp} className="font-serif font-bold text-4xl md:text-5xl mb-4 text-brand-1">Simple pricing for serious students.</motion.h2>
            <motion.p variants={fadeInUp} className="font-sans text-xl text-foreground/60 mb-16 max-w-2xl mx-auto">Start free, upgrade when you're ready to dominate your exams.</motion.p>
            
          <div className="flex flex-col items-center justify-center gap-6 mb-16 relative z-10">
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
            variants={staggerContainer} 
            initial="initial" 
            whileInView="whileInView" 
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10 text-left"
          >
            {/* Free Tier */}
            <motion.div variants={fadeInUp} className="glass-panel p-8 rounded-[2.5rem] border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2 text-brand-1">Free</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">Kickstart your revision.</p>
              <div className="text-5xl font-bold font-sans mb-4 text-brand-1">₹0<span className="text-xl font-medium text-foreground/50">/mo</span></div>
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
                <Link 
                  href="/signup"
                  className="w-full block text-center py-4 rounded-full bg-brand-3 text-white font-sans font-bold hover:bg-brand-3/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>

            {/* Starter Tier */}
            <motion.div variants={fadeInUp} className="glass-panel p-8 rounded-[2.5rem] border-2 border-brand-3/20 shadow-xl shadow-brand-3/5 flex flex-col bg-white/40 backdrop-blur-3xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2 text-brand-1">Starter</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">Perfect for testing the waters.</p>
              <div className="text-5xl font-bold font-sans mb-4 flex items-end text-brand-1">
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
                <Link 
                  href="/checkout"
                  className="w-full block text-center py-4 rounded-full border-2 border-black/10 text-brand-1 font-sans font-bold hover:bg-black/5 hover:border-black/20 transition-all"
                >
                  Select Starter
                </Link>
              </div>
            </motion.div>

            {/* Pro Tier (Brand-4 Blue - HEAVILY PROMOTED WITH VIBRANT GRADIENT CONTAINER) */}
            <motion.div variants={fadeInUp} className="p-8 rounded-[2.5rem] border-2 border-brand-4 shadow-[0_20px_50px_rgba(30,58,138,0.35)] relative flex flex-col bg-gradient-to-br from-brand-3 via-brand-2 to-brand-1 text-white transform md:-translate-y-6 hover:-translate-y-8 hover:shadow-[0_25px_70px_-15px_rgba(30,58,138,0.4)] transition-all duration-300">
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
                <Link 
                  href="/checkout"
                  className="w-full block text-center py-5 rounded-full bg-white text-brand-1 font-sans text-lg font-bold hover:bg-white/95 hover:scale-[1.02] transition-all shadow-xl shadow-brand-3/20 flex justify-center items-center gap-2"
                >
                  Upgrade to Pro <ArrowRight className="w-5 h-5 inline" />
                </Link>
                <p className="text-center text-[10px] text-white/50 font-medium">Cancel anytime. No questions asked.</p>
              </div>
            </motion.div>

            {/* Unlimited Tier */}
            <motion.div variants={fadeInUp} className="glass-panel p-8 rounded-[2.5rem] border-2 border-brand-1/40 shadow-2xl shadow-brand-1/20 flex flex-col bg-gradient-to-b from-brand-1/5 to-transparent backdrop-blur-3xl hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(30,58,138,0.4)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-1/10 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="w-12 h-12 bg-brand-1/20 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-brand-1" />
              </div>
              <h3 className="font-serif font-bold text-3xl mb-2 text-brand-1">Unlimited Ranker</h3>
              <p className="font-sans text-foreground/60 mb-6 font-medium">The ultimate unfair advantage. 👑</p>
              <div className="text-5xl font-bold font-sans mb-4 flex items-end text-brand-1">
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
                <Link 
                  href="/checkout"
                  className="w-full block text-center py-4 rounded-full border-2 border-brand-1 text-brand-1 font-sans font-bold hover:bg-brand-1 hover:text-white transition-all shadow-lg shadow-brand-1/10"
                >
                  Get Unlimited Access
                </Link>
                <p className="text-center text-[10px] text-foreground/50 font-medium">Cancel anytime. No questions asked.</p>
              </div>
            </motion.div>
          </motion.div>
          </motion.div>
        </section>

        {/* 8. FAQ */}
        <section className="py-24 px-6 md:px-12 relative bg-brand-4/5 border-t border-brand-3/10">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-4xl mx-auto relative z-10 bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-brand-3/10 border-2 border-brand-3/10">
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-center mb-16 text-brand-1">Frequently Asked Questions</h2>
            <div className="flex flex-col">
              <FAQItem 
                question="Is the Unlimited plan truly unlimited?" 
                answer="Yes, the Unlimited plan is designed for even the most active students. To prevent server abuse, commercial scraping, or script-based spam, we implement a generous Fair Use soft limit of 150 transformations per month, and chat messages are unmetered within normal personal study usage. This is far beyond what any student needs for intensive exam preparation!" 
              />
              <FAQItem 
                question="How accurate is it with complex JEE/NEET formulas and conceptual relations?" 
                answer="Extremely accurate. Our smart extraction engine is specifically trained on Indian academic materials. It flawlessly parses complex calculus, organic chemistry mechanisms, and conceptual relations that generic tools fail on." 
              />
              <FAQItem 
                question="Does it work well with mixed Hindi/English notes or terrible handwriting?" 
                answer="Yes! Notrik is built to handle 'Hinglish' and messy cursive handwriting from fast-paced coaching classes. If a human can barely read it, Notrik can perfectly structure it." 
              />
              <FAQItem 
                question="How are my private notes and data handled?" 
                answer="With strict privacy. All your uploads and generated study sheets are encrypted in your personal Trace Drawer. We never use your private data to train public AI models." 
              />
              <FAQItem 
                question="Is this better or cheaper than NotebookLM or ChatGPT?" 
                answer="NotebookLM and ChatGPT are generic. Notrik is specialized. We automatically generate active-recall flashcards, speed quizzes, and formatted study sheets tailored to exact exam syllabi. Plus, our INR pricing makes it far more affordable for Indian students." 
              />
              <FAQItem 
                question="Can I export to Anki, print it, or use Obsidian?" 
                answer="Absolutely. You can export everything to high-quality PDFs for printing, or export directly to structured notes that integrate perfectly with Anki and Obsidian workflows." 
              />
            </div>
          </motion.div>
          {/* FAQPage Schema for AEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How accurate is it with complex JEE/NEET formulas and conceptual relations?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Extremely accurate. Our smart extraction engine is specifically trained on Indian academic materials. It flawlessly parses complex calculus, organic chemistry mechanisms, and conceptual relations that generic tools fail on."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does it work well with mixed Hindi/English notes or terrible handwriting?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Notrik is built to handle 'Hinglish' and messy cursive handwriting from fast-paced coaching classes. If a human can barely read it, Notrik can perfectly structure it."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How are my private notes and data handled?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "With strict privacy. All your uploads and generated study sheets are encrypted in your personal Trace Drawer. We never use your private data to train public AI models."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is this better or cheaper than NotebookLM or ChatGPT?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "NotebookLM and ChatGPT are generic. Notrik is specialized. We automatically generate active-recall flashcards, speed quizzes, and formatted study sheets tailored to exact exam syllabi. Plus, our INR pricing makes it far more affordable for Indian students."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I export to Anki, print it, or use Obsidian?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absolutely. You can export everything to high-quality PDFs for printing, or export directly to structured notes that integrate perfectly with Anki and Obsidian workflows."
                    }
                  }
                ]
              })
            }}
          />
        </section>

        {/* 9. CTA */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            variants={fadeScale} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="bg-gradient-to-br from-brand-2 via-brand-4 to-orange-500 rounded-[3rem] p-12 md:p-24 shadow-[0_0_50px_-12px_rgba(249,115,22,0.4)] border-4 border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <h2 className="font-serif font-bold text-5xl md:text-6xl text-white mb-6 relative z-10">Start Transforming Your Notes Free</h2>
            <p className="font-sans text-xl text-white/90 mb-12 max-w-2xl mx-auto relative z-10 font-medium">Join thousands of aspirants who are already studying smarter. Stop wasting time organizing, start learning.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/signup"
                className="inline-block rounded-full bg-white text-brand-4 px-10 py-4 font-sans text-lg font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Start Free Today
              </Link>
              <Link
                href="/#demo"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-block rounded-full bg-black/20 text-white border-2 border-white/30 px-10 py-4 font-sans text-lg font-bold hover:bg-black/40 transition-all duration-300 backdrop-blur-md"
              >
                Try the Demo First
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Floating Try Demo CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 md:hidden"
        >
          <Link
            href="/#demo"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="rounded-full bg-brand-4 text-white px-6 py-3 font-sans text-sm font-bold shadow-2xl shadow-brand-4/40 flex items-center gap-2 border border-brand-4/50 hover:bg-brand-4/90"
          >
            <Sparkles className="w-4 h-4" /> Try Demo
          </Link>
        </motion.div>

        <Footer />
      </main>
    </div>
  );
}
