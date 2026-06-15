import React from "react";
import { getNotes } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Server Component
export default async function ConceptPage({ params }: { params: Promise<{ id: string, conceptId: string }> }) {
  const resolvedParams = await params;
  const notes = await getNotes();
  const note = notes.find(n => n.id === resolvedParams.id);

  if (!note || !note.content?.keyConcepts) {
    notFound();
  }

  const conceptIndex = parseInt(resolvedParams.conceptId, 10);
  const concept = note.content.keyConcepts[conceptIndex];

  if (!concept) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        
        <Link href={`/dashboard/notes/${resolvedParams.id}`} className="inline-flex items-center gap-2 text-foreground/50 hover:text-brand-1 transition-colors font-sans text-sm font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Note
        </Link>

        <div className="bg-white border border-black/10 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] border border-black/5 shadow-inner text-foreground/80 flex items-center justify-center shrink-0">
                <Lightbulb className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground tracking-tight">{concept.concept}</h1>
                <p className="font-sans text-sm font-medium text-foreground/50 mt-1 uppercase tracking-wider">Key Concept Deep Dive</p>
              </div>
            </div>
            {concept.importance && (
              <span className={`text-[11px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shrink-0 ${
                concept.importance.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-600' :
                concept.importance.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                'bg-green-500/10 text-green-600'
              }`}>
                {concept.importance} Priority
              </span>
            )}
          </div>
          
          <div className="font-sans text-lg text-foreground/80 leading-relaxed prose prose-slate max-w-none prose-p:my-4 prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {concept.explanation}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
