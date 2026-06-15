"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react";

export default function PaymentGatewayPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo-no-bg.png" alt="Notrik Logo" className="w-20 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-4/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-lg p-10 md:p-14 rounded-[3rem] text-center border border-black/10 shadow-2xl relative z-10 bg-white/60 backdrop-blur-3xl"
      >
        <div className="w-20 h-20 bg-brand-4/10 text-brand-4 rounded-full flex items-center justify-center mx-auto mb-8">
          <CreditCard className="w-10 h-10" />
        </div>
        
        <h1 className="font-serif font-bold text-4xl mb-4 text-foreground tracking-tight">Payment Gateway</h1>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 p-4 rounded-2xl mb-8 font-sans font-medium text-sm">
          Our secure payment gateway is currently being configured for production.
        </div>
        
        <p className="font-sans text-lg text-foreground/70 mb-10 leading-relaxed">
          As an early adopter, we are granting you <strong className="text-brand-4">free access</strong> to your dashboard today. Skip the payment process and start transforming your notes immediately.
        </p>

        <Link 
          href="/dashboard"
          className="group w-full relative overflow-hidden rounded-full bg-foreground text-white px-8 py-5 font-sans text-lg font-bold shadow-xl shadow-black/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span className="relative z-10">Proceed to Dashboard</span>
          <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-foreground/40 font-mono tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4" /> Secure Sandbox Environment
        </div>
      </motion.div>
    </main>
  );
}
