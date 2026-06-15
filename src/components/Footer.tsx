import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, MessageCircle, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden border-t border-white/10">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-brand-4/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-brand-3/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <img src="/fevi-con.png" alt="Notrik Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform" />
              <span className="font-serif font-bold text-3xl tracking-tight text-white group-hover:text-brand-4 transition-colors">Notrik</span>
            </Link>
            <p className="font-sans text-white/60 leading-relaxed mb-8 max-w-sm">
              The AI study engine built specifically for Indian aspirants. Turn your messy notes and whiteboards into structured flashcards, quizzes, and study sheets instantly.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-brand-4 hover:border-brand-4 transition-all hover:scale-110">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all hover:scale-110">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all hover:scale-110">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
              Product
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/60">
              <li><Link href="/features" className="hover:text-brand-4 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Features</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-4 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Pricing (UPI)</Link></li>
              <li><Link href="/#demo" className="hover:text-brand-4 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Interactive Demo</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
              Resources
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/60">
              <li><Link href="/exams" className="hover:text-brand-3 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> JEE / NEET Prep</Link></li>
              <li><Link href="/exams" className="hover:text-brand-3 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> UPSC Civil Services</Link></li>
              <li><Link href="/exams" className="hover:text-brand-3 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> CA / CS / GATE</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
              Legal
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" /> Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-sm text-white/40">
          <p>© {new Date().getFullYear()} Notrik Technologies. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <Sparkles className="w-4 h-4 text-brand-4" /> for Indian Aspirants
          </p>
        </div>
      </div>
    </footer>
  );
}
