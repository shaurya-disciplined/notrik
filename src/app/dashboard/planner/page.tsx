"use client";
import React, { useContext, useState, useMemo } from "react";
import { 
  LayoutGrid, Calendar as CalendarIcon, Plus, Table2, 
  ListTodo, CheckCircle2, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardContext } from "../layout";

export default function PlannerPage() {
  const { 
    tasks, setTasks,
    classes, setClasses,
    assignments, setAssignments,
    exams, setExams
  } = useContext(DashboardContext);

  const [newTaskInput, setNewTaskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"deadline" | "revision">("deadline");
  const [inputTitle, setInputTitle] = useState("");
  const [inputMeta, setInputMeta] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...(tasks || []), { id: Date.now().toString(), text: newTaskInput, completed: false, subject: "" }]);
    setNewTaskInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((tasks || []).map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks((tasks || []).filter((t: any) => t.id !== id));
  };

  const openAddModal = (type: "deadline" | "revision") => {
    setModalType(type);
    setInputTitle("");
    setInputMeta("");
    setIsModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    if (modalType === "deadline") {
      const due = inputMeta.trim() || "Upcoming";
      setAssignments([...(assignments || []), { id: Date.now().toString(), title: inputTitle, due }]);
    } else {
      const date = inputMeta.trim() || "TBD";
      setExams([...(exams || []), { id: Date.now().toString(), title: inputTitle, date }]);
    }
    setIsModalOpen(false);
  };

  // Calculate Progress based on tasks completion
  const progress = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t: any) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* Weekly Overview Header */}
        <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-8 mb-6 border border-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-gradient-to-br from-brand-3/5 via-brand-4/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-full border-4 border-black/5 flex items-center justify-center shrink-0 shadow-inner">
              <span className="font-serif font-black text-xl text-brand-3">{progress}%</span>
              {/* SVG Circle for progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={`${(progress / 100) * 289} 289`} className="text-brand-3 transition-all duration-1000" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif font-black text-3xl mb-2 tracking-tight flex items-center gap-2">
                <span className="text-gradient">Study Planner</span> <span>📅</span>
              </h1>
              <p className="font-sans text-foreground/50 text-[15px] font-medium">You've studied approximately <strong className="text-brand-3">12 hours</strong> this week. Keep crushing goals!</p>
            </div>
          </div>
          <button onClick={() => openAddModal("deadline")} className="bg-gradient-to-r from-brand-3 to-brand-4 hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)] text-white px-6 py-3.5 rounded-xl font-sans font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
            <Plus className="w-4 h-4" strokeWidth={2.5} /> New Task
          </button>
        </div>

        {/* Three Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: This Week's Focus */}
          <section className="glass-panel rounded-[2rem] p-5.5 flex flex-col h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-black/5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4.5 h-4.5 text-brand-3" strokeWidth={2} />
                <h2 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-foreground">This Week's Focus</h2>
              </div>
              <span className="text-sm">🎯</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {tasks && tasks.length > 0 ? (
                tasks.map((task: any) => (
                  <div key={task.id} className="p-4 bg-white/70 backdrop-blur-sm border border-black/5 rounded-2xl flex items-start gap-3.5 group shadow-sm hover:shadow-md hover:border-brand-3/20 transition-all">
                    <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-brand-3 text-white' : 'border border-black/20 hover:border-brand-3/50'}`}>
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-sans text-[13px] leading-relaxed transition-all ${task.completed ? 'text-foreground/45 line-through' : 'text-foreground font-semibold'}`}>{task.text}</p>
                    </div>
                    <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-red-500 rounded-md transition-all shrink-0">
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/40 font-sans p-6">
                  <ListTodo className="w-10 h-10 mb-3 text-foreground/30" strokeWidth={1.5} />
                  <p className="text-xs font-semibold uppercase tracking-wider">No focus topics yet</p>
                  <p className="text-[11px] text-foreground/40 mt-1 max-w-[200px] mx-auto">Add key subject milestones you're planning to target.</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2">
              <input 
                type="text" 
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add a focus topic..." 
                className="flex-1 bg-white border border-black/10 shadow-sm rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-brand-3 focus:ring-4 focus:ring-brand-3/10 transition-all font-semibold"
              />
            </form>
          </section>

          {/* Column 2: Assignments & Deadlines */}
          <section className="glass-panel rounded-[2rem] p-5.5 flex flex-col h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-black/5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Table2 className="w-4.5 h-4.5 text-brand-3" strokeWidth={2} />
                <h2 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-foreground">Deadlines & Deliverables</h2>
              </div>
              <span className="text-sm">⏳</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {assignments && assignments.length > 0 ? (
                assignments.map((assignment: any) => (
                  <div key={assignment.id} className="p-4 bg-white/70 backdrop-blur-sm border border-black/5 rounded-2xl flex flex-col gap-2 group relative shadow-sm hover:shadow-md hover:border-brand-3/20 transition-all">
                    <h3 className="font-sans font-bold text-[13px] text-foreground pr-8 leading-tight">{assignment.title}</h3>
                    <div className="font-sans text-[10px] text-brand-3 bg-brand-3/10 px-2 py-1 rounded-md max-w-fit flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <CalendarIcon className="w-3.5 h-3.5" strokeWidth={2} /> Due: {assignment.due}
                    </div>
                    <button onClick={() => setAssignments((assignments || []).filter((a: any) => a.id !== assignment.id))} className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-red-500 rounded-md transition-all">
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/40 font-sans p-6">
                  <CalendarIcon className="w-10 h-10 mb-3 text-foreground/30" strokeWidth={1.5} />
                  <p className="text-xs font-semibold uppercase tracking-wider">No assignments pending</p>
                </div>
              )}
            </div>
            <button onClick={() => openAddModal("deadline")} className="mt-4 w-full py-3.5 rounded-xl border border-dashed border-black/15 text-foreground/45 hover:border-brand-3/50 hover:text-brand-3 hover:bg-white transition-all font-sans font-bold text-xs uppercase tracking-wider shadow-sm">
              + Add Deadline
            </button>
          </section>

          {/* Column 3: Revision Schedule */}
          <section className="glass-panel rounded-[2rem] p-5.5 flex flex-col h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-black/5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4.5 h-4.5 text-brand-3" strokeWidth={2} />
                <h2 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-foreground">Revision Schedule</h2>
              </div>
              <span className="text-sm">🔄</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {exams && exams.length > 0 ? (
                exams.map((exam: any) => (
                  <div key={exam.id} className="p-4 bg-white/70 backdrop-blur-sm border border-black/5 rounded-2xl flex flex-col gap-2 group relative shadow-sm hover:shadow-md hover:border-brand-3/20 transition-all">
                    <h3 className="font-sans font-bold text-[13px] text-foreground pr-8 leading-tight">{exam.title}</h3>
                    <div className="font-sans text-[10px] text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md max-w-fit flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <CalendarIcon className="w-3.5 h-3.5" strokeWidth={2} /> Review: {exam.date}
                    </div>
                    <button onClick={() => setExams((exams || []).filter((e: any) => e.id !== exam.id))} className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-red-500 rounded-md transition-all">
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/40 font-sans p-6">
                  <CalendarIcon className="w-10 h-10 mb-3 text-foreground/30" strokeWidth={1.5} />
                  <p className="text-xs font-semibold uppercase tracking-wider">No revision milestones</p>
                </div>
              )}
            </div>
            <button onClick={() => openAddModal("revision")} className="mt-4 w-full py-3.5 rounded-xl border border-dashed border-black/15 text-foreground/45 hover:border-brand-3/50 hover:text-brand-3 hover:bg-white transition-all font-sans font-bold text-xs uppercase tracking-wider shadow-sm">
              + Schedule Revision
            </button>
          </section>

        </div>

      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative z-10 border border-black/5 flex flex-col gap-6"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/50" strokeWidth={2} />
              </button>

              <div>
                <h2 className="font-serif font-black text-2xl text-gradient mb-1">
                  {modalType === "deadline" ? "Add Deadline" : "Schedule Revision"}
                </h2>
                <p className="font-sans text-[13px] text-foreground/60 font-medium leading-relaxed">
                  {modalType === "deadline" 
                    ? "Add a homework task, subject sheet, or exam deadline to stay on track." 
                    : "Create revision triggers for key subject nodes."}
                </p>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                    {modalType === "deadline" ? "Deadline Item" : "Subject Topic"}
                  </label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    placeholder={modalType === "deadline" ? "E.g., Organic Chemistry Sheet" : "E.g., Quantum Physics Mock"} 
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                    {modalType === "deadline" ? "Date / Timing" : "Revision Trigger"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={modalType === "deadline" ? "E.g., Dec 12th, Tomorrow" : "E.g., Next Friday, Dec 18th"} 
                    value={inputMeta}
                    onChange={(e) => setInputMeta(e.target.value)}
                    className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 font-sans text-sm outline-none focus:bg-white focus:border-brand-3 focus:ring-4 focus:ring-brand-3/15 transition-all font-semibold"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!inputTitle.trim()}
                  className="w-full bg-gradient-to-r from-brand-3 to-brand-4 text-white font-sans font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-brand-3/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm"
                >
                  Save Milestone ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
