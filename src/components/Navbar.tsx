"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto relative transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] rounded-full px-6 md:px-10 py-3 flex items-center justify-between w-full max-w-5xl ${
            scrolled
              ? "glass-panel shadow-lg"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/fevi-con.png" alt="Notrik Icon" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
            <span className="font-serif font-bold tracking-tight text-foreground text-4xl hidden sm:block">
              Notrik
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-sans font-bold text-[17px] tracking-wide absolute left-1/2 -translate-x-1/2">
            <Link href="/features" className={`${isActive('/features') ? 'text-brand-1' : 'text-foreground/70'} hover:text-brand-1 hover:-translate-y-[1px] transition-all`}>Features</Link>
            <Link href="/exams" className={`${isActive('/exams') ? 'text-brand-1' : 'text-foreground/70'} hover:text-brand-1 hover:-translate-y-[1px] transition-all`}>Exam Prep</Link>
            <Link href="/pricing" className={`${isActive('/pricing') ? 'text-brand-1' : 'text-foreground/70'} hover:text-brand-1 hover:-translate-y-[1px] transition-all`}>Pricing</Link>
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block font-sans font-bold text-base text-foreground/90 hover:text-brand-1 hover:-translate-y-[1px] transition-all">Log in</Link>
            <Link
              href="/signup"
              className="relative overflow-hidden group rounded-full px-5 py-2.5 font-sans text-sm md:text-base font-bold bg-brand-1 text-white shadow-lg shadow-brand-1/20 hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shrink-0"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-brand-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-black/10 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } md:hidden`}
      >
        <div className="pt-28 pb-8 px-6 flex flex-col gap-6">
          <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className={`font-serif font-bold text-3xl ${isActive('/features') ? 'text-brand-1' : 'text-foreground'}`}>Features</Link>
          <Link href="/exams" onClick={() => setIsMobileMenuOpen(false)} className={`font-serif font-bold text-3xl ${isActive('/exams') ? 'text-brand-1' : 'text-foreground'}`}>Exam Prep</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`font-serif font-bold text-3xl ${isActive('/pricing') ? 'text-brand-1' : 'text-foreground'}`}>Pricing</Link>
          
          <div className="h-px w-full bg-black/10 my-2"></div>
          
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-sans font-bold text-xl text-foreground/80">Log in</Link>
        </div>
      </div>
    </>
  );
}
