"use client";
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { PenTool, CheckCircle } from "lucide-react";

interface ExampleCardProps {
  problem: string;
  solution: string;
  index: number;
}

export default function ExampleCard({ problem, solution, index }: ExampleCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden flex flex-col print:break-inside-avoid print:shadow-none"
    >
      <div className="bg-[#FAFAFA] shadow-inner p-6 print:p-4 border-b border-black/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-black/5 shadow-sm text-foreground/70 flex items-center justify-center">
            <PenTool className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <h4 className="font-sans font-bold text-[11px] uppercase tracking-widest text-foreground/50">Problem Example</h4>
        </div>
        <div className="font-sans text-foreground/90 font-medium leading-relaxed prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {problem}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="p-6 print:p-4 bg-white flex-1">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1.5} />
          <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-foreground/70">Step-by-step Solution</h4>
        </div>
        <div className="font-sans text-sm text-foreground/80 leading-relaxed prose prose-slate max-w-none prose-p:my-2 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {solution}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
