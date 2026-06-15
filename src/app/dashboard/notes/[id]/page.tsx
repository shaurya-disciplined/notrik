import React from "react";
import { getNotes } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import NoteViewer from "@/components/notes/NoteViewer";
import FlashcardDeckViewer from "@/components/notes/FlashcardDeckViewer";

// Server Component
export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const notes = await getNotes();
  const note = notes.find(n => n.id === resolvedParams.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        
        <Link href="/dashboard/library" className="inline-flex items-center gap-2 text-foreground/50 hover:text-brand-1 transition-colors font-sans text-sm font-medium mb-8 print:hidden">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        {note.formatRequested === 'Smart Flashcards' ? (
          <FlashcardDeckViewer note={note} />
        ) : (
          <NoteViewer note={note} />
        )}
        
      </div>
    </div>
  );
}
