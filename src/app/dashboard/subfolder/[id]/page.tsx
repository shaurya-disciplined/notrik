"use client";
import React, { useContext, useState, useEffect } from "react";
import { DashboardContext } from "../../layout";
import { ArrowLeft, FileText, Zap, Trash2, LogOut, FolderOpen, Folder } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SubfolderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { folders, subfolders, setSubfolders, notes, setNotes } = useContext(DashboardContext);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const subfolder = subfolders?.find((sf: any) => sf.id === id);
  const parentFolder = folders?.find((f: any) => f.id === subfolder?.folderId);
  const subfolderNotes = notes?.filter((n: any) => n.subfolderId === id) || [];

  if (!subfolder && subfolders?.length > 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full bg-white">
        <h2 className="text-2xl font-serif font-bold mb-4">Subfolder not found 🔍</h2>
        <button onClick={() => router.push('/dashboard/library')} className="text-brand-1 font-bold underline">Back to Library</button>
      </div>
    );
  }

  const handleRemoveFromSubfolder = async (noteId: string) => {
    try {
      // Optimistic update: remove subfolderId but keep folderId
      setNotes(notes.map((n: any) => n.id === noteId ? { ...n, subfolderId: null } : n));
      
      await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: subfolder.folderId, subfolderId: null })
      });
    } catch (err) {
      console.error("Failed to remove note from subfolder", err);
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

  const handleDeleteSubfolder = async () => {
    if (window.confirm("Are you sure you want to delete this subfolder? Notes inside will be kept in the parent folder.")) {
      try {
        await fetch(`/api/subfolders/${id}`, { method: 'DELETE' });
        setSubfolders(subfolders.filter((sf: any) => sf.id !== id));
        // Reset subfolderId on local notes, keeping folderId intact
        setNotes(notes.map((n: any) => n.subfolderId === id ? { ...n, subfolderId: null } : n));
        
        if (subfolder?.folderId) {
          router.push(`/dashboard/folder/${subfolder.folderId}`);
        } else {
          router.push('/dashboard/library');
        }
      } catch (err) {
        console.error("Failed to delete subfolder", err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto max-w-5xl mx-auto">
      <div className="w-full">
        {subfolder?.folderId && (
          <Link href={`/dashboard/folder/${subfolder.folderId}`} className="inline-flex items-center gap-2 text-foreground/50 hover:text-brand-3 transition-colors font-sans text-xs font-bold uppercase tracking-wider mb-8">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to {parentFolder?.name || "Parent Folder"}
          </Link>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-foreground/40 uppercase tracking-widest mb-2">
              <Folder className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> {parentFolder?.name} &gt; Nested Subfolder
            </div>
            <h1 className="font-serif font-black text-4xl text-gradient mb-2 tracking-tight flex items-center gap-3">
              <FolderOpen className="w-9 h-9 text-brand-3 shrink-0" strokeWidth={2.5} />
              {subfolder?.name}
            </h1>
            <p className="font-sans text-foreground/60 font-medium">{subfolderNotes.length} notes inside this sub-topic.</p>
          </div>
          
          <button 
            onClick={handleDeleteSubfolder}
            className="border border-red-500/10 text-red-600 bg-red-500/[0.02] hover:bg-red-500/10 px-5 py-3 rounded-xl font-sans font-bold transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} /> Delete Subfolder
          </button>
        </div>

        {/* Notes list */}
        <div>
          <h2 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-4 ml-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-brand-3" strokeWidth={2} /> Subfolder Notes
          </h2>
          {subfolderNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subfolderNotes.map((note: any) => (
                <div 
                  key={note.id}
                  className="glass-panel rounded-[1.5rem] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-lg hover:-translate-y-1 hover:border-brand-3/20 transition-all duration-300 group relative flex flex-col border border-black/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
                      <FileText className="w-5.5 h-5.5" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                      <button 
                        onClick={() => handleRemoveFromSubfolder(note.id)} 
                        className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-amber-500/10 text-foreground/45 hover:text-amber-600 transition-colors" 
                        title="Move to Parent Folder root"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)} 
                        className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/10 text-foreground/45 hover:text-red-500 transition-colors" 
                        title="Delete Note"
                      >
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
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-black/5 mt-auto">
                      <div className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wider font-extrabold text-brand-3/80">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={2} /> AI Transformed
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-24 bg-white/40 border border-black/5 border-dashed rounded-[2.5rem] font-sans flex flex-col items-center justify-center shadow-inner">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-foreground/30" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-black text-2xl text-gradient mb-2 text-foreground">This subfolder is empty</h3>
              <p className="text-foreground/50 text-sm max-w-sm mx-auto font-medium">Go to the parent folder and drag study notes into this subfolder to organize them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
