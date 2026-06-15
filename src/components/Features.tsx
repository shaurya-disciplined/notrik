"use client";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Brain, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Vision Extraction", desc: "Reads handwriting, concept relationships, and formulas." },
    { id: 2, title: "Context Mapping", desc: "Understands relation between visual elements." },
    { id: 3, title: "Markdown Generation", desc: "Outputs clean, structured format." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 rounded-[2rem] h-[320px] relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-brand-1">
        <Zap className="w-5 h-5" />
        <span className="font-mono text-xs font-bold uppercase">Diagnostic Shuffler</span>
      </div>
      <div className="relative w-full h-full mt-8">
        {cards.map((card, i) => {
          const isTop = i === 0;
          return (
            <div
              key={card.id}
              className="absolute w-full glass-panel rounded-2xl p-6 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-brand-2/20"
              style={{
                top: `${i * 15}px`,
                scale: 1 - i * 0.05,
                opacity: 1 - i * 0.2,
                zIndex: 10 - i,
                backgroundColor: isTop ? "var(--color-brand-1)" : "transparent",
                color: isTop ? "white" : "inherit"
              }}
            >
              <h3 className="font-sans font-bold mb-2">{card.title}</h3>
              <p className={`font-mono text-xs ${isTop ? 'text-white/80' : 'text-foreground/60'}`}>{card.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const fullText = "Structuring content...\\nIdentified: 3 headings.\\nExtracting Concept Relations:\\n-> Found: Key Insights.\\n-> Node A related to Node B.\\nStatus: Complete.";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    let timer: NodeJS.Timeout;
    
    const typeWriter = () => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1));
        i++;
        timer = setTimeout(typeWriter, Math.random() * 50 + 20);
      } else {
        setTimeout(() => { i = 0; typeWriter(); }, 4000);
      }
    };
    
    typeWriter();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-panel p-8 rounded-[2rem] h-[320px] relative flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-brand-2">
          <Brain className="w-5 h-5" />
          <span className="font-mono text-xs font-bold uppercase">Telemetry Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-4 animate-pulse"></div>
          <span className="font-mono text-[10px] text-foreground/50">LIVE FEED</span>
        </div>
      </div>
      <div className="flex-1 bg-black/10 dark:bg-white/5 rounded-xl p-4 overflow-hidden border border-white/5">
        <pre className="font-mono text-xs text-brand-3 whitespace-pre-wrap leading-relaxed">
          {text}
          <span className="animate-pulse bg-brand-3 w-2 h-4 inline-block ml-1 align-middle"></span>
        </pre>
      </div>
    </div>
  );
};

const SchedulerCard = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(cursorRef.current, { x: 80, y: 50, duration: 1, ease: "power2.inOut" })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(".day-cell", { backgroundColor: "var(--color-brand-4)", duration: 0.2 }, "-=0.1")
        .to(cursorRef.current, { x: 180, y: 120, duration: 1, ease: "power2.inOut" }, "+=0.5")
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(".save-btn", { backgroundColor: "var(--color-brand-1)", color: "white", duration: 0.2 }, "-=0.1")
        .to(cursorRef.current, { opacity: 0, duration: 0.3 }, "+=1")
        .set(".day-cell", { backgroundColor: "transparent" })
        .set(".save-btn", { backgroundColor: "rgba(255,255,255,0.05)", color: "var(--color-foreground)" })
        .set(cursorRef.current, { x: 0, y: 0, opacity: 1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="glass-panel p-8 rounded-[2rem] h-[320px] relative flex flex-col">
      <div className="flex items-center gap-2 text-brand-3 mb-6">
        <Calendar className="w-5 h-5" />
        <span className="font-mono text-xs font-bold uppercase">Study Scheduler</span>
      </div>
      
      <div className="relative flex-1">
        <div className="grid grid-cols-7 gap-2 mb-8">
          {['S','M','T','W','T','F','S'].map((day, i) => (
            <div key={i} className="text-center font-mono text-xs text-foreground/40">{day}</div>
          ))}
          {Array.from({length: 14}).map((_, i) => (
            <div 
              key={i} 
              className={`h-8 rounded-md border border-white/10 ${i === 9 ? 'day-cell' : ''}`}
            ></div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button className="save-btn px-4 py-2 rounded-full font-mono text-xs border border-white/10 transition-colors">
            Generate Quiz
          </button>
        </div>

        <svg 
          ref={cursorRef} 
          className="absolute top-0 left-0 w-6 h-6 text-foreground drop-shadow-md z-10"
          fill="currentColor" viewBox="0 0 24 24"
        >
          <path d="M7 2l12 11.2l-5.8.5l3.3 7.3l-2.2.9l-3.2-7.4l-4.4 4.7z" />
        </svg>
      </div>
    </div>
  );
};

export default function Features() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4">
          Functional <span className="font-serif italic text-brand-1">Artifacts</span>
        </h2>
        <p className="font-mono text-foreground/60 max-w-lg">
          Not just a generic LLM wrapper. Purpose-built tools that turn static images into interactive learning experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card"><ShufflerCard /></div>
        <div className="feature-card"><TypewriterCard /></div>
        <div className="feature-card"><SchedulerCard /></div>
      </div>
    </section>
  );
}
