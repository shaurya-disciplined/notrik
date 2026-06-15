"use client";
import React, { useContext, useState, useEffect } from "react";
import { Zap, Plus, Trash2, Library, BookOpen, Search } from "lucide-react";
import { DashboardContext } from "../../layout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SmartFlashcardsPage() {
  const { notes, setNotes } = useContext(DashboardContext);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);

  // Ensure "Unorganized Flashcards" system deck exists
  useEffect(() => {
    fetch('/api/flashcards/move', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sourceDeckId: 'unorganized-flashcards', 
        targetDeckId: 'unorganized-flashcards', 
        cardId: 'dummy' 
      }) 
    }).catch(e => console.error("Could not ensure unorganized deck exists", e));
  }, []);

  const handleDeleteDeck = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      alert("You cannot delete the system Unorganized Flashcards deck.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this deck? All flashcards inside will be lost.")) {
      try {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        setNotes(notes.filter((n: any) => n.id !== id));
      } catch (err) {
        console.error("Failed to delete deck", err);
      }
    }
  };

  const handleCreateEmptyDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/flashcards/deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newDeckTitle })
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([data.deck, ...notes]);
        setNewDeckTitle("");
        setShowNewDeckModal(false);
        router.push(`/dashboard/flashcards/${data.deck.id}`);
      }
    } catch (err) {
      console.error("Failed to create deck", err);
    }
    setIsCreating(false);
  };

  const flashcardDecks = notes?.filter((n: any) => n.formatRequested === 'Smart Flashcards' && ((n.title || '').toLowerCase().includes(searchQuery.toLowerCase()))) || [];
  
  if (sortBy === "name") {
    flashcardDecks.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
  } else {
    flashcardDecks.sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
  }

  // Separate Unorganized from the rest to always show it first
  const unorganizedDeck = flashcardDecks.find((d: any) => d.id === 'unorganized-flashcards');
  const regularDecks = flashcardDecks.filter((d: any) => d.id !== 'unorganized-flashcards');

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      
      {/* NEW DECK MODAL */}
      {showNewDeckModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowNewDeckModal(false)}></div>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-black/5 flex flex-col gap-5">
            <div>
              <h2 className="font-serif font-black text-2xl mb-1 flex items-center gap-2">
                <span className="text-gradient">Create Empty Deck</span> <span>🎴</span>
              </h2>
              <p className="font-sans text-foreground/60 text-[13px] font-medium leading-relaxed">Manually created decks are completely free and consume no credits.</p>
            </div>
            
            <form onSubmit={handleCreateEmptyDeck} className="space-y-5">
              <input 
                type="text" 
                autoFocus
                placeholder="E.g., AP Biology Chapter 4" 
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold"
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewDeckModal(false)} className="flex-1 bg-black/5 text-foreground font-sans font-bold py-3 rounded-xl hover:bg-black/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!newDeckTitle.trim() || isCreating} className="flex-1 bg-gradient-to-r from-brand-3 to-brand-4 text-white font-sans font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-brand-3/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {isCreating ? "Creating..." : "Create Deck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-serif font-black text-4xl mb-2 tracking-tight flex items-center gap-2">
              <span className="text-gradient">Smart Flashcards</span> <span>⚡</span>
            </h1>
            <p className="font-sans text-foreground/60 font-medium">Manage active recall decks, review target content, and track mastery.</p>
          </div>
          <button onClick={() => setShowNewDeckModal(true)} className="bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white px-6 py-3.5 rounded-xl font-sans font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
            <Plus className="w-5 h-5" strokeWidth={2.5} /> Empty Deck
          </button>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 w-full group focus-within:ring-4 focus-within:ring-brand-3/10 focus-within:border-brand-3 rounded-xl transition-all duration-300 shadow-sm border border-black/10 bg-white/70 backdrop-blur-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-brand-3 transition-colors" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search decks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/40 font-semibold"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-5 py-3.5 bg-white border border-black/10 rounded-xl outline-none focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 transition-all cursor-pointer font-sans font-bold text-xs uppercase tracking-wider text-foreground/60 shadow-sm"
          >
            <option value="recent">Recently created</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {flashcardDecks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* System Deck: Unorganized Flashcards */}
            {unorganizedDeck && (
              <div key={unorganizedDeck.id} className="glass-panel rounded-[1.5rem] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-brand-3/20 bg-brand-3/[0.02] group relative flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                    <Library className="w-5.5 h-5.5" strokeWidth={2} />
                  </div>
                </div>
                <Link href={`/dashboard/flashcards/${unorganizedDeck.id}`} className="block flex-1">
                  <h3 className="font-sans font-bold text-base text-foreground mb-1 leading-tight group-hover:text-brand-3 transition-colors">{unorganizedDeck.title}</h3>
                  <p className="font-sans text-[11px] font-semibold text-foreground/45 mb-4 uppercase tracking-wider">Global holding area</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-black/5 mt-auto font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/45 group-hover:text-foreground/75 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} /> {unorganizedDeck.content?.flashcards?.length || 0} Cards
                  </div>
                </Link>
              </div>
            )}

            {/* Regular Decks */}
            {regularDecks.map((deck: any) => (
              <div key={deck.id} className="glass-panel rounded-[1.5rem] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative flex flex-col border border-black/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                    <Zap className="w-5.5 h-5.5" strokeWidth={2} />
                  </div>
                  <button onClick={() => handleDeleteDeck(deck.id, false)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-colors relative z-10" title="Delete Deck">
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                
                <Link href={`/dashboard/flashcards/${deck.id}`} className="block flex-1">
                  <h3 className="font-sans font-bold text-base text-foreground mb-1 leading-tight group-hover:text-brand-3 transition-colors">{deck.title || "Untitled Deck"}</h3>
                  <p className="font-sans text-[11px] font-semibold text-foreground/45 mb-4 uppercase tracking-wider">{new Date(deck.createdAt).toLocaleDateString()}</p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-black/5 mt-auto">
                    <div className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/45 group-hover:text-foreground/75 transition-colors">
                      <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} /> {deck.content?.flashcards?.length || 0} Cards
                    </div>
                    {deck.sourceType === "System" || deck.sourceType === "Manual" ? (
                      <div className="flex items-center gap-2 font-sans text-[9px] font-extrabold uppercase tracking-wider text-foreground/40 ml-auto px-2 py-0.5 bg-black/5 rounded-md">
                        Manual
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-sans text-[9px] font-extrabold uppercase tracking-wider text-amber-600 ml-auto px-2 py-0.5 bg-amber-500/10 rounded-md">
                        <Zap className="w-3 h-3 text-amber-600 fill-amber-600" strokeWidth={2} /> AI Generated
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-20 bg-white/40 border border-black/5 border-dashed rounded-[2.5rem] font-sans flex flex-col items-center justify-center shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-foreground/30" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-black text-2xl text-gradient mb-2">No flashcard decks yet</h3>
            <p className="text-foreground/50 text-sm max-w-sm mx-auto mb-6 font-medium">Create a free empty deck manually or upload study materials to generate cards using Gemini AI.</p>
            <button onClick={() => setShowNewDeckModal(true)} className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-3.5 rounded-xl font-sans font-bold hover:shadow-[0_8px_30px_rgba(249,115,22,0.3)] shadow-md hover:-translate-y-0.5 transition-all">
              + Empty Deck
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
