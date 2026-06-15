"use client";
import React, { useState } from "react";
import { User, CreditCard, Download, LogOut, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { currentUser, logout, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    setIsSaving(true);
    updateProfile(name);
    setTimeout(() => setIsSaving(false), 800); // UI feedback
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-5xl mx-auto">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif font-black text-4xl mb-2 tracking-tight flex items-center gap-2">
            <span className="text-gradient">Settings</span> <span>⚙️</span>
          </h1>
          <p className="font-sans text-foreground/50 text-[13px] font-medium">Manage your personal profile, billing preferences, and exam configurations.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="w-full lg:w-60 flex flex-col gap-2 shrink-0">
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-brand-3/10 border border-brand-3/15 text-brand-3 font-sans font-bold text-xs uppercase tracking-widest text-left transition-all">
              <User className="w-4 h-4" strokeWidth={2.5} /> Profile Info
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-black/[0.03] border border-transparent text-foreground/50 hover:text-foreground font-sans font-bold text-xs uppercase tracking-widest text-left transition-all">
              <CreditCard className="w-4 h-4" strokeWidth={2} /> Billing & Plans
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-black/[0.03] border border-transparent text-foreground/50 hover:text-foreground font-sans font-bold text-xs uppercase tracking-widest text-left transition-all">
              <Download className="w-4 h-4" strokeWidth={2} /> Export Formats
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 space-y-8">
            <div className="glass-panel border border-black/5 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-gradient-to-br from-brand-3/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
              
              <h3 className="font-serif font-black text-xl mb-6 text-foreground relative z-10 flex items-center gap-2">
                Profile Details <span>👤</span>
              </h3>
              
              <div className="flex flex-col gap-6 relative z-10">
                <div>
                  <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2.5 ml-1">Your Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold" 
                  />
                </div>
                
                <div>
                  <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2.5 ml-1">Email Address (Read-only)</label>
                  <input 
                    type="email" 
                    defaultValue={currentUser.email} 
                    disabled 
                    className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-4 py-3 font-sans text-sm outline-none opacity-40 cursor-not-allowed font-semibold" 
                  />
                </div>

                <div className="pt-4 border-t border-black/5">
                  <button 
                    onClick={handleSave} 
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    {isSaving ? (
                      <>
                        <Check className="w-4 h-4 text-green-300" strokeWidth={2.5} /> Profile Updated
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-black/5 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
              
              <h3 className="font-serif font-black text-xl mb-6 text-foreground relative z-10 flex items-center gap-2">
                Study Profile <span>🎓</span>
              </h3>
              
              <div className="flex flex-col gap-6 bg-black/[0.02] p-6 rounded-2xl border border-black/5 relative z-10">
                <div>
                  <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2">Target Examination</label>
                  <div className="font-sans font-black text-sm text-brand-3 uppercase tracking-wider">{currentUser.exam_target || "Not set"}</div>
                </div>
                
                <div className="border-t border-black/5 pt-4">
                  <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2">Primary Aspirant Goals</label>
                  <div className="font-sans text-sm text-foreground flex flex-wrap gap-2 mt-2">
                    {currentUser.goals && currentUser.goals.length > 0 ? (
                      currentUser.goals.map((goal, i) => (
                        <span key={i} className="bg-brand-3/10 text-brand-3 text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-3/15 tracking-wide">{goal}</span>
                      ))
                    ) : (
                      <span className="text-foreground/40 font-medium italic text-xs">Not set</span>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-black/5 pt-4">
                  <label className="block font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-2">Preferred Study Formats</label>
                  <div className="font-sans text-sm text-foreground flex flex-wrap gap-2 mt-2">
                    {currentUser.study_format && currentUser.study_format.length > 0 ? (
                      currentUser.study_format.map((format, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-500/15 tracking-wide">{format}</span>
                      ))
                    ) : (
                      <span className="text-foreground/40 font-medium italic text-xs">Not set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={logout} 
                className="flex items-center gap-2 border border-red-500/10 text-red-600 bg-red-500/[0.02] hover:bg-red-500/10 px-5 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} /> Logout Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
