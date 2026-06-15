"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, FileText, Download, Printer } from "lucide-react";

export type ExportFormat = "pdf" | "csv" | "md";

export interface SectionOption {
  id: string;
  label: string;
  isAvailable: boolean;
  isCsvCompatible: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSectionIds: string[], format: ExportFormat) => void;
  exportFormat: ExportFormat | null;
  availableSections: SectionOption[];
}

export default function ExportModal({ isOpen, onClose, onConfirm, exportFormat, availableSections }: ExportModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && exportFormat) {
      const initialSelection = new Set<string>();
      availableSections.forEach(sec => {
        if (sec.isAvailable) {
          if (exportFormat === "csv" && !sec.isCsvCompatible) return;
          initialSelection.add(sec.id);
        }
      });
      setSelectedIds(initialSelection);
    }
  }, [isOpen, exportFormat, availableSections]);

  if (!isOpen || !exportFormat) return null;

  const toggleSection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const visibleSections = availableSections.filter(sec => 
    sec.isAvailable && (exportFormat !== "csv" || sec.isCsvCompatible)
  );

  const getFormatDetails = () => {
    switch(exportFormat) {
      case "csv": return { title: "Export to Anki (CSV)", icon: <Download className="w-6 h-6 text-foreground/60" strokeWidth={1.5} />, desc: "Select the flashcard sets you want to export." };
      case "md": return { title: "Export to Obsidian (MD)", icon: <FileText className="w-6 h-6 text-foreground/60" strokeWidth={1.5} />, desc: "Select which sections to include in your markdown file." };
      case "pdf": return { title: "Save as Premium PDF", icon: <Printer className="w-6 h-6 text-foreground/80" strokeWidth={1.5} />, desc: "Select which sections to include in your PDF." };
    }
  };

  const details = getFormatDetails();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-black/10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-black/5 flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center shrink-0">
                {details.icon}
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-foreground tracking-tight">{details.title}</h2>
                <p className="font-sans text-sm text-foreground/60 mt-1">{details.desc}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-foreground/40 hover:text-foreground hover:bg-[#FAFAFA] rounded-full transition-colors">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
            <h3 className="font-sans font-bold text-sm text-foreground/50 uppercase tracking-wider mb-4">Available Sections</h3>
            <div className="space-y-3">
              {visibleSections.length === 0 ? (
                <p className="text-foreground/50 text-sm font-sans italic">No compatible sections found in this note.</p>
              ) : (
                visibleSections.map(sec => {
                  const isSelected = selectedIds.has(sec.id);
                  return (
                    <button
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isSelected ? 'border-foreground bg-[#FAFAFA] shadow-inner' : 'border-black/10 hover:border-black/20 hover:bg-[#FAFAFA]'}`}
                    >
                      <span className={`font-sans font-medium text-[15px] ${isSelected ? 'text-foreground' : 'text-foreground/70'}`}>
                        {sec.label}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-foreground text-background' : 'border border-black/20'}`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-black/5 bg-[#FAFAFA] flex justify-end gap-3 shadow-inner">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-foreground/70 hover:text-foreground hover:bg-white border border-transparent hover:border-black/10 hover:shadow-sm transition-all">
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(Array.from(selectedIds), exportFormat)}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 rounded-xl font-sans font-bold text-[13px] text-background bg-foreground hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Generate Export
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
