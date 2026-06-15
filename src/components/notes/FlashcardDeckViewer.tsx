"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Settings, Edit3, Target, Flame, Brain, CheckCircle, Clock, Layers } from "lucide-react";
import FlashcardPlayer, { Flashcard } from "./FlashcardPlayer";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function FlashcardDeckViewer({ note }: { note: any }) {
  const content = note.content;
  const flashcards: Flashcard[] = content.flashcards || [];

  const [isStudying, setIsStudying] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, due: flashcards.length, accuracy: 0 });

  const handleStudyComplete = (sessionStats: any) => {
    setIsStudying(false);
    // Simple state update for demo purposes. Will be replaced by Supabase logic.
    setStats({
      mastered: sessionStats.mastered,
      due: Math.max(0, flashcards.length - sessionStats.mastered),
      accuracy: sessionStats.reviewed > 0 ? Math.round((sessionStats.mastered / sessionStats.reviewed) * 100) : 0
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-24 relative">
      
      {isStudying && (
        <FlashcardPlayer 
          deckTitle={content.title || note.title} 
          cards={flashcards} 
          onClose={() => setIsStudying(false)} 
          onComplete={handleStudyComplete} 
        />
      )}

      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex flex-wrap justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-brand-1/10 text-brand-1 text-xs font-bold uppercase tracking-wider font-sans">
            Smart Flashcards
          </span>
          {content.tags?.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 rounded-full bg-black/5 text-foreground/60 text-xs font-bold uppercase tracking-wider font-sans">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-tight">
          {content.title || note.title}
        </h1>
        
        {content.examRelevance && (
          <div className="inline-flex items-center gap-2 bg-brand-3/10 text-brand-3 px-4 py-2 rounded-xl font-sans font-medium text-sm">
            <Target className="w-4 h-4" />
            <span>{content.examRelevance}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8 pt-4 px-4 sm:px-0">
          <button
            onClick={() => setIsStudying(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-1 text-white hover:bg-brand-1/90 transition-colors px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-sans font-bold text-base sm:text-lg shadow-lg shadow-brand-1/30"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Study Now</span>
          </button>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-black/5 transition-colors text-foreground px-5 sm:px-6 py-3 sm:py-4 rounded-2xl font-sans font-bold text-base sm:text-lg border border-black/10 shadow-sm"
          >
            <Edit3 className="w-5 h-5 text-brand-4" />
            <span>Edit Deck</span>
          </button>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-panel bg-white/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center">
          <Layers className="w-6 h-6 text-brand-4 mb-2 opacity-50" />
          <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{flashcards.length}</p>
          <p className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-foreground/50 mt-1">Total Cards</p>
        </div>
        <div className="glass-panel bg-green-500/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center border-green-500/20">
          <CheckCircle className="w-6 h-6 text-green-500 mb-2 opacity-50" />
          <p className="text-2xl sm:text-3xl font-serif font-bold text-green-600">{stats.mastered}</p>
          <p className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-green-600/60 mt-1">Mastered</p>
        </div>
        <div className="glass-panel bg-yellow-500/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center border-yellow-500/20">
          <Clock className="w-6 h-6 text-yellow-600 mb-2 opacity-50" />
          <p className="text-2xl sm:text-3xl font-serif font-bold text-yellow-600">{stats.due}</p>
          <p className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-yellow-600/60 mt-1">Due for Review</p>
        </div>
        <div className="glass-panel bg-brand-1/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center border-brand-1/20">
          <Brain className="w-6 h-6 text-brand-1 mb-2 opacity-50" />
          <p className="text-2xl sm:text-3xl font-serif font-bold text-brand-1">{stats.accuracy}%</p>
          <p className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-brand-1/60 mt-1">Accuracy</p>
        </div>
      </motion.div>

      {/* Study Modes */}
      <section>
        <h3 className="font-serif font-bold text-2xl text-foreground mb-6">Study Modes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => setIsStudying(true)} className="text-left glass-panel bg-white p-5 sm:p-6 rounded-2xl hover:border-brand-1/50 transition-colors group">
            <h4 className="font-sans font-bold text-lg text-foreground group-hover:text-brand-1 transition-colors">Full Review</h4>
            <p className="text-sm text-foreground/60 mt-2">Go through all {flashcards.length} cards in the deck sequentially.</p>
          </button>
          <button onClick={() => setIsStudying(true)} className="text-left glass-panel bg-white p-5 sm:p-6 rounded-2xl hover:border-yellow-500/50 transition-colors group">
            <h4 className="font-sans font-bold text-lg text-foreground group-hover:text-yellow-600 transition-colors">Due Today</h4>
            <p className="text-sm text-foreground/60 mt-2">Only review the {stats.due} cards that need spaced repetition.</p>
          </button>
          <button onClick={() => setIsStudying(true)} className="text-left glass-panel bg-white p-5 sm:p-6 rounded-2xl hover:border-red-500/50 transition-colors group">
            <h4 className="font-sans font-bold text-lg text-foreground group-hover:text-red-600 transition-colors">Weak Areas</h4>
            <p className="text-sm text-foreground/60 mt-2">Focus exclusively on cards you marked as difficult.</p>
          </button>
        </div>
      </section>

      {/* Card Grid Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif font-bold text-2xl text-foreground">Cards Preview</h3>
          <button className="text-sm font-sans font-bold text-brand-1 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.slice(0, 9).map((card, i) => (
            <div key={card.id || i} className="glass-panel bg-white p-6 rounded-2xl h-48 flex flex-col relative overflow-hidden group hover:border-black/20 transition-all hover:shadow-md cursor-pointer">
              <div className="flex-1 overflow-y-auto scrollbar-thin text-sm font-serif font-bold text-foreground leading-relaxed prose prose-slate">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {card.front}
                </ReactMarkdown>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-foreground/40">
                <span>Card {i + 1}</span>
                <span className={`px-2 py-1 rounded-md ${card.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600' : card.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                  {card.difficulty || 'Medium'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
