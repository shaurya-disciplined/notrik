"use client";
import React from "react";
import { Headphones, Mail, HelpCircle, FileText, ChevronRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-5xl mx-auto">
      <div className="w-full">
        
        {/* Header */}
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-brand-3/10 text-brand-3 flex items-center justify-center mb-6 shadow-sm border border-brand-3/15">
            <Headphones className="w-8 h-8" strokeWidth={2} />
          </div>
          <h1 className="font-serif font-black text-4xl mb-4 tracking-tight flex items-center gap-2">
            <span className="text-gradient">Support Desk</span> <span>🙋‍♂️</span>
          </h1>
          <p className="font-sans text-foreground/50 text-[15px] max-w-xl font-medium leading-relaxed">
            Need help with your account, credits, billing, or exam tools? The Notrik team is here to help you succeed.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-panel border border-black/5 rounded-[2rem] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-br from-brand-3/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
            <Mail className="w-8 h-8 text-brand-3 mb-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h3 className="font-serif font-black text-2xl mb-2 text-foreground">Email Support</h3>
            <p className="font-sans text-[13px] text-foreground/50 mb-6 font-medium leading-relaxed">Get in touch directly with our support team. We typically respond within 24 hours.</p>
            <a href="mailto:support@notrik.com" className="font-sans font-extrabold text-sm text-brand-3 flex items-center gap-1.5 mt-auto">
              support@notrik.com <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="glass-panel border border-black/5 rounded-[2rem] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
            <HelpCircle className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h3 className="font-serif font-black text-2xl mb-2 text-foreground">Help Center</h3>
            <p className="font-sans text-[13px] text-foreground/50 mb-6 font-medium leading-relaxed">Browse detailed documentation, exam prep guides, and frequently asked questions.</p>
            <span className="font-sans font-extrabold text-sm text-amber-600 flex items-center gap-1.5 mt-auto">
              Visit Knowledge Base <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Common Questions */}
        <div className="glass-panel border border-black/5 rounded-[2.5rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[30%] h-[20%] bg-gradient-to-br from-purple-500/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
          <h2 className="font-serif font-black text-2xl mb-8 flex items-center gap-3 text-foreground relative z-10">
            <FileText className="w-6 h-6 text-brand-3" strokeWidth={2} /> Common Questions <span>💡</span>
          </h2>
          <div className="space-y-4 relative z-10">
            {[
              'How do I reset my password?', 
              'What payment methods are supported?', 
              'Can I export my flashcards to Anki?', 
              'How does the AI structuring work?'
            ].map((q, i) => (
              <details key={i} className="group bg-white/70 backdrop-blur-sm border border-black/5 rounded-2xl transition-all overflow-hidden duration-300">
                <summary className="font-sans font-black text-sm p-6 cursor-pointer list-none flex justify-between items-center text-foreground hover:text-brand-3 select-none">
                  {q}
                  <span className="transition duration-300 group-open:rotate-180 text-foreground/40 group-hover:text-brand-3">
                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-2 font-sans text-[13px] text-foreground/50 border-t border-black/5 font-medium leading-relaxed">
                  This is an instantly generated solution for the frequently asked question. Our full support documentation details the exact step-by-step instructions required to resolve target issues quickly and efficiently.
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
