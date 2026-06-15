"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Search, Folder, CheckCircle2, ChevronRight, Hash, FileText } from "lucide-react";
import { DashboardContext } from "../layout";

export default function SearchPage() {
  const { folders, tasks, notes } = useContext(DashboardContext);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredFolders = folders?.filter((f: any) => f.name.toLowerCase().includes(query.toLowerCase())) || [];
  const filteredTasks = tasks?.filter((t: any) => t.text.toLowerCase().includes(query.toLowerCase())) || [];
  const filteredNotes = notes?.filter((n: any) => 
    (n.title || '').toLowerCase().includes(query.toLowerCase()) || 
    (n.content?.summary || '').toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header & Input */}
        <div className="flex flex-col gap-6 mb-12">
          <div>
            <h1 className="font-serif font-black text-4xl mb-2 tracking-tight flex items-center gap-2">
              <span className="text-gradient">Global Search</span> <span>🔍</span>
            </h1>
            <p className="font-sans text-foreground/60 font-medium">Instantly find folders, notes, tasks, and flashcards across your library.</p>
          </div>
          
          <div className="relative w-full shadow-lg rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 overflow-hidden group focus-within:border-brand-3/80 focus-within:ring-4 focus-within:ring-brand-3/15 transition-all duration-300">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-foreground/40 group-focus-within:text-brand-3 transition-colors" strokeWidth={1.8} />
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything... (e.g., Physics, Formulas, Chemistry)" 
              className="w-full bg-transparent pl-16 pr-8 py-5 font-sans text-lg focus:outline-none text-foreground placeholder:text-foreground/35 font-medium"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilter("all")} className={`px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${filter === "all" ? "bg-brand-3 text-white shadow-md shadow-brand-3/20" : "bg-black/5 hover:bg-black/10 border border-transparent text-foreground/50 hover:text-foreground"}`}>All Results</button>
            <button onClick={() => setFilter("folders")} className={`px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${filter === "folders" ? "bg-brand-3 text-white shadow-md shadow-brand-3/20" : "bg-black/5 hover:bg-black/10 border border-transparent text-foreground/50 hover:text-foreground"}`}>Folders</button>
            <button onClick={() => setFilter("notes")} className={`px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${filter === "notes" ? "bg-brand-3 text-white shadow-md shadow-brand-3/20" : "bg-black/5 hover:bg-black/10 border border-transparent text-foreground/50 hover:text-foreground"}`}>Notes</button>
            <button onClick={() => setFilter("flashcards")} className={`px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${filter === "flashcards" ? "bg-brand-3 text-white shadow-md shadow-brand-3/20" : "bg-black/5 hover:bg-black/10 border border-transparent text-foreground/50 hover:text-foreground"}`}>Flashcards</button>
          </div>
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="w-full text-center py-24 text-foreground/40 font-sans font-bold uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-3">
            <span className="text-3xl animate-bounce">⚡</span>
            <span>Type to start searching notes and folders</span>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Folders */}
            {(filter === "all" || filter === "folders") && filteredFolders.length > 0 && (
              <section>
                <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-3 flex items-center gap-1.5 ml-1">
                  <Folder className="w-3.5 h-3.5 text-brand-3" strokeWidth={2.5} /> Folders ({filteredFolders.length})
                </h3>
                <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-black/5">
                  {filteredFolders.map((folder: any, idx: number) => (
                    <Link href={`/dashboard/folder/${folder.id}`} key={folder.id} className={`p-4 flex items-center gap-4 hover:bg-black/[0.02] cursor-pointer transition-all block ${idx !== filteredFolders.length - 1 ? 'border-b border-black/5' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-bold text-[14px] text-foreground truncate">{folder.name}</h4>
                        <p className="font-sans text-[11px] text-foreground/40 font-medium">Created {new Date(folder.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-foreground/30" strokeWidth={2} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            {(filter === "all" || filter === "notes") && filteredNotes.length > 0 && (
              <section>
                <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-3 flex items-center gap-1.5 ml-1">
                  <FileText className="w-3.5 h-3.5 text-brand-3" strokeWidth={2.5} /> Notes ({filteredNotes.length})
                </h3>
                <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-black/5">
                  {filteredNotes.map((note: any, idx: number) => (
                    <Link href={note.formatRequested === "Smart Flashcards" ? `/dashboard/flashcards/${note.id}` : `/dashboard/notes/${note.id}`} key={note.id} className={`p-4 flex items-center gap-4 hover:bg-black/[0.02] cursor-pointer transition-all block ${idx !== filteredNotes.length - 1 ? 'border-b border-black/5' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-bold text-[14px] text-foreground truncate">{note.title || "Untitled Note"}</h4>
                        <p className="font-sans text-[11px] text-foreground/40 font-medium line-clamp-1">{note.content?.summary || 'No summary available'}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-foreground/30" strokeWidth={2} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Tasks / Flashcards */}
            {(filter === "all" || filter === "flashcards") && filteredTasks.length > 0 && (
              <section>
                <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-3 flex items-center gap-1.5 ml-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-3" strokeWidth={2.5} /> Tasks ({filteredTasks.length})
                </h3>
                <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-black/5">
                  {filteredTasks.map((task: any, idx: number) => (
                    <div key={task.id} className={`p-4 flex items-center gap-4 hover:bg-black/[0.02] cursor-pointer transition-all ${idx !== filteredTasks.length - 1 ? 'border-b border-black/5' : ''}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${task.completed ? 'bg-brand-3 text-white' : 'border border-black/20'}`}>
                        {task.completed && <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-sans font-medium text-[14px] text-foreground truncate ${task.completed ? 'line-through opacity-45' : ''}`}>{task.text}</h4>
                      </div>
                      {task.subject && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-3 px-2 py-1 bg-brand-3/10 rounded-md shrink-0">
                          {task.subject}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredFolders.length === 0 && filteredNotes.length === 0 && filteredTasks.length === 0 && (
              <div className="w-full text-center py-24 bg-white/40 border border-black/5 border-dashed rounded-[2rem] font-sans text-foreground/50 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-5 h-5 text-foreground/30" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-black text-xl mb-1 text-foreground">No matches found</h3>
                <p className="text-sm font-medium">We couldn't find anything matching "{query}"</p>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
