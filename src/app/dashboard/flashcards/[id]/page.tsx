"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardContext } from "../../layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Clock, Target, Play, RotateCcw,
  CheckCircle2, XCircle, GraduationCap, X, Settings, Shuffle, BookOpen, Plus, MoreVertical, Edit2, FolderInput, Trash2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Link from "next/link";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  status?: "mastered" | "review" | "hard" | string;
}

export default function FlashcardsPage() {
  const { id } = useParams() as { id: string };
  const { notes, setNotes } = useContext(DashboardContext);
  const router = useRouter();

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardFormFront, setCardFormFront] = useState("");
  const [cardFormBack, setCardFormBack] = useState("");
  const [cardFormDifficulty, setCardFormDifficulty] = useState("Medium");
  const [isSaving, setIsSaving] = useState(false);

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveCardId, setMoveCardId] = useState<string | null>(null);
  const [targetDeckId, setTargetDeckId] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // View States
  const [isStudying, setIsStudying] = useState(false);
  const [studySessionComplete, setStudySessionComplete] = useState(false);

  // Study Session State
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ mastered: 0, review: 0, hard: 0 });

  useEffect(() => {
    if (notes) {
      const foundNote = notes.find((n: any) => n.id === id);
      if (foundNote) setNote(foundNote);
      setLoading(false);
    }
  }, [id, notes]);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="w-8 h-8 border-4 border-brand-1 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!note || note.formatRequested !== "Smart Flashcards") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center p-6">
        <div className="w-16 h-16 bg-[#FAFAFA] border border-black/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <XCircle className="w-8 h-8 text-foreground/50" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif font-bold text-2xl mb-2 text-foreground">Flashcards Not Found</h2>
        <p className="font-sans text-[15px] text-foreground/50 mb-8">This note doesn't seem to be a Smart Flashcards deck.</p>
        <button onClick={() => router.push('/dashboard/library/smart-flashcards')} className="bg-foreground text-background px-6 py-3 rounded-xl font-bold font-sans hover:shadow-md transition-all shadow-sm">
          Back to Library
        </button>
      </div>
    );
  }

  const content = note.content || {};
  const cards: Flashcard[] = content.flashcards || [];
  const totalCards = cards.length;
  
  const masteredCards = cards.filter(c => c.status === "mastered");
  const hardCards = cards.filter(c => c.status === "hard");
  const reviewCards = cards.filter(c => c.status === "review" || !c.status);

  // === HANDLERS ===

  const handleStartStudy = (mode: "all" | "due" | "hard") => {
    let pool = cards;
    if (mode === "due") pool = reviewCards.length > 0 ? reviewCards : cards;
    if (mode === "hard") pool = hardCards.length > 0 ? hardCards : cards;

    if (pool.length === 0) return;

    setStudyCards(pool);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsStudying(true);
    setStudySessionComplete(false);
    setSessionStats({ mastered: 0, review: 0, hard: 0 });
  };

  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(currentCardIndex + 1), 150);
    } else {
      setStudySessionComplete(true);
    }
  };

  const handleMark = async (status: "mastered" | "review" | "hard", cardId: string) => {
    setSessionStats(prev => ({ ...prev, [status]: prev[status] + 1 }));
    
    // Optimistic UI update
    const updatedCards = cards.map(c => c.id === cardId ? { ...c, status } : c);
    setNote({ ...note, content: { ...content, flashcards: updatedCards } });
    
    handleNextCard();

    try {
      await fetch('/api/flashcards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: id, cardId, status })
      });
    } catch (e) {
      console.error("Failed to save status", e);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = '/api/flashcards';
      const method = editingCardId ? 'PUT' : 'POST';
      const body = {
        deckId: id,
        cardId: editingCardId,
        front: cardFormFront,
        back: cardFormBack,
        difficulty: cardFormDifficulty
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        let newCards;
        if (editingCardId) {
          newCards = cards.map(c => c.id === editingCardId ? data.card : c);
        } else {
          newCards = [...cards, data.card];
        }
        setNote({ ...note, content: { ...content, flashcards: newCards } });
        setShowAddEditModal(false);
      }
    } catch (e) {
      console.error("Failed to save card", e);
    }
    setIsSaving(false);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm("Delete this flashcard?")) {
      const newCards = cards.filter(c => c.id !== cardId);
      setNote({ ...note, content: { ...content, flashcards: newCards } });
      try {
        await fetch(`/api/flashcards?deckId=${id}&cardId=${cardId}`, { method: 'DELETE' });
      } catch (e) {
        console.error("Failed to delete card", e);
      }
    }
  };

  const handleMoveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveCardId || !targetDeckId || targetDeckId === id) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/flashcards/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceDeckId: id, targetDeckId, cardId: moveCardId })
      });
      if (res.ok) {
        const newCards = cards.filter(c => c.id !== moveCardId);
        setNote({ ...note, content: { ...content, flashcards: newCards } });
        setShowMoveModal(false);
      }
    } catch (e) {
      console.error("Failed to move card", e);
    }
    setIsSaving(false);
  };

  const openAddModal = () => {
    setEditingCardId(null);
    setCardFormFront("");
    setCardFormBack("");
    setCardFormDifficulty("Medium");
    setShowAddEditModal(true);
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCardId(card.id);
    setCardFormFront(card.front);
    setCardFormBack(card.back);
    setCardFormDifficulty(card.difficulty || "Medium");
    setShowAddEditModal(true);
  };

  const openMoveModal = (cardId: string) => {
    setMoveCardId(cardId);
    setTargetDeckId("unorganized-flashcards");
    setShowMoveModal(true);
  };

  // === RENDER ===

  const decksList = notes?.filter((n: any) => n.formatRequested === 'Smart Flashcards') || [];

  if (isStudying) {
    if (studySessionComplete) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-6 max-w-2xl mx-auto w-full">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl p-10 text-center shadow-inner"
          >
            <div className="w-20 h-20 bg-white shadow-sm border border-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-3xl mb-3 text-foreground">Session Complete!</h2>
            <p className="font-sans text-[15px] text-foreground/50 mb-8">Great job! You reviewed {studyCards.length} cards.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-black/10 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{sessionStats.mastered}</div>
                <div className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mt-1">Mastered</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-black/10 shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{sessionStats.review}</div>
                <div className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mt-1">Review</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-black/10 shadow-sm">
                <div className="text-2xl font-bold text-red-600">{sessionStats.hard}</div>
                <div className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mt-1">Hard</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => handleStartStudy("all")} className="flex-1 bg-white border border-black/10 text-foreground px-6 py-4 rounded-xl font-bold font-sans hover:bg-[#FAFAFA] transition-all shadow-sm">
                Review Again
              </button>
              <button onClick={() => setIsStudying(false)} className="flex-1 bg-foreground text-background px-6 py-4 rounded-xl font-bold font-sans hover:shadow-md transition-all shadow-sm">
                Back to Deck
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    const currentCard = studyCards[currentCardIndex];

    return (
      <div className="flex-1 flex flex-col min-h-[calc(100vh-6rem)] p-4 md:p-8 max-w-4xl mx-auto w-full relative">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setIsStudying(false)} className="flex items-center gap-2 text-foreground/50 hover:text-foreground font-sans font-medium bg-white/50 px-4 py-2 rounded-xl border border-black/5 transition-colors">
            <X className="w-4 h-4" strokeWidth={1.5} /> End Session
          </button>
          <div className="font-sans font-bold text-foreground/50 bg-white/50 px-4 py-2 rounded-xl border border-black/5 shadow-inner">
            {currentCardIndex + 1} / {studyCards.length}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStudyCards([...studyCards].sort(() => Math.random() - 0.5))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 border border-black/5 text-foreground/50 hover:text-foreground transition-colors">
              <Shuffle className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="w-full h-1 bg-black/5 rounded-full mb-12 overflow-hidden shadow-inner">
          <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${((currentCardIndex) / studyCards.length) * 100}%` }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full relative perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id + currentCardIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl aspect-[4/3] md:aspect-[3/2] relative cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500 ease-in-out"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-2xl border border-black/10 shadow-lg p-8 md:p-12 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-foreground/40 font-sans font-bold text-[11px] uppercase tracking-widest">
                    <span>Front</span>
                    <span className="bg-[#FAFAFA] border border-black/5 px-3 py-1 rounded-lg">{currentCard.difficulty || "Medium"}</span>
                  </div>
                  <div className="prose prose-slate max-w-none w-full font-serif font-medium text-[22px] md:text-[28px] text-foreground leading-snug">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentCard.front}</ReactMarkdown>
                  </div>
                  <div className="absolute bottom-6 font-sans text-[10px] font-bold text-foreground/30 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} /> Click to Flip
                  </div>
                </div>

                <div className="absolute inset-0 backface-hidden w-full h-full bg-[#FAFAFA] rounded-2xl border border-black/10 shadow-inner p-8 md:p-12 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-foreground/40 font-sans font-bold text-[11px] uppercase tracking-widest">
                    <span>Back (Answer)</span>
                  </div>
                  <div className="prose prose-slate max-w-none w-full font-sans text-[15px] md:text-[17px] text-foreground overflow-y-auto max-h-full py-6">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentCard.back}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="mt-8 mb-4 flex justify-center">
           {!isFlipped && (
             <button onClick={() => setIsFlipped(true)} className="bg-white border border-black/10 px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all font-bold font-sans flex items-center gap-2">
               <RotateCcw className="w-4 h-4" strokeWidth={1.5} /> Flip Card
             </button>
           )}
        </div>

        <div className={`mt-4 flex items-center justify-center gap-4 w-full max-w-2xl mx-auto transition-opacity duration-300 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleMark("hard", currentCard.id)} className="flex-1 py-4 bg-white hover:bg-[#FAFAFA] text-foreground border border-black/10 rounded-2xl font-sans flex flex-col items-center justify-center gap-1 shadow-sm transition-colors">
            <span className="text-sm font-bold">Difficult</span><span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">1m</span>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleMark("review", currentCard.id)} className="flex-1 py-4 bg-white hover:bg-[#FAFAFA] text-foreground border border-black/10 rounded-2xl font-sans flex flex-col items-center justify-center gap-1 shadow-sm transition-colors">
            <span className="text-sm font-bold">Review</span><span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">10m</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleMark("mastered", currentCard.id)} className="flex-1 py-4 bg-foreground hover:bg-foreground/90 text-background border border-foreground rounded-2xl font-sans flex flex-col items-center justify-center gap-1 shadow-md transition-colors">
            <span className="text-sm font-bold">Mastered</span><span className="text-[10px] text-background/70 font-bold uppercase tracking-wider">4d</span>
          </motion.button>
        </div>
      </div>
    );
  }

  // --- Deck Overview Page ---
  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto p-4 md:p-8 space-y-10 relative">
      
      {/* MODALS */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowAddEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-xl relative z-10 border border-black/10">
              <h2 className="font-serif font-bold text-2xl mb-6">{editingCardId ? "Edit Flashcard" : "Add Flashcard"}</h2>
              <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider font-bold text-foreground/50 mb-2 block">Front (Question / Concept)</label>
                  <textarea required value={cardFormFront} onChange={e => setCardFormFront(e.target.value)} className="w-full bg-[#FAFAFA] shadow-inner border border-black/10 rounded-xl px-4 py-3 font-mono text-[13px] outline-none focus:border-foreground min-h-[100px] transition-all" placeholder="What is the powerhouse of the cell?" />
                </div>
                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider font-bold text-foreground/50 mb-2 block">Back (Answer)</label>
                  <textarea required value={cardFormBack} onChange={e => setCardFormBack(e.target.value)} className="w-full bg-[#FAFAFA] shadow-inner border border-black/10 rounded-xl px-4 py-3 font-mono text-[13px] outline-none focus:border-foreground min-h-[120px] transition-all" placeholder="The Mitochondria." />
                </div>
                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider font-bold text-foreground/50 mb-2 block">Difficulty</label>
                  <select value={cardFormDifficulty} onChange={e => setCardFormDifficulty(e.target.value)} className="w-full bg-[#FAFAFA] shadow-inner border border-black/10 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-foreground transition-all">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t border-black/5">
                  <button type="button" onClick={() => setShowAddEditModal(false)} className="flex-1 bg-white border border-black/10 shadow-sm text-foreground font-sans font-bold text-sm py-3.5 rounded-xl hover:bg-[#FAFAFA] transition-all">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 bg-foreground text-background shadow-sm font-sans font-bold text-sm py-3.5 rounded-xl hover:shadow-md transition-all">{isSaving ? "Saving..." : "Save Card"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showMoveModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowMoveModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl relative z-10 border border-black/10">
              <h2 className="font-serif font-bold text-2xl mb-2">Move Flashcard</h2>
              <p className="font-sans text-[13px] text-foreground/50 mb-6">Select a destination deck for this flashcard.</p>
              <form onSubmit={handleMoveCard} className="space-y-6">
                <select value={targetDeckId} onChange={e => setTargetDeckId(e.target.value)} className="w-full bg-[#FAFAFA] shadow-inner border border-black/10 rounded-xl px-4 py-3 font-sans text-[13px] outline-none focus:border-foreground h-48 transition-all" size={6}>
                  {decksList.map((d: any) => (
                    <option key={d.id} value={d.id} disabled={d.id === id} className="py-2.5 px-3 border-b border-black/5 hover:bg-black/5 rounded-md cursor-pointer">
                      {d.title} {d.id === id ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowMoveModal(false)} className="flex-1 bg-white border border-black/10 shadow-sm text-foreground font-sans font-bold text-sm py-3.5 rounded-xl hover:bg-[#FAFAFA] transition-all">Cancel</button>
                  <button type="submit" disabled={isSaving || !targetDeckId || targetDeckId === id} className="flex-1 bg-foreground text-background shadow-sm font-sans font-bold text-sm py-3.5 rounded-xl hover:shadow-md transition-all">{isSaving ? "Moving..." : "Move Card"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full">
        <Link href="/dashboard/library/smart-flashcards" className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground font-sans font-bold text-[11px] uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Back to Decks
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#FAFAFA] border border-black/10 text-foreground/70 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest font-sans shadow-inner">
                Smart Flashcards
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              {content.title || note.title}
            </h1>
            <p className="font-sans text-foreground/50 text-sm max-w-2xl leading-relaxed">
              {content.examRelevance || "Master this topic with active recall and spaced repetition."}
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={openAddModal} className="flex-1 md:flex-none bg-white border border-black/10 text-foreground px-6 py-3 rounded-xl font-sans font-bold text-[13px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Flashcard
            </button>
            <button disabled={totalCards === 0} onClick={() => handleStartStudy("all")} className="flex-1 md:flex-none bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 py-3 rounded-xl font-sans font-bold text-[13px] shadow-md hover:shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <Play className="w-4 h-4 fill-current" strokeWidth={1.5} /> Study Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 shadow-inner">
          <div className="text-foreground/40 font-sans font-bold text-[10px] uppercase tracking-wider mb-2">Total Cards</div>
          <div className="font-serif font-bold text-3xl text-foreground">{totalCards}</div>
        </div>
        <div className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 shadow-inner">
          <div className="text-green-600/70 font-sans font-bold text-[10px] uppercase tracking-wider mb-2">Mastered</div>
          <div className="font-serif font-bold text-3xl text-green-600">{masteredCards.length}</div>
        </div>
        <div className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 shadow-inner">
          <div className="text-amber-500/70 font-sans font-bold text-[10px] uppercase tracking-wider mb-2">Due for Review</div>
          <div className="font-serif font-bold text-3xl text-amber-500">{reviewCards.length}</div>
        </div>
        <div className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 shadow-inner">
          <div className="text-foreground/40 font-sans font-bold text-[10px] uppercase tracking-wider mb-2">Accuracy</div>
          <div className="font-serif font-bold text-3xl text-foreground">{totalCards > 0 ? Math.round((masteredCards.length / totalCards) * 100) : 0}%</div>
        </div>
      </div>

      {/* Study Modes */}
      {totalCards > 0 && (
        <div>
          <h2 className="font-serif font-bold text-2xl mb-6 text-foreground">Study Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div onClick={() => handleStartStudy("all")} className="bg-foreground rounded-2xl p-6 text-background cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-5 scale-150 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-32 h-32" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-[19px] mb-1 relative z-10">Full Review</h3>
              <p className="font-sans text-background/60 text-[13px] relative z-10">Go through all {totalCards} cards.</p>
            </div>
            
            <div onClick={() => handleStartStudy("due")} className="bg-white border border-black/10 shadow-sm rounded-2xl p-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-[19px] mb-1 text-foreground">Due Today</h3>
              <p className="font-sans text-foreground/50 text-[13px]">{reviewCards.length} cards need review</p>
            </div>

            <div onClick={() => handleStartStudy("hard")} className="bg-white border border-black/10 shadow-sm rounded-2xl p-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-[19px] mb-1 text-foreground">Weak Areas</h3>
              <p className="font-sans text-foreground/50 text-[13px]">{hardCards.length} difficult cards</p>
            </div>
          </div>
        </div>
      )}

      {/* Card List Preview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif font-bold text-2xl text-foreground">All Cards ({totalCards})</h2>
        </div>
        {totalCards === 0 ? (
          <div className="text-center py-16 bg-[#FAFAFA] border border-dashed border-black/10 shadow-inner rounded-2xl">
            <BookOpen className="w-10 h-10 text-foreground/30 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-serif font-bold text-[19px] mb-2 text-foreground">This deck is empty</h3>
            <p className="text-foreground/50 text-[13px] mb-6">Start by adding your first flashcard manually.</p>
            <button onClick={openAddModal} className="bg-foreground text-background px-6 py-3 rounded-xl font-sans font-bold shadow-sm hover:shadow-md transition-all text-[13px]">
              + Add Flashcard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <div key={card.id || i} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm relative group hover:shadow-md transition-all flex flex-col">
                
                {/* Options Dropdown */}
                <div className="absolute top-4 right-4 z-10">
                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === card.id ? null : card.id); }} className="p-1 rounded-md hover:bg-black/5 text-foreground/30 group-hover:text-foreground/50 transition-colors">
                    <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  {openDropdownId === card.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-black/10 shadow-xl rounded-xl overflow-hidden z-20">
                      <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); openEditModal(card); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#FAFAFA] flex items-center gap-2 font-medium">
                        <Edit2 className="w-4 h-4 text-foreground/50" strokeWidth={1.5} /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); openMoveModal(card.id); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#FAFAFA] flex items-center gap-2 font-medium">
                        <FolderInput className="w-4 h-4 text-foreground/50" strokeWidth={1.5} /> Move to Deck
                      </button>
                      <div className="border-t border-black/5 my-1"></div>
                      <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); handleDeleteCard(card.id); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium">
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-4 pr-8 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest font-sans ${
                    card.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    card.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {card.difficulty || 'Medium'}
                  </span>
                  {card.status && (
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest font-sans bg-black/5 text-foreground/60">
                      {card.status}
                    </span>
                  )}
                </div>
                <div className="prose prose-sm prose-slate max-w-none font-serif font-medium line-clamp-4 flex-1">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {card.front}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
