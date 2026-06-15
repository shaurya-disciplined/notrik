"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, BrainCircuit, Layers, Target, Plus, CheckCircle2, 
  ArrowRight, FileText, Check, Sparkles, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface TimelineItem {
  id: number;
  stepNum: string;
  title: string;
  category: string;
  icon: React.ElementType;
  content: string;
  benefits: string[];
  color: string;
  accentColor: string;
  renderThumbnail: () => React.ReactNode;
}

export default function RadialOrbitalTimeline() {
  const [activeId, setActiveId] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TimelineItem[] = [
    {
      id: 1,
      stepNum: "01",
      title: "Upload Chaos",
      category: "Input Phase",
      icon: Upload,
      color: "from-blue-500 to-indigo-600",
      accentColor: "rgba(59,130,246,0.2)",
      content: "Snap a photo of your messy whiteboard, scan your scribbled biology notebook, or upload a massive 50-page PDF.",
      benefits: [
        "Smart extraction reads complex formulas & rough handwriting",
        "Handles heavy PDFs (up to 100MB) with parallel processing",
        "One-click mobile camera uploads for offline study sheets"
      ],
      renderThumbnail: () => (
        <div className="w-full bg-slate-900 border border-blue-500/30 p-5 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden shadow-lg">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="border-2 border-dashed border-blue-500/40 rounded-xl p-4 flex flex-col items-center gap-2.5 w-full bg-slate-950 relative z-10 shadow-inner">
            <Upload className="w-6 h-6 text-blue-400 animate-bounce" />
            <span className="text-xs text-white font-bold font-sans">Uploading physics_notes.pdf</span>
            <div className="w-3/4 bg-blue-950 h-2.5 rounded-full overflow-hidden border border-blue-500/20">
              <motion.div 
                className="bg-blue-400 h-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      stepNum: "02",
      title: "Extract Text",
      category: "AI Processing",
      icon: BrainCircuit,
      color: "from-violet-500 to-purple-600",
      accentColor: "rgba(139,92,246,0.2)",
      content: "Our Smart Extraction Engine parses handwritten content. It ignores background noise and structures math symbols cleanly.",
      benefits: [
        "Transforms messy handwriting into organized study sheets",
        "Retains hierarchy (headings, subheadings, diagrams)",
        "Filters out distractions to focus only on core syllabus concepts"
      ],
      renderThumbnail: () => (
        <div className="w-full bg-slate-900 border border-purple-500/30 p-5 rounded-2xl flex flex-col justify-center relative overflow-hidden font-mono text-xs text-white shadow-lg">
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold border-b border-purple-500/30 pb-2 mb-2">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
              <span>SMART EXTRACTION ACTIVE</span>
            </div>
            <p className="line-through text-red-400/60 font-bold">messy handwriting detected...</p>
            <p className="text-blue-400 font-extrabold">{"Structured Scientific Output ✓"}</p>
            <div className="h-2 w-full bg-slate-950 rounded-full relative overflow-hidden mt-2 border border-purple-500/20">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-1/2"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      stepNum: "03",
      title: "Build Study Materials",
      category: "Generation Phase",
      icon: Layers,
      color: "from-amber-500 to-orange-600",
      accentColor: "rgba(245,158,11,0.2)",
      content: "The structured content is automatically mapped into 6 essential study formats including summaries, flashcards, and practice tests.",
      benefits: [
        "Generates multi-colored concept maps & visual workflows",
        "Builds smart active-recall decks ready for spaced repetition",
        "Formulates quiz questions targeted at common exam mistakes"
      ],
      renderThumbnail: () => (
        <div className="w-full bg-slate-900 border border-orange-500/30 p-5 rounded-2xl flex flex-col justify-center gap-3 relative overflow-hidden shadow-lg">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="flex gap-3 relative z-10">
            <div className="flex-1 bg-slate-950 border border-orange-500/20 rounded-xl p-3 text-center flex flex-col justify-center items-center gap-1.5 shadow-md">
              <Layers className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Flashcards</span>
              <span className="text-[10px] text-orange-300 font-bold">24 Cards Built</span>
            </div>
            <div className="flex-1 bg-slate-950 border border-orange-500/20 rounded-xl p-3 text-center flex flex-col justify-center items-center gap-1.5 shadow-md">
              <FileText className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Summaries</span>
              <span className="text-[10px] text-orange-300 font-bold">PDF Ready</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      stepNum: "04",
      title: "Export & Revise",
      category: "Success Flow",
      icon: Target,
      color: "from-emerald-500 to-teal-600",
      accentColor: "rgba(16,185,129,0.2)",
      content: "Download pristine PDF/Structured notes or run an interactive revision quiz. Re-study difficult areas flagged by the smart engine.",
      benefits: [
        "Syncs with your custom study planner schedule",
        "Flag difficult questions to review before exam morning",
        "Premium watermark-branded exports for team revisions"
      ],
      renderThumbnail: () => (
        <div className="w-full bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex-1 space-y-2.5 relative z-10">
            <div className="text-sm font-black text-emerald-400 flex items-center gap-2 tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>REVISION READY</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-sans font-bold">
              Your conceptual retention rating increased by <span className="text-emerald-300 font-extrabold underline decoration-wavy">35%</span> compared to yesterday.
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/25 border-t-emerald-400 flex items-center justify-center text-xs font-black text-emerald-300 bg-slate-950 shrink-0 relative z-10 shadow-lg animate-[spin_10s_linear_infinite]">
            <span className="animate-[spin_10s_linear_infinite_reverse]">95%</span>
          </div>
        </div>
      )
    }
  ];

  // Auto rotation effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.3) % 360);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [autoRotate]);

  const activeStep = steps.find(s => s.id === activeId) || steps[0];

  return (
    <div className="w-full relative z-10">
      
      {/* 50/50 Desktop / Vertical Stepper Mobile */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-center">
        
        {/* LEFT: Orbital Visualizer (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-center min-h-[500px] relative">
          
          <div 
            className="relative w-[450px] h-[450px] flex items-center justify-center"
            onMouseEnter={() => setAutoRotate(false)}
            onMouseLeave={() => setAutoRotate(true)}
          >
            {/* SVG Glowing Paths / Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
              <defs>
                <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="active-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Glowing Ambient Core */}
              <circle cx="225" cy="225" r="90" fill="url(#glow-grad)" className="animate-pulse" />

              {/* Main Orbit Path */}
              <circle 
                cx="225" 
                cy="225" 
                r="160" 
                fill="none" 
                stroke="rgba(37,99,235,0.12)" 
                strokeWidth="3" 
                strokeDasharray="8 8" 
              />
              
              {/* Active Glow Ring */}
              <circle 
                cx="225" 
                cy="225" 
                r="160" 
                fill="none" 
                stroke="url(#active-line-grad)" 
                strokeWidth="1.5" 
                strokeDasharray="4 20" 
                style={{
                  transform: `rotate(${rotationAngle * 1.5}deg)`,
                  transformOrigin: "225px 225px"
                }}
              />

              {/* Glowing connection line to Active Node */}
              {steps.map((item, idx) => {
                const total = steps.length;
                const angle = ((idx / total) * 360 + rotationAngle) % 360;
                const radian = (angle * Math.PI) / 180;
                const radius = 160;
                const x = 225 + radius * Math.cos(radian);
                const y = 225 + radius * Math.sin(radian);
                const isActive = item.id === activeId;

                return (
                  <line 
                    key={item.id}
                    x1="225" 
                    y1="225" 
                    x2={x} 
                    y2={y} 
                    stroke={isActive ? "url(#active-line-grad)" : "rgba(37,99,235,0.06)"}
                    strokeWidth={isActive ? "2.5" : "1"}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Core Notrik logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-slate-900/10 backdrop-blur-2xl border-4 border-white flex items-center justify-center z-10 shadow-[0_0_50px_rgba(37,99,235,0.25)]">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-3 to-brand-2 shadow-inner flex items-center justify-center overflow-hidden">
                <img src="/fevi-con.png" alt="Notrik Icon" className="w-12 h-12 object-contain" />
              </div>
            </div>

            {/* Rotating Nodes */}
            {steps.map((item, idx) => {
              const total = steps.length;
              const angle = ((idx / total) * 360 + rotationAngle) % 360;
              const radian = (angle * Math.PI) / 180;
              const radius = 160;
              const x = 225 + radius * Math.cos(radian);
              const y = 225 + radius * Math.sin(radian);
              const isActive = item.id === activeId;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="absolute cursor-pointer select-none z-20 group"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={() => setActiveId(item.id)}
                  onMouseEnter={() => setActiveId(item.id)}
                >
                  {/* Glowing Outline */}
                  <div className={`absolute -inset-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${isActive ? 'bg-brand-3/20 blur-md opacity-100' : 'bg-black/5 blur-sm'}`} />
                  
                  {/* Outer Sphere */}
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-brand-3 to-brand-1 text-white border-white scale-110 shadow-[0_0_30px_rgba(37,99,235,0.5)]' : 'bg-white text-brand-1 border-brand-3/20 hover:border-brand-3/60 shadow-lg'}`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                    
                    {/* Small number badge */}
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-[9px] font-black text-white flex items-center justify-center">
                      {item.stepNum}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Detail Display Card & Stepper Fallback for Mobile */}
        <div className="flex-1 w-full max-w-xl">
          
          {/* Mobile Stepper View (Visible on Mobile Only) */}
          <div className="md:hidden space-y-6 px-4">
            {steps.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === activeId;
              return (
                <div 
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 cursor-pointer relative overflow-hidden ${isSelected ? 'bg-brand-4/5 border-brand-3/30 shadow-xl' : 'bg-white border-black/5 hover:border-black/15 shadow-sm'}`}
                >
                  {/* Indicator Light */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-3/5 rounded-full blur-xl pointer-events-none"></div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${isSelected ? 'bg-brand-3 text-white border-brand-3 shadow-lg shadow-brand-3/20' : 'bg-brand-4/10 text-brand-1 border-brand-3/10'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-brand-3 uppercase">STEP {item.stepNum}</span>
                      <h4 className="font-serif font-black text-xl text-brand-1 mt-0.5">{item.title}</h4>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-2 border-t border-black/5"
                    >
                      <p className="font-sans text-sm font-medium text-foreground/80 leading-relaxed">{item.content}</p>
                      
                      <div className="space-y-2">
                        {item.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-brand-1 font-bold">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-2.5 h-2.5" strokeWidth={3} /></span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 pt-2">
                        {item.renderThumbnail()}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Rich Card View (Visible on Desktop Only) */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-brand-4/5 border border-brand-3/20 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col gap-6"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-3/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-center pb-4 border-b border-brand-3/10">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-serif font-black tracking-tight text-brand-3">{activeStep.stepNum}</span>
                    <div className="h-6 w-px bg-brand-3/20"></div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-3 bg-brand-3/10 px-3 py-1 rounded-md border border-brand-3/20">{activeStep.category}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-3/15 text-brand-3 flex items-center justify-center">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-serif font-black text-brand-1 mb-3">{activeStep.title}</h3>
                  <p className="font-sans text-base text-foreground/85 leading-relaxed font-semibold">{activeStep.content}</p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3">
                  <h5 className="font-serif font-black text-xs text-brand-1 uppercase tracking-wider mb-2">Core Benefits</h5>
                  {activeStep.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm font-bold text-brand-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Thumbnail Preview */}
                <div className="mt-2 pt-6 border-t border-brand-3/10">
                  <h5 className="font-serif font-black text-xs text-brand-1 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-3" /> Live Engine Output Mock
                  </h5>
                  {activeStep.renderThumbnail()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
