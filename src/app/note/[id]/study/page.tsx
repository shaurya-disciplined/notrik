"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api, Flashcard } from "@/lib/api";
import { ChevronLeft, Layers, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";

export default function StudyToolsPage() {
  const { id } = useParams() as { id: string };
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFlashcards(id).then(data => {
      setFlashcards(data);
      setLoading(false);
    });
  }, [id]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => (prev + 1) % flashcards.length), 150);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto flex flex-col">
      <Navbar />
      
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/note/${id}`} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground/70" />
        </Link>
        <div>
          <h1 className="font-sans font-bold text-3xl tracking-tight mb-1">Study Artifacts</h1>
          <p className="font-mono text-xs text-foreground/50">On-demand generation to save tokens.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-colors ${activeTab === 'flashcards' ? 'bg-brand-1 text-white' : 'text-foreground/50 hover:text-foreground'}`}
        >
          <Layers className="w-4 h-4" /> Flashcards
        </button>
        <button 
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-colors ${activeTab === 'quiz' ? 'bg-brand-3 text-black' : 'text-foreground/50 hover:text-foreground'}`}
        >
          <HelpCircle className="w-4 h-4" /> Generate Quiz
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="animate-pulse text-brand-2 font-mono text-sm">Synthesizing study materials...</div>
        ) : activeTab === "flashcards" && flashcards.length > 0 ? (
          <div className="w-full max-w-lg">
            <div className="flex justify-between font-mono text-xs text-foreground/40 mb-4 px-4">
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
              <span>Tap to flip</span>
            </div>
            
            <div 
              className="relative w-full h-[300px] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`absolute w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden glass-panel rounded-[2rem] p-8 flex items-center justify-center text-center shadow-xl border border-white/10">
                  <h3 className="font-sans font-bold text-2xl text-brand-1">{flashcards[currentIndex].front}</h3>
                </div>
                
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden glass-panel rounded-[2rem] p-8 flex items-center justify-center text-center shadow-xl border border-brand-4/30 rotate-y-180 bg-brand-4/5">
                  <p className="font-serif italic text-2xl leading-relaxed text-foreground/90">{flashcards[currentIndex].back}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => {setIsFlipped(false); setCurrentIndex(0);}} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-foreground/50">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={nextCard} className="px-8 py-4 rounded-full bg-brand-2 text-black font-bold font-mono text-sm hover:scale-105 transition-transform flex items-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : activeTab === "flashcards" ? (
          <div className="text-center text-foreground/50 font-mono text-sm">No flashcards found.</div>
        ) : (
          <div className="text-center max-w-md">
            <div className="p-6 rounded-[2rem] glass-panel border border-brand-3/30 mb-6">
              <HelpCircle className="w-12 h-12 text-brand-3 mx-auto mb-4" />
              <h3 className="font-sans font-bold text-xl mb-2">Quiz Generation</h3>
              <p className="font-mono text-xs text-foreground/60 leading-relaxed mb-6">
                Generate a dynamic multiple-choice and short-answer test based exclusively on the current note context to save tokens.
              </p>
              <button className="w-full py-3 rounded-full bg-brand-3 text-black font-bold font-mono text-sm hover:opacity-90 transition-opacity">
                Generate Now (≈2.1k tokens)
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
