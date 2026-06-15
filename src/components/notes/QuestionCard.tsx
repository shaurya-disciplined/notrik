"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Zap, Eye, EyeOff } from "lucide-react";

interface QuestionCardProps {
  question: string;
  hint?: string;
  index: number;
}

export default function QuestionCard({ question, hint, index }: QuestionCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white border border-black/10 rounded-2xl p-6 print:p-4 shadow-sm hover:shadow-md transition-all group relative print:break-inside-avoid print:shadow-none"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-black/5 shadow-inner text-foreground/80 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 pt-1">
          <div className="font-sans font-medium text-lg text-foreground leading-relaxed prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {question}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {hint && (
        <div className="ml-0 xs:ml-14 print:hidden">
          <button 
            onClick={() => setIsRevealed(!isRevealed)}
            className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors py-2"
          >
            {isRevealed ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
            {isRevealed ? "Hide Hint" : "Show Hint"}
          </button>
          
          <AnimatePresence>
            {isRevealed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#FAFAFA] border border-black/10 shadow-inner rounded-xl p-4 mt-2 font-sans text-[13px] text-foreground/80 prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {hint}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
