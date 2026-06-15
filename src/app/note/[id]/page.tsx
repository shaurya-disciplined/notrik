"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Note } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Activity, Edit2, Check, BookOpen, ChevronRight, Share, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteViewPage() {
  const { id } = useParams() as { id: string };
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [traceOpen, setTraceOpen] = useState(false);

  useEffect(() => {
    api.getNote(id).then(n => {
      if (n) {
        setNote(n);
        setEditContent(n.content);
      }
    });
  }, [id]);

  if (!note) return <div className="min-h-screen pt-32 text-center">Loading artifact...</div>;

  const handleSave = () => {
    // In a real app, save to DB
    note.content = editContent;
    setNote({ ...note });
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-5xl mx-auto flex">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <div className="flex items-center gap-2 font-mono text-xs text-foreground/40 mb-6">
          <Link href="/library" className="hover:text-brand-1">Library</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-1">{note.subject}</span>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-2">{note.title}</h1>
            <div className="flex items-center gap-4 text-xs font-mono text-foreground/50">
              <span>{new Date(note.createdAt).toLocaleString()}</span>
              <button onClick={() => setTraceOpen(true)} className="flex items-center gap-1 hover:text-brand-3 transition-colors text-brand-4">
                <Activity className="w-3 h-3" /> View Trace
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              {isEditing ? <Check className="w-4 h-4 text-green-400" /> : <Edit2 className="w-4 h-4 text-brand-1" />}
            </button>
            <Link href={`/note/${id}/study`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-1 text-white font-mono text-xs font-bold hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" /> Study Tools
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-8 md:p-12 min-h-[500px]">
          {isEditing ? (
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[600px] bg-transparent font-mono text-sm outline-none resize-y"
            />
          ) : (
            <div className="prose prose-invert prose-brand max-w-none font-sans">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    return <code className={className} {...props}>{children}</code>
                  }
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Trace Drawer Slide-over */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-3xl border-l border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${traceOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-brand-4 font-mono text-sm font-bold uppercase">
              <Activity className="w-4 h-4" /> Pipeline Trace
            </div>
            <button onClick={() => setTraceOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 flex flex-col gap-6 font-mono text-xs">
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <div className="text-white/40 mb-1">Model Route</div>
              <div className="text-brand-1">Gemini 1.5 Pro (Vision) -&gt; Gemini 1.5 Flash (Structure)</div>
            </div>
            
            <div className="glass-panel p-4 rounded-xl border border-white/5 flex justify-between">
              <div>
                <div className="text-white/40 mb-1">Latency</div>
                <div className="text-brand-3 text-lg">1.24s</div>
              </div>
              <div className="text-right">
                <div className="text-white/40 mb-1">Token Cost</div>
                <div className="text-brand-3 text-lg">~4.2k</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-white/40 mb-2 uppercase tracking-widest text-[10px]">Operations Log</div>
              <div className="flex flex-col gap-3 text-white/70">
                <div className="flex gap-2 items-start"><span className="text-green-500">✓</span> Image parsed and text extracted.</div>
                <div className="flex gap-2 items-start"><span className="text-green-500">✓</span> Semantic mapping applied.</div>
                <div className="flex gap-2 items-start"><span className="text-green-500">✓</span> Markdown AST generated.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for Drawer */}
      {traceOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setTraceOpen(false)}></div>
      )}
    </main>
  );
}
