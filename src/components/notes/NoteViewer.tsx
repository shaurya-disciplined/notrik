"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ConceptCard from "./ConceptCard";
import FormulaCard from "./FormulaCard";
import ExampleCard from "./ExampleCard";
import QuestionCard from "./QuestionCard";
import { BookOpen, Target, Network, Sigma, Lightbulb, Zap, AlertTriangle, Clock, Download, FileText, Printer, Link as LinkIcon, CheckCircle, Compass } from "lucide-react";
import ExportModal, { ExportFormat, SectionOption } from "./ExportModal";

export default function NoteViewer({ note }: { note: any }) {
  const content = note.content;

  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  if (!content) return <div>Invalid note content.</div>;

  const availableSections: SectionOption[] = [];
  if (content.summary) availableSections.push({ id: 'summary', label: 'Summary', isAvailable: true, isCsvCompatible: false });
  if (content.feynmanExplanation) availableSections.push({ id: 'feynman', label: 'The Simple Explanation', isAvailable: true, isCsvCompatible: false });
  if (content.conceptRelations) availableSections.push({ id: 'conceptRelations', label: 'Concept Relations', isAvailable: true, isCsvCompatible: false });
  if (content.keyConcepts?.length > 0) availableSections.push({ id: 'keyConcepts', label: 'Key Concepts', isAvailable: true, isCsvCompatible: true });
  if (content.formulas?.length > 0) availableSections.push({ id: 'formulas', label: 'Important Formulas', isAvailable: true, isCsvCompatible: true });
  if (content.examples?.length > 0) availableSections.push({ id: 'examples', label: 'Worked Examples', isAvailable: true, isCsvCompatible: false });
  if (content.commonMistakes?.length > 0) availableSections.push({ id: 'mistakes', label: 'Common Traps', isAvailable: true, isCsvCompatible: false });
  if (content.masteryOutcomes) availableSections.push({ id: 'masteryOutcomes', label: 'Mastery Outcomes', isAvailable: true, isCsvCompatible: false });
  if (content.activeRecallQuestions?.length > 0) availableSections.push({ id: 'activeRecall', label: 'Active Recall', isAvailable: true, isCsvCompatible: true });
  if (content.quickRevision) availableSections.push({ id: 'quickRevision', label: 'Quick Revision', isAvailable: true, isCsvCompatible: false });

  const handleExportClick = (format: ExportFormat) => {
    setExportFormat(format);
    setExportModalOpen(true);
  };

  const handleExportConfirm = (selectedIds: string[], format: ExportFormat) => {
    setExportModalOpen(false);

    if (format === 'pdf') {
      const unselected = new Set(availableSections.map(s => s.id).filter(id => !selectedIds.includes(id)));
      setHiddenSections(unselected);
      
      setTimeout(() => {
        window.print();
        setHiddenSections(new Set());
      }, 100);
    } else {
      const query = selectedIds.join(',');
      const url = `/api/notes/${note.id}/export/${format}?sections=${query}`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 pb-24 relative">
      
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onConfirm={handleExportConfirm}
        exportFormat={exportFormat}
        availableSections={availableSections}
      />

      {/* Print Watermark (Logo + Text) */}
      <div className="hidden print:flex fixed inset-0 z-[9999] pointer-events-none items-center justify-center opacity-[0.06]">
        <div className="flex items-center gap-6 -rotate-45 scale-100">
          <img src="/logo-no-bg.png" alt="Notrik Logo" className="w-32 h-32 object-contain" />
          <h1 className="font-serif font-black text-[8rem] tracking-tighter">NOTRIK</h1>
        </div>
      </div>

      {/* Header & Tags */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex flex-wrap justify-center gap-2 mb-4 print:hidden">
          {content.tags?.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 rounded-full bg-black/5 text-foreground/60 text-xs font-bold uppercase tracking-wider font-sans">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl text-foreground tracking-tight leading-tight">
          {content.title || note.title}
        </h1>
        
        {content.examRelevance && (
          <div className="inline-flex items-center gap-2 bg-[#FAFAFA] text-foreground/70 border border-black/10 px-4 py-2 rounded-xl font-sans font-bold text-[11px] uppercase tracking-wider print:hidden shadow-sm">
            <Target className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{content.examRelevance}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 mt-8 pt-4 print:hidden px-4 sm:px-0">
          <button
            onClick={() => handleExportClick('csv')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAFAFA] transition-colors text-foreground px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] border border-black/10 shadow-sm"
          >
            <Download className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
            <span>Export for Anki (CSV)</span>
          </button>
          <button
            onClick={() => handleExportClick('md')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAFAFA] transition-colors text-foreground px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] border border-black/10 shadow-sm"
          >
            <FileText className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
            <span>Export for Obsidian (MD)</span>
          </button>
          <button
            onClick={() => handleExportClick('pdf')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] border border-transparent shadow-md"
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            <span>Save as Premium PDF</span>
          </button>
        </div>
      </motion.header>

      {/* Summary */}
      {!hiddenSections.has('summary') && content.summary && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 sm:p-8 md:p-10 text-center print:hidden shadow-inner"
        >
          <div className="font-sans text-[17px] text-foreground/80 leading-relaxed max-w-3xl mx-auto prose prose-slate prose-p:my-0 prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {content.summary}
            </ReactMarkdown>
          </div>
        </motion.section>
      )}

      {/* Feynman Explanation */}
      {!hiddenSections.has('feynman') && content.feynmanExplanation && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <BookOpen className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">The Simple Explanation</h2>
          </div>
          <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm font-sans text-[15px] md:text-[17px] text-foreground/80 leading-relaxed prose prose-slate max-w-none prose-p:my-2 prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {content.feynmanExplanation}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Concept Relations and Dependencies */}
      {!hiddenSections.has('conceptRelations') && content.conceptRelations && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <Network className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">Concept Relations and Dependencies</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.conceptRelations.prerequisites?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-white border border-black/10">
                <div className="flex items-center gap-2 mb-4 text-foreground/60">
                  <LinkIcon className="w-4 h-4" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Prerequisites</h3>
                </div>
                <ul className="space-y-2 flex-1">
                  {content.conceptRelations.prerequisites.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[15px] text-foreground/80">
                      <span className="text-brand-3 shrink-0">•</span> <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {content.conceptRelations.whatThisEnables?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-white border border-black/10">
                <div className="flex items-center gap-2 mb-4 text-foreground/60">
                  <Compass className="w-4 h-4" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider">What This Enables</h3>
                </div>
                <ul className="space-y-2 flex-1">
                  {content.conceptRelations.whatThisEnables.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[15px] text-foreground/80">
                      <span className="text-brand-4 shrink-0">→</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {content.conceptRelations.internalConnections?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-brand-1/5 border border-brand-1/10 md:col-span-2">
                <div className="flex items-center gap-2 mb-4 text-brand-1/80">
                  <Network className="w-4 h-4" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Internal Connections</h3>
                </div>
                <ul className="space-y-3">
                  {content.conceptRelations.internalConnections.map((conn: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-foreground/80">
                      <span className="text-brand-1 shrink-0 mt-0.5">◆</span> <span>{conn}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {content.conceptRelations.keyInsights?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-yellow-50 border border-yellow-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-4 text-yellow-700">
                  <Lightbulb className="w-4 h-4" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Key Insights</h3>
                </div>
                <ul className="space-y-3">
                  {content.conceptRelations.keyInsights.map((insight: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-yellow-900/80">
                      <span className="text-yellow-500 shrink-0 mt-0.5">★</span> <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Key Concepts */}
      {!hiddenSections.has('keyConcepts') && content.keyConcepts && content.keyConcepts.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">Key Concepts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.keyConcepts.map((concept: any, i: number) => (
              <ConceptCard 
                key={i}
                index={i}
                noteId={note.id}
                concept={concept.concept}
                explanation={concept.explanation}
                importance={concept.importance}
              />
            ))}
          </div>
        </section>
      )}

      {/* Formulas */}
      {!hiddenSections.has('formulas') && content.formulas && content.formulas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <Sigma className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">Important Formulas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.formulas.map((form: any, i: number) => (
              <FormulaCard 
                key={i}
                index={i}
                name={form.name}
                formula={form.formula}
                whenToUse={form.whenToUse}
                commonMistake={form.commonMistake}
              />
            ))}
          </div>
        </section>
      )}

      {/* Worked Examples */}
      {!hiddenSections.has('examples') && content.examples && content.examples.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <Target className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">Worked Examples</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {content.examples.map((ex: any, i: number) => (
              <ExampleCard 
                key={i}
                index={i}
                problem={ex.problem}
                solution={ex.solution}
              />
            ))}
          </div>
        </section>
      )}

      {/* Common Mistakes */}
      {!hiddenSections.has('mistakes') && content.commonMistakes && content.commonMistakes.length > 0 && (
        <section className="bg-red-50/50 border border-red-100 rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-red-100 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-red-600 tracking-tight">Common Traps</h2>
          </div>
          <ul className="space-y-4">
            {content.commonMistakes.map((mistake: string, i: number) => (
              <li key={i} className="flex items-start gap-4 font-sans text-red-600/90 leading-relaxed">
                <span className="w-2 h-2 mt-2.5 rounded-full bg-red-500 shrink-0"></span>
                <div className="flex-1 prose prose-slate prose-p:my-0 prose-strong:text-red-700 max-w-none text-red-600/90">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {mistake}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mastery Outcomes */}
      {!hiddenSections.has('masteryOutcomes') && content.masteryOutcomes && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">What You Should Be Able to Do Now</h2>
          </div>
          
          <div className="space-y-6">
            {content.masteryOutcomes.learningObjectives?.length > 0 && (
              <div className="glass-panel bg-white border border-black/10 rounded-2xl p-5 sm:p-8 shadow-sm">
                <h3 className="font-sans font-bold text-sm text-foreground/50 uppercase tracking-wider mb-6">Learning Objectives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.masteryOutcomes.learningObjectives.map((obj: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#FAFAFA] border border-black/5">
                      <div className="mt-1">
                        {obj.difficulty === 'Easy' && <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-[10px] font-bold">E</span>}
                        {obj.difficulty === 'Medium' && <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 text-[10px] font-bold">M</span>}
                        {obj.difficulty === 'Hard' && <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">H</span>}
                      </div>
                      <div>
                        <p className="font-sans font-bold text-[15px] text-foreground mb-1">{obj.objective}</p>
                        <p className="font-sans text-[13px] text-foreground/60">{obj.whyItMatters}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.masteryOutcomes.practiceSuggestions?.length > 0 && (
              <div className="glass-panel bg-brand-4/5 border border-brand-4/20 rounded-2xl p-5 sm:p-8 shadow-sm">
                <h3 className="font-sans font-bold text-sm text-brand-4 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Practice Suggestions
                </h3>
                <ul className="space-y-3">
                  {content.masteryOutcomes.practiceSuggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-foreground/80">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-white border border-brand-4/30 text-brand-4 text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Active Recall */}
      {!hiddenSections.has('activeRecall') && content.activeRecallQuestions && content.activeRecallQuestions.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 text-foreground/80 flex items-center justify-center">
              <Zap className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">Active Recall</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.activeRecallQuestions.map((q: any, i: number) => (
              <QuestionCard 
                key={i}
                index={i}
                question={q.question}
                hint={q.hint}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick Revision */}
      {!hiddenSections.has('quickRevision') && content.quickRevision && (
        <section className="bg-foreground text-background rounded-2xl p-5 sm:p-8 md:p-10 print:bg-white print:text-black print:border print:border-black/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-background/10 text-background shadow-inner flex items-center justify-center print:bg-black/5 print:text-black">
              <Clock className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-bold text-2xl text-background tracking-tight print:text-black">Quick Revision</h2>
          </div>
          <div className="font-sans text-white/80 leading-relaxed prose prose-invert max-w-none print:prose-slate print:text-black/80">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {content.quickRevision}
            </ReactMarkdown>
          </div>
        </section>
      )}

    </div>
  );
}
