"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Lightbulb, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { updateOnboardingData, currentUser, isLoading } = useAuth();
  const router = useRouter();

  // Auth Guard: Prevent users who have completed onboarding from revisiting this page
  React.useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push("/login");
      } else if (currentUser.onboarding_completed) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, currentUser, router]);

  const focusOptions = [
    'JEE (Mains/Advanced)', 
    'NEET (UG/PG)', 
    'UPSC / State PSC', 
    'CA / CS / CMA',
    'CBSE / ICSE Boards',
    'University Exams'
  ];

  const goalOptions = [
    'Score High in Competitive Exams',
    'Crack Top 100 Rank',
    'Better Conceptual Understanding',
    'Save Time Making Notes',
    'Master Problem Solving',
    'Retain Complex Concepts',
    'Improve Exam Speed',
    'Last-Minute Revision'
  ];

  const formatOptions = [
    'Structured Notes',
    'Interactive Flashcards (Anki Compatible)',
    'AI Mock Exams & Quizzes',
    'Deep Concept Explanations'
  ];

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const getTip = () => {
    switch (step) {
      case 1:
        return "Notrik processes over 100,000+ notes daily for top percentile rankers.";
      case 2:
        return "Specialized models are loaded based on your exam to ensure syllabus-accurate extractions.";
      case 3:
        return "Selecting multiple goals helps our AI adapt its output tone—from high-yield summaries to deep conceptual explanations.";
      case 4:
        return "Active recall (Flashcards) combined with Spaced Repetition increases long-term retention by over 300%.";
      case 5:
        return "You're all set to transform hours of manual note-taking into seconds of AI generation.";
      default:
        return "";
    }
  };

  const finishOnboarding = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateOnboardingData({
        exam_target: focus || "",
        goals: goals,
        study_format: formats
      });
      router.push("/checkout");
    } catch (err: any) {
      console.error("Failed to save onboarding data", err);
      setErrorMsg(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start md:justify-center p-6 md:p-12 pb-32">
      {/* Top Left Branding */}
      <div className="relative md:absolute top-0 left-0 md:top-10 md:left-10 z-50 mb-8 md:mb-0 w-full flex justify-start">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo-no-bg.png" alt="Notrik Logo" className="w-24 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      {/* Ambient background removed */}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 relative z-10">
        
        {/* Main Wizard Area */}
        <div className="bg-white p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative w-full overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1.5 bg-black/5 w-full">
            <div className="h-full bg-brand-1 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pt-4">
                <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-tight">Welcome to Notrik.</h2>
                <p className="font-sans text-lg text-foreground/70 mb-10 leading-relaxed max-w-lg">
                  We are going to transform the way you interact with information. 
                  No more manual typing, no more unstructured chaos. Let's set up your personalized workspace.
                </p>
                <button onClick={() => setStep(2)} className="flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-sans text-lg font-bold hover:scale-105 transition-transform shadow-xl">
                  Begin Setup <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pt-4">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 tracking-tight">Choose your Focus</h2>
                <p className="font-sans text-base text-foreground/60 mb-8">What kind of notes do you usually process?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {focusOptions.map((opt, i) => (
                    <div 
                      key={i} 
                      onClick={() => setFocus(opt)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                        focus === opt ? 'border-brand-1 bg-brand-1/5 shadow-md scale-[1.02]' : 'bg-white border-black/5 hover:border-black/10 hover:shadow-sm hover:-translate-y-0.5'
                      }`}
                    >
                      <span className={`font-sans font-bold ${focus === opt ? 'text-brand-1' : 'text-foreground/80'}`}>{opt}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${focus === opt ? 'bg-brand-1 text-white' : 'bg-black/10 text-transparent group-hover:bg-black/20'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!focus}
                  className="flex items-center gap-3 px-8 py-4 rounded-full bg-brand-1 text-white font-sans text-lg font-bold hover:bg-brand-1/90 transition-all disabled:opacity-50 disabled:hover:bg-brand-1 shadow-lg shadow-brand-1/20"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight">What are your primary goals?</h2>
                  <span className="text-xs font-bold font-mono bg-brand-2/10 text-brand-2 px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">Select Multiple</span>
                </div>
                <p className="font-sans text-base text-foreground/60 mb-8">This helps us tune the AI extractions.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {goalOptions.map((opt, i) => {
                    const isSelected = goals.includes(opt);
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleSelection(opt, goals, setGoals)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                          isSelected ? 'border-brand-2 bg-brand-2/5 shadow-sm scale-[1.01]' : 'bg-white border-black/5 hover:border-black/10 hover:shadow-sm hover:-translate-y-0.5'
                        }`}
                      >
                        <span className={`font-sans font-semibold text-sm ${isSelected ? 'text-brand-2' : 'text-foreground/80'}`}>{opt}</span>
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-2 text-white' : 'bg-black/10 text-transparent group-hover:bg-black/20'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setStep(4)} 
                  disabled={goals.length === 0}
                  className="flex items-center gap-3 px-8 py-4 rounded-full bg-brand-2 text-white font-sans text-lg font-bold hover:bg-brand-2/90 transition-all disabled:opacity-50 disabled:hover:bg-brand-2 shadow-lg shadow-brand-2/20"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight">Preferred Study Format?</h2>
                  <span className="text-xs font-bold font-mono bg-brand-3/10 text-brand-3 px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">Select Multiple</span>
                </div>
                <p className="font-sans text-base text-foreground/60 mb-8">How do you prefer to consume your generated notes?</p>
                <div className="flex flex-col gap-4 mb-10">
                  {formatOptions.map((opt, i) => {
                    const isSelected = formats.includes(opt);
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleSelection(opt, formats, setFormats)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                          isSelected ? 'border-brand-3 bg-brand-3/5 shadow-md scale-[1.01]' : 'bg-white border-black/5 hover:border-black/10 hover:shadow-sm hover:-translate-y-0.5'
                        }`}
                      >
                        <span className={`font-sans font-bold ${isSelected ? 'text-brand-3' : 'text-foreground/80'}`}>{opt}</span>
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-3 text-white' : 'bg-black/10 text-transparent group-hover:bg-black/20'}`}>
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setStep(5)} 
                  disabled={formats.length === 0}
                  className="flex items-center gap-3 px-8 py-4 rounded-full bg-brand-3 text-white font-sans text-lg font-bold hover:bg-brand-3/90 transition-all disabled:opacity-50 disabled:hover:bg-brand-3 shadow-lg shadow-brand-3/20"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pt-4">
                <div className="w-20 h-20 bg-brand-4/10 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-10 h-10 text-brand-4" />
                </div>
                <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-tight">You're all set.</h2>
                <div className="font-sans text-lg text-foreground/80 mb-10 leading-relaxed bg-black/5 p-6 rounded-2xl border border-black/10">
                  Your pipeline is primed. We have optimized Notrik for <strong className="text-brand-1">{focus}</strong> to help you achieve <strong className="text-brand-2">{goals.join(" and ")}</strong> by generating <strong className="text-brand-3">{formats.join(" and ")}</strong>.
                </div>
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 font-sans text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                <button 
                  onClick={finishOnboarding}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center w-full md:w-auto gap-3 px-10 py-5 rounded-full bg-brand-4 text-white font-sans text-xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-4/30 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? "Saving..." : "Unlock Notrik Pro"} <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pro Tips Sidebar */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="bg-brand-2/5 p-8 rounded-[2rem] border border-brand-2/20 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Lightbulb className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-brand-2 font-mono font-bold text-sm uppercase tracking-wider mb-4">
              <Lightbulb className="w-4 h-4" /> Pro Tip
            </div>
            <AnimatePresence mode="wait">
              <motion.p 
                key={step} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-lg font-medium leading-relaxed text-foreground/80 relative z-10"
              >
                "{getTip()}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}
