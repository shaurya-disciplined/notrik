"use client";
import React, { useContext, useState } from "react";
import { Folder, FileText, Zap, Trash2, GripVertical, Search } from "lucide-react";
import { DashboardContext } from "../../layout";
import Link from "next/link";

export default function LibraryPage() {
  const { folders, setFolders, notes, setNotes, setIsFolderPopupOpen } = useContext(DashboardContext);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const handleDeleteFolder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this folder? Notes inside will be kept and moved to the unorganized library.")) {
      try {
        await fetch(`/api/folders/${id}`, { method: 'DELETE' });
        setFolders(folders.filter((f: any) => f.id !== id));
        // Update local notes state to remove folderId
        setNotes(notes.map((n: any) => n.folderId === id ? { ...n, folderId: null } : n));
      } catch (err) {
        console.error("Failed to delete folder", err);
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note permanently?")) {
      try {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        setNotes(notes.filter((n: any) => n.id !== id));
      } catch (err) {
        console.error("Failed to delete note", err);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNoteId(noteId);
    e.dataTransfer.effectAllowed = "move";
    // Adding a slight delay prevents the drag image from breaking
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedNoteId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToFolder = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggedNoteId) return;

    try {
      // Optimistic update
      setNotes(notes.map((n: any) => n.id === draggedNoteId ? { ...n, folderId } : n));
      
      await fetch(`/api/notes/${draggedNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId })
      });
    } catch (err) {
      console.error("Failed to move note", err);
    }
    setDraggedNoteId(null);
  };

  const filteredFolders = folders?.filter((f: any) => f.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  if (sortBy === "name") {
    filteredFolders.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } else {
    filteredFolders.sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
  }

  const unorganizedNotes = notes?.filter((n: any) => !n.folderId && n.formatRequested !== 'Smart Flashcards' && ((n.title || '').toLowerCase().includes(searchQuery.toLowerCase()))) || [];
  if (sortBy === "name") {
    unorganizedNotes.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
  } else {
    unorganizedNotes.sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif font-black text-4xl mb-2 tracking-tight flex items-center gap-2">
              <span className="text-gradient">Your Library</span> <span>📚</span>
            </h1>
            <p className="font-sans text-foreground/60 font-medium">Drag and drop your study sheets into folders to stay organized.</p>
          </div>
          <button onClick={() => setIsFolderPopupOpen?.(true)} className="bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white px-6 py-3.5 rounded-xl font-sans font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
            + New Folder
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 w-full group focus-within:ring-4 focus-within:ring-brand-3/10 focus-within:border-brand-3 rounded-xl transition-all duration-300 shadow-sm border border-black/10 bg-white/70 backdrop-blur-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-brand-3 transition-colors" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search folders and study notes..." 
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
            <option value="recent">Recently transformed</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Folders Section */}
        <h2 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-4 ml-1 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> Folders
        </h2>
        
        {filteredFolders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {filteredFolders.map((folder: any) => (
              <div 
                key={folder.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropToFolder(e, folder.id)}
                className={`glass-panel rounded-[1.5rem] p-5.5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col ${draggedNoteId ? 'ring-2 ring-brand-3 border-dashed border-brand-3/40 bg-brand-3/5' : 'border border-black/5'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Folder className="w-5.5 h-5.5" strokeWidth={2} />
                  </div>
                  <button onClick={() => handleDeleteFolder(folder.id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-colors relative z-10" title="Delete Folder">
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                
                <Link href={`/dashboard/folder/${folder.id}`} className="block flex-1 z-10">
                  <h3 className="font-sans font-bold text-base text-foreground mb-1 group-hover:text-brand-3 transition-colors">{folder.name}</h3>
                  <p className="font-sans text-[11px] font-semibold text-foreground/45 mb-4 uppercase tracking-wider">Created {new Date(folder.createdAt || Date.now()).toLocaleDateString()}</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-black/5 mt-auto font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/40 group-hover:text-foreground/75 transition-colors">
                    <FileText className="w-3.5 h-3.5" strokeWidth={2.5} /> Open Folder
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-16 bg-white/40 border border-black/5 border-dashed rounded-[2rem] font-sans flex flex-col items-center justify-center mb-16 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-6 h-6 text-foreground/30" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-black text-xl text-foreground mb-2">No folders found</h3>
            <p className="text-foreground/50 text-sm max-w-sm mx-auto font-medium">You haven't created any folders yet, or nothing matches your search query.</p>
          </div>
        )}

        {/* Unorganized Notes Section */}
        <h2 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-4 ml-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> Unorganized Notes
        </h2>
        
        {unorganizedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unorganizedNotes.map((note: any) => (
              <div 
                key={note.id}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
                className="glass-panel rounded-[1.5rem] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-lg hover:-translate-y-1 hover:border-brand-3/20 transition-all duration-300 group relative cursor-grab active:cursor-grabbing flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40 transition-colors" strokeWidth={2} />
                    <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                      <FileText className="w-5.5 h-5.5" strokeWidth={2} />
                    </div>
                  </div>
                  <button onClick={() => handleDeleteNote(note.id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-colors relative z-10" title="Delete Note">
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                
                <Link href={note.formatRequested === "Smart Flashcards" ? `/dashboard/flashcards/${note.id}` : `/dashboard/notes/${note.id}`} className="block flex-1">
                  <h3 className="font-sans font-black text-sm text-foreground mb-1 leading-tight group-hover:text-brand-3 transition-colors">{note.title || "Untitled Note"}</h3>
                  <p className="font-sans text-[11px] font-semibold text-foreground/40 mb-3 uppercase tracking-wider">{new Date(note.createdAt).toLocaleDateString()}</p>
                  
                  {note.content?.summary && (
                    <p className="font-sans text-[13px] text-foreground/50 line-clamp-2 mb-4 leading-relaxed font-medium">
                      {note.content.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-black/5 mt-auto font-sans text-[10px] font-bold uppercase tracking-wider text-brand-3/80">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={2} /> AI Transformed
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-16 bg-white/40 border border-black/5 border-dashed rounded-[2rem] font-sans flex flex-col items-center justify-center shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-foreground/30" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-black text-xl text-foreground mb-2">No unorganized notes</h3>
            <p className="text-foreground/50 text-sm max-w-sm mx-auto font-medium">Start by uploading your messy handwriting or study documents on the dashboard!</p>
          </div>
        )}

      </div>
    </div>
  );
}
