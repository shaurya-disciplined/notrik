"use client";
import React, { useContext, useState, useEffect } from "react";
import { DashboardContext } from "../../layout";
import { ArrowLeft, ArrowRight, FileText, Zap, Trash2, LogOut, FolderOpen, FolderPlus, GripVertical, Plus, Folder, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function FolderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { folders, subfolders, setSubfolders, notes, setNotes } = useContext(DashboardContext);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isSubfolderPopupOpen, setIsSubfolderPopupOpen] = useState(false);
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const folder = folders?.find((f: any) => f.id === id);
  const folderSubfolders = subfolders?.filter((sf: any) => sf.folderId === id) || [];
  const folderNotesRoot = notes?.filter((n: any) => n.folderId === id && !n.subfolderId) || [];
  
  if (!folder && folders?.length > 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full bg-white">
        <h2 className="text-2xl font-serif font-bold mb-4">Folder not found 🔍</h2>
        <button onClick={() => router.push('/dashboard/library')} className="text-brand-1 font-bold underline">Back to Library</button>
      </div>
    );
  }

  const handleCreateSubfolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubfolderName.trim()) {
      try {
        const res = await fetch('/api/subfolders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSubfolderName, folderId: id })
        });
        if (res.ok) {
          const data = await res.json();
          setSubfolders([data.subfolder, ...subfolders]);
          setNewSubfolderName("");
          setIsSubfolderPopupOpen(false);
        }
      } catch (err) {
        console.error("Error creating subfolder", err);
      }
    }
  };

  const handleDeleteSubfolder = async (e: React.MouseEvent, subId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subfolder? Notes inside will be kept in the parent folder.")) {
      try {
        await fetch(`/api/subfolders/${subId}`, { method: 'DELETE' });
        setSubfolders(subfolders.filter((sf: any) => sf.id !== subId));
        setNotes(notes.map((n: any) => n.subfolderId === subId ? { ...n, subfolderId: null } : n));
      } catch (err) {
        console.error("Failed to delete subfolder", err);
      }
    }
  };

  const handleRemoveFromFolder = async (noteId: string) => {
    try {
      setNotes(notes.map((n: any) => n.id === noteId ? { ...n, folderId: null, subfolderId: null } : n));
      
      await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: null, subfolderId: null })
      });
    } catch (err) {
      console.error("Failed to remove note from folder", err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note permanently?")) {
      try {
        await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        setNotes(notes.filter((n: any) => n.id !== noteId));
      } catch (err) {
        console.error("Failed to delete note", err);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNoteId(noteId);
    e.dataTransfer.effectAllowed = "move";
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

  const handleDropToSubfolder = async (e: React.DragEvent, subfolderId: string) => {
    e.preventDefault();
    if (!draggedNoteId) return;

    try {
      setNotes(notes.map((n: any) => n.id === draggedNoteId ? { ...n, subfolderId } : n));
      
      await fetch(`/api/notes/${draggedNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: id, subfolderId })
      });
    } catch (err) {
      console.error("Failed to move note to subfolder", err);
    }
    setDraggedNoteId(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-5xl mx-auto">
      
      {/* NEW SUBFOLDER POPUP MODAL */}
      {isSubfolderPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsSubfolderPopupOpen(false)}></div>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-black/5 flex flex-col gap-5">
            <button onClick={() => setIsSubfolderPopupOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <X className="w-5 h-5 text-foreground/50" strokeWidth={2} />
            </button>
            <div>
              <h2 className="font-serif font-black text-2xl text-gradient mb-1 flex items-center gap-2">
                <FolderPlus className="w-6 h-6 text-brand-3" /> Create Subfolder
              </h2>
              <p className="font-sans text-foreground/60 text-[13px] font-medium leading-relaxed">Create a nested sub-topic inside <span className="font-bold">"{folder?.name}"</span>.</p>
            </div>
            
            <form onSubmit={handleCreateSubfolder} className="space-y-5">
              <input 
                type="text" 
                autoFocus
                placeholder="E.g., Chapter 1 Notes" 
                value={newSubfolderName}
                onChange={(e) => setNewSubfolderName(e.target.value)}
                className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold"
              />
              <button type="submit" disabled={!newSubfolderName.trim()} className="w-full bg-gradient-to-r from-brand-3 to-brand-4 text-white font-sans font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-brand-3/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-bold">
                Create Subfolder
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-full">
        <Link href="/dashboard/library" className="inline-flex items-center gap-2 text-foreground/50 hover:text-brand-3 transition-colors font-sans text-xs font-bold uppercase tracking-wider mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to Library
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif font-black text-4xl text-gradient mb-2 tracking-tight flex items-center gap-3">
              <Folder className="w-9 h-9 text-brand-3 shrink-0" strokeWidth={2.5} />
              {folder?.name}
            </h1>
            <p className="font-sans text-foreground/60 font-medium">Manage study topics. Drag notes into subfolders below to organize further.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button onClick={() => setIsSubfolderPopupOpen(true)} className="bg-white border border-black/10 text-foreground/75 px-5 py-3 rounded-xl font-sans font-bold transition-all shadow-sm flex items-center gap-2 hover:bg-black/5">
              <FolderPlus className="w-5 h-5 text-brand-3" strokeWidth={2} /> Subfolder
            </button>
            <Link href="/dashboard" className="bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white px-5 py-3 rounded-xl font-sans font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
              <Plus className="w-5 h-5" strokeWidth={2.5} /> Transform Notes
            </Link>
          </div>
        </div>

        {/* Subfolders Section */}
        <div className="mb-12">
          <h2 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-4 ml-1 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> Subfolders
          </h2>
          {folderSubfolders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folderSubfolders.map((sub: any) => (
                <div 
                  key={sub.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToSubfolder(e, sub.id)}
                  className={`glass-panel rounded-[1.5rem] p-5.5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col ${draggedNoteId ? 'ring-2 ring-brand-3 border-dashed border-brand-3/40 bg-brand-3/5' : 'border border-black/5'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5.5 h-5.5" strokeWidth={2} />
                    </div>
                    <button 
                      onClick={(e) => handleDeleteSubfolder(e, sub.id)} 
                      className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-colors relative z-10" 
                      title="Delete Subfolder"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  
                  <Link href={`/dashboard/subfolder/${sub.id}`} className="block flex-1 z-10">
                    <h3 className="font-sans font-bold text-base text-foreground mb-1 group-hover:text-brand-3 transition-colors">{sub.name}</h3>
                    <p className="font-sans text-[11px] font-semibold text-foreground/45 mb-6 uppercase tracking-wider">Nested Subfolder 📂</p>
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-black/5 font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/40 group-hover:text-foreground/75 transition-colors">
                      Open Subfolder <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-12 bg-white/40 border border-black/5 border-dashed rounded-[2rem] font-sans text-foreground/40 font-medium text-sm shadow-inner">
              No subfolders here yet. Create one above to structure your sub-topics! 🗺️
            </div>
          )}
        </div>

        {/* Root Notes Section */}
        <div>
          <h2 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-4 ml-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> Folder Notes (Unorganized)
          </h2>
          {folderNotesRoot.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folderNotesRoot.map((note: any) => (
                <div 
                  key={note.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id)}
                  onDragEnd={handleDragEnd}
                  className="glass-panel rounded-[1.5rem] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-lg hover:-translate-y-1 hover:border-brand-3/20 transition-all duration-300 group relative cursor-grab active:cursor-grabbing flex flex-col border border-black/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40 transition-colors" strokeWidth={2} />
                      <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                        <FileText className="w-5.5 h-5.5" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                      <button onClick={() => handleRemoveFromFolder(note.id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-amber-500/10 text-foreground/45 hover:text-amber-600 transition-colors" title="Remove from Folder">
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/45 hover:text-red-500 transition-colors" title="Delete Note">
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  
                  <Link href={note.formatRequested === "Smart Flashcards" ? `/dashboard/flashcards/${note.id}` : `/dashboard/notes/${note.id}`} className="block flex-1">
                    <h3 className="font-sans font-black text-sm text-foreground mb-1 leading-tight group-hover:text-brand-3 transition-colors">{note.title || "Untitled Note"}</h3>
                    <p className="font-sans text-[11px] font-semibold text-foreground/40 mb-3 uppercase tracking-wider">{new Date(note.createdAt).toLocaleDateString()}</p>
                    
                    {note.content?.summary && (
                      <p className="font-sans text-[13px] text-foreground/50 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {note.content.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                      <div className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-wider font-extrabold text-brand-3/80">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={2} /> AI Transformed
                      </div>
                      <div className="font-sans text-[11px] font-bold text-foreground/50 group-hover:text-brand-3 transition-colors flex items-center gap-1 uppercase tracking-wider">
                        Open <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                      </div>
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
              <p className="text-foreground/50 text-sm max-w-sm mx-auto font-medium">Drag new study sheets here, or structure them further into subfolders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
