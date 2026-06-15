"use client";
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Sigma, AlertTriangle, HelpCircle } from "lucide-react";

interface FormulaCardProps {
  name: string;
  formula: string;
  whenToUse: string;
  commonMistake?: string;
  index: number;
}

export default function FormulaCard({ name, formula, whenToUse, commonMistake, index }: FormulaCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white border border-black/10 rounded-2xl p-6 print:p-4 shadow-sm relative overflow-hidden print:break-inside-avoid print:shadow-none"
    >
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-black/5 shadow-inner text-foreground/80 flex items-center justify-center">
          <Sigma className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif font-bold text-xl text-foreground">{name}</h3>
      </div>
      
      <div className="w-full bg-[#FAFAFA] border border-black/10 rounded-xl p-4 sm:p-6 print:p-4 mb-6 print:mb-4 flex justify-center overflow-x-auto shadow-inner print:shadow-none">
        <div className="text-xl md:text-2xl text-foreground">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {formula}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <HelpCircle className="w-4 h-4 text-foreground/50 mt-1 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="font-sans font-bold text-xs uppercase tracking-wider text-foreground/50 mb-1">When to Use</p>
            <div className="font-sans text-sm text-foreground/80 leading-relaxed prose prose-slate prose-p:my-0 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {whenToUse}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        
        {commonMistake && (
          <div className="flex gap-3 items-start pt-4 border-t border-black/5">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="font-sans font-bold text-xs uppercase tracking-wider text-red-500/70 mb-1">Common Mistake</p>
              <div className="font-sans text-sm text-red-600/90 leading-relaxed prose prose-slate prose-p:my-0 prose-strong:text-red-700 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {commonMistake}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
