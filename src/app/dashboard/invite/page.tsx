"use client";
import React from "react";
import { DollarSign, Copy, Users, Gift, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InvitePage() {
  const { currentUser } = useAuth();
  const inviteCode = currentUser ? `${currentUser.name.split(' ')[0].toUpperCase()}2026` : 'NOTRIK2026';

  const [friendsJoined, setFriendsJoined] = React.useState(0);
  const [monthsEarned, setMonthsEarned] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    try {
      const rewards = localStorage.getItem("notrik_rewards");
      if (rewards) {
        const parsed = JSON.parse(rewards);
        setFriendsJoined(parsed.friendsJoined || 0);
        setMonthsEarned(parsed.monthsEarned || 0);
      }
    } catch (err) {
      console.error("Failed to load rewards", err);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://notrik.com/signup?ref=${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-4xl mx-auto">
      <div className="w-full">
        
        {/* Main Banner */}
        <div className="relative rounded-[2.5rem] p-10 md:p-12 text-white overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-brand-3 via-brand-2 to-brand-1">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-4/25 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
            <h1 className="font-serif font-black text-4xl mb-4 tracking-tight flex items-center justify-center gap-2.5">
              <span>Refer Friends, Earn Free Pro</span> <span>🎁</span>
            </h1>
            <p className="font-sans text-[15px] text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Give your friends a 50% discount on their first month of Notrik Pro, and you get a completely free month of Aspirant Pro for every friend who signs up!
            </p>
            
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl inline-flex flex-col sm:flex-row items-center gap-4 mx-auto shadow-sm max-w-md w-full">
              <div className="font-mono font-bold text-lg tracking-wider px-4 py-2 text-white text-center sm:text-left flex-1">
                {inviteCode}
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-brand-3 px-6 py-3 rounded-xl font-sans font-bold flex items-center justify-center gap-2 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-xs w-full sm:w-auto shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={2.5} /> Copy Invite Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <h2 className="font-serif font-black text-2xl mb-8 text-center flex items-center justify-center gap-2">
          <span className="text-gradient">How Referral Works</span> <span>🎉</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel border border-black/5 rounded-[2rem] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-3/10 text-brand-3 flex items-center justify-center mb-6 border border-brand-3/15">
              <Copy className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <h3 className="font-serif font-black text-[17px] mb-2 text-foreground">1. Send Link</h3>
            <p className="font-sans text-[13px] text-foreground/50 leading-relaxed font-medium">Share your unique coupon code or referral link with fellow students.</p>
          </div>
          
          <div className="glass-panel border border-black/5 rounded-[2rem] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 border border-amber-500/15">
              <Users className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <h3 className="font-serif font-black text-[17px] mb-2 text-foreground">2. They Join</h3>
            <p className="font-sans text-[13px] text-foreground/50 leading-relaxed font-medium">They get an instant 50% discount on any monthly subscription plan.</p>
          </div>

          <div className="glass-panel border border-black/5 rounded-[2rem] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 border border-green-500/15">
              <Gift className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <h3 className="font-serif font-black text-[17px] mb-2 text-foreground">3. Get Free Month</h3>
            <p className="font-sans text-[13px] text-foreground/50 leading-relaxed font-medium">For each conversion, you get a full month of Pro credited instantly.</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="glass-panel border border-black/5 rounded-[2.5rem] p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[40%] bg-gradient-to-br from-brand-3/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
          <div className="text-center md:text-left">
            <h3 className="font-serif font-black text-xl mb-1 text-foreground">Your Referrals</h3>
            <p className="font-sans text-[13px] text-foreground/50 font-medium">Track your active invitations and months earned.</p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <div className="font-serif font-black text-4xl text-gradient">{friendsJoined}</div>
              <div className="font-sans text-[10px] text-foreground/45 uppercase tracking-widest font-extrabold mt-2">Friends Joined</div>
            </div>
            <div className="text-center">
              <div className="font-serif font-black text-4xl text-gradient">{monthsEarned}</div>
              <div className="font-sans text-[10px] text-foreground/45 uppercase tracking-widest font-extrabold mt-2">Months Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
