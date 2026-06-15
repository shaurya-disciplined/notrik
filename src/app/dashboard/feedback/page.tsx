"use client";
import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState("Bug Report");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message })
      });
      if (res.ok) {
        setSubmitted(true);
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to submit feedback", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-4xl mx-auto">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-3/10 text-brand-3 flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-3/15">
            <MessageSquare className="w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="font-serif font-black text-4xl mb-3 tracking-tight flex items-center justify-center gap-2">
            <span className="text-gradient">Feedback Hub</span> <span>💬</span>
          </h1>
          <p className="font-sans text-foreground/50 text-sm font-medium">Help us make Notrik the ultimate study companion for aspirants.</p>
        </div>

        {submitted ? (
          <div className="glass-panel border border-black/5 rounded-[2.5rem] p-12 text-center shadow-lg flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <h2 className="font-serif font-black text-2xl mb-2 text-foreground">Thank you for your voice!</h2>
            <p className="font-sans text-sm text-foreground/50 max-w-md mx-auto font-medium leading-relaxed">
              Your feedback has been logged. We read and review every single submission to continuously improve the platform.
            </p>
            <button 
              onClick={() => setSubmitted(false)} 
              className="mt-8 px-6 py-3.5 bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white rounded-xl font-sans font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all shadow-sm"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <div className="glass-panel border border-black/5 rounded-[2.5rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[30%] h-[20%] bg-gradient-to-br from-brand-3/5 via-brand-4/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2.5 ml-1">What is this regarding?</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold cursor-pointer"
                >
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Design Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2.5 ml-1">Your Message</label>
                <textarea 
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you love, what you hate, or what you wish we had..."
                  className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3.5 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all resize-none font-semibold placeholder:text-foreground/35 min-h-[150px]"
                ></textarea>
              </div>
              
              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white py-4 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-4"
              >
                <Send className="w-4 h-4" strokeWidth={2.5} /> {isSubmitting ? "Sending..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
