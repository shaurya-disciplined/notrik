"use client";
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";

interface ConceptCardProps {
  concept: string;
  explanation: string;
  importance?: string;
  index: number;
  noteId?: string;
}

export default function ConceptCard({ concept, explanation, importance, index, noteId }: ConceptCardProps) {
  const content = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-black/10 rounded-2xl p-6 print:p-4 shadow-sm hover:shadow-md hover:border-black/20 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden print:break-inside-avoid print:shadow-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 print:mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-black/5 shadow-inner text-foreground/80 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-foreground/80 transition-colors">{concept}</h3>
        </div>
        {importance && (
          <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shrink-0 ${
            importance.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-600' :
            importance.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-600' :
            'bg-green-500/10 text-green-600'
          }`}>
            {importance}
          </span>
        )}
      </div>
      
      <div className="font-sans text-sm text-foreground/80 leading-relaxed prose prose-slate max-w-none prose-p:my-2 line-clamp-4 print:line-clamp-none mb-4 print:mb-2 relative z-10">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {explanation}
        </ReactMarkdown>
      </div>

      <div className="mt-auto pt-2 flex items-center gap-2 text-foreground/60 text-[13px] font-bold opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 relative z-10 print:hidden uppercase tracking-wider">
        <span>Deep Dive</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
      </div>
    </motion.div>
  );

  if (noteId) {
    return (
      <Link href={`/dashboard/notes/${noteId}/concept/${index}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
