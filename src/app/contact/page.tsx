"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form or handle redirect
    }, 1500);
  };

  return (
    <>
      <main className="min-h-screen pb-24 relative overflow-hidden bg-[#faf9f6]">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-4/10 rounded-full blur-[100px] pointer-events-none"></div>
        <Navbar />
        
        <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <div>
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 tracking-tight text-brand-1">Contact Support</h1>
            <p className="font-sans text-xl text-foreground/70 leading-relaxed mb-10 max-w-md">
              Need help with your subscription, have a feature request, or found a bug? We'd love to hear from you.
            </p>

            <div className="space-y-8 font-sans">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-brand-4/10 flex items-center justify-center text-brand-4 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Email Us</h3>
                  <p className="text-foreground/70 mb-2">Our support team usually replies within 24 hours.</p>
                  <a href="mailto:support@notrik.com" className="text-brand-4 font-bold hover:underline">support@notrik.com</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-brand-1/10 flex items-center justify-center text-brand-1 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">HQ</h3>
                  <p className="text-foreground/70">
                    Notrik Technologies<br/>
                    Bengaluru, India<br/>
                    560001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-black/5 relative">
            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-[2rem] p-8 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-serif font-bold text-2xl mb-2">Message Sent!</h3>
                <p className="font-sans text-foreground/70 mb-6">We've received your inquiry and will get back to you shortly.</p>
                <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-black/5 hover:bg-black/10 rounded-full font-bold transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="block font-sans font-bold text-sm mb-2 text-foreground/80">Full Name</label>
                  <input required type="text" id="name" className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-sans focus:ring-2 focus:ring-brand-4 transition-all" placeholder="Rahul Kumar" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-sans font-bold text-sm mb-2 text-foreground/80">Email Address</label>
                  <input required type="email" id="email" className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-sans focus:ring-2 focus:ring-brand-4 transition-all" placeholder="rahul@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block font-sans font-bold text-sm mb-2 text-foreground/80">Subject</label>
                  <select id="subject" className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-sans focus:ring-2 focus:ring-brand-4 transition-all text-foreground/80">
                    <option>General Inquiry</option>
                    <option>Billing & Subscriptions</option>
                    <option>Technical Support</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block font-sans font-bold text-sm mb-2 text-foreground/80">Message</label>
                  <textarea required id="message" rows={5} className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-sans focus:ring-2 focus:ring-brand-4 transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-brand-4 text-white rounded-xl py-4 font-bold font-sans hover:bg-brand-4/90 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
