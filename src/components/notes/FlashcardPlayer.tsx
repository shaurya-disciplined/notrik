"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { X, Check, ArrowRight, ArrowLeft, RefreshCw, Target, Brain, Flag, Layers } from "lucide-react";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty?: string;
  status?: 'new' | 'learning' | 'mastered';
}

interface FlashcardPlayerProps {
  deckTitle: string;
  cards: Flashcard[];
  onClose: () => void;
  onComplete: (stats: any) => void;
}

export default function FlashcardPlayer({ deckTitle, cards, onClose, onComplete }: FlashcardPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ mastered: 0, learning: 0, hard: 0, reviewed: 0 });
  const [startTime, setStartTime] = useState(Date.now());

  const currentCard = cards[currentIndex];
  
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds
        onComplete({ ...sessionStats, timeTaken });
      }
    }, 150); // slight delay for smooth flip back
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  const handleStatus = (status: 'mastered' | 'learning' | 'hard', e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionStats(prev => ({ ...prev, [status]: prev[status] + 1, reviewed: prev.reviewed + 1 }));
    handleNext();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-black/5">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/60">
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">{deckTitle}</h2>
            <p className="text-xs font-sans text-foreground/50 tracking-wider uppercase font-semibold">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-sans font-bold">
            <span className="text-green-600 flex items-center gap-0.5 sm:gap-1"><Check className="w-3 h-3 sm:w-4 h-4"/> {sessionStats.mastered}</span>
            <span className="text-yellow-600 flex items-center gap-0.5 sm:gap-1"><RefreshCw className="w-3 h-3 sm:w-4 h-4"/> {sessionStats.learning}</span>
            <span className="text-red-600 flex items-center gap-0.5 sm:gap-1"><Flag className="w-3 h-3 sm:w-4 h-4"/> {sessionStats.hard}</span>
          </div>
          <div className="w-20 sm:w-32 h-2 bg-black/5 rounded-full overflow-hidden ml-2 sm:ml-4">
              <motion.div 
                className="h-full bg-brand-1"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
          </div>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 perspective-1000 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl h-[320px] sm:h-auto sm:aspect-video relative cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div 
              className="w-full h-full preserve-3d transition-transform duration-500 rounded-3xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              {/* FRONT */}
              <div className="absolute inset-0 glass-panel bg-white/80 rounded-3xl p-6 sm:p-12 flex flex-col justify-center items-center text-center backface-hidden shadow-2xl">
                <div className="absolute top-6 left-6 flex items-center gap-2 text-foreground/40 font-sans font-bold text-xs uppercase tracking-widest">
                  <Layers className="w-4 h-4" /> Front
                </div>
                {currentCard?.difficulty && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 text-foreground/50">
                    {currentCard.difficulty}
                  </div>
                )}
                
                <div className="font-serif text-xl sm:text-3xl md:text-4xl text-foreground font-bold leading-tight prose prose-slate max-w-none prose-p:my-0 w-full px-4 overflow-y-auto max-h-[160px] sm:max-h-none scrollbar-thin">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentCard?.front || "No front content"}
                  </ReactMarkdown>
                </div>
                
                <p className="absolute bottom-8 font-sans text-brand-3 text-xs font-bold bg-brand-3/10 px-4 py-2 rounded-full uppercase tracking-wider animate-pulse">
                  Tap or Space to flip
                </p>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 bg-brand-1 text-white rounded-3xl p-6 sm:p-12 flex flex-col justify-center items-center text-center rotate-y-180 backface-hidden shadow-2xl border border-white/20">
                <div className="absolute top-6 left-6 flex items-center gap-2 text-white/50 font-sans font-bold text-xs uppercase tracking-widest">
                  <Brain className="w-4 h-4" /> Back
                </div>
                
                <div className="font-sans text-base sm:text-xl md:text-2xl font-medium leading-relaxed prose prose-invert max-w-none prose-p:my-2 overflow-y-auto w-full px-4 max-h-[180px] sm:max-h-none scrollbar-thin">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentCard?.back || "No back content"}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="p-4 md:p-6 bg-white border-t border-black/5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start order-2 sm:order-1">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 md:px-6 md:py-3 rounded-xl bg-black/5 text-foreground font-sans font-bold text-sm hover:bg-black/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span>
            </button>
            <button 
              onClick={handleNext}
              className="p-3 md:px-6 md:py-3 rounded-xl bg-black/5 text-foreground font-sans font-bold text-sm hover:bg-black/10 transition-colors flex items-center gap-2"
            >
              <span className="hidden sm:inline">Skip</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {isFlipped && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 w-full sm:w-auto justify-center order-1 sm:order-2"
              >
                <button 
                  onClick={(e) => handleStatus('hard', e)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-red-500/10 text-red-600 font-sans font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" /> Hard
                </button>
                <button 
                  onClick={(e) => handleStatus('learning', e)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-yellow-500/10 text-yellow-600 font-sans font-bold text-sm hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Review
                </button>
                <button 
                  onClick={(e) => handleStatus('mastered', e)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-green-500 text-white font-sans font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Check className="w-4 h-4" /> Mastered
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
}
