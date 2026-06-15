"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-line", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        delay: 0.2
      })
      .from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 1,
      }, "-=0.6");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative w-full h-[100dvh] flex items-end pb-24 md:pb-32 px-6 md:px-12"
    >
      {/* Background image overlay to give texture, blended with the glass background */}
      <div className="absolute inset-0 z-[-1] opacity-10 mix-blend-overlay" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}></div>
      
      {/* Gradient fade from bottom */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-background via-background/80 to-transparent"></div>

      <div className="max-w-4xl flex flex-col items-start relative z-10">
        <h1 className="flex flex-col leading-[1.1]">
          <span className="hero-line font-sans font-bold text-4xl md:text-6xl text-foreground tracking-tight">
            Raw chaos transformed into
          </span>
          <span className="hero-line font-serif italic text-6xl md:text-9xl text-brand-1 pr-4 py-2">
            Clarity.
          </span>
        </h1>
        <p className="hero-line mt-6 max-w-xl font-mono text-foreground/70 text-sm md:text-base leading-relaxed">
          Notrik uses advanced vision AI and LLMs to structure your scribbles, relations, and loose notes into perfect Markdown. No more manual typing.
        </p>
        
        <div className="hero-cta mt-10 flex gap-4">
          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-full bg-brand-2 text-white px-8 py-4 font-mono text-sm font-bold shadow-lg shadow-brand-2/30 hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center gap-3"
          >
            <span className="relative z-10">Start New</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-brand-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
